"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, AlertCircle } from "lucide-react";

interface Props {
  tier: "guest" | "member" | "admin";
}

export function AnalyzeForm({ tier }: Props) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<{ message: string; hint?: string } | null>(
    null,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      setError({ message: "네이버 플레이스 URL을 입력해주세요." });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();

      if (!data.ok) {
        setError({ message: data.error, hint: data.hint });
        setSubmitting(false);
        return;
      }

      router.push(`/analyze/result/${data.id}`);
    } catch {
      setError({
        message: "분석 중 오류가 발생했어요.",
        hint: "잠시 후 다시 시도해주세요.",
      });
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-12 rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur md:p-8">
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {tier === "admin" ? (
            <span className="text-primary">어드민: 무제한 이용</span>
          ) : (
            <span>상권 분석 무제한 · PDF 보고서는 회원 가입 후 3회</span>
          )}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="naver-url" className="text-sm font-medium">
          네이버 플레이스 URL
        </label>
        <input
          id="naver-url"
          type="text"
          inputMode="url"
          placeholder="https://naver.me/Fio7BDHa  또는  네이버 플레이스 주소"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={submitting}
          className="w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              AI 분석 중... (15~25초 걸려요)
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              분석 시작
            </>
          )}
        </button>

        <div className="mt-3 rounded-md border border-border/30 bg-background/40 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground/80">붙여넣기 가능한 형태:</p>
          <ul className="mt-1.5 space-y-1">
            <li>
              · 단축링크{" "}
              <span className="font-mono text-foreground/70">https://naver.me/...</span>
            </li>
            <li>
              · 모바일{" "}
              <span className="font-mono text-foreground/70">
                https://m.place.naver.com/restaurant/...
              </span>
            </li>
            <li>
              · PC 지도{" "}
              <span className="font-mono text-foreground/70">
                https://map.naver.com/p/entry/place/...
              </span>
            </li>
          </ul>
          <p className="mt-2 text-muted-foreground/70">
            네이버 지도 / 플레이스에서 가게 검색 → <b className="text-foreground/70">공유</b> 버튼 → URL 복사 → 여기에 붙여넣기
          </p>
        </div>
      </form>

      {error && (
        <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div className="text-sm">
              <p className="font-medium text-destructive">{error.message}</p>
              {error.hint && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {error.hint}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
