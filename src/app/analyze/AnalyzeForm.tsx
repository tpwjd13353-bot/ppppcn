"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Search, AlertCircle, Lock } from "lucide-react";

interface Props {
  tier: "guest" | "member" | "admin";
  remaining: number;
  limit: number;
}

export function AnalyzeForm({ tier, remaining, limit }: Props) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<{ message: string; hint?: string } | null>(
    null,
  );
  const [rateLimited, setRateLimited] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      setError({ message: "네이버 플레이스 URL을 입력해주세요." });
      return;
    }

    setSubmitting(true);
    setError(null);
    setRateLimited(false);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();

      if (res.status === 429) {
        setRateLimited(true);
        setSubmitting(false);
        return;
      }

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
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {tier === "admin" ? (
            <span className="text-primary">어드민: 무제한 이용</span>
          ) : tier === "member" ? (
            <>
              회원 분석 가능{" "}
              <span className="font-bold text-foreground">
                {remaining} / {limit}
              </span>
              <span className="ml-1 text-xs">(24시간)</span>
            </>
          ) : (
            <>
              남은 무료 분석{" "}
              <span className="font-bold text-foreground">
                {remaining} / {limit}
              </span>
            </>
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
          placeholder="https://m.place.naver.com/restaurant/1234567890/home"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={submitting || rateLimited}
          className="w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={submitting || rateLimited}
          className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              분석 중... (10초 정도)
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              분석 시작
            </>
          )}
        </button>

        <p className="mt-2 text-xs text-muted-foreground">
          예: 네이버 지도에서 가게 검색 → 우측 상단 공유 → URL 복사
        </p>
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

      {rateLimited && (
        <div className="mt-6 rounded-md border border-primary/40 bg-primary/5 p-6">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="flex-1">
              {tier === "guest" ? (
                <>
                  <p className="font-heading text-base font-bold">
                    무료 분석 {limit}회를 모두 사용했어요
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    회원가입하시면 하루 5회까지 이용할 수 있어요. 카카오 3초 가입.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-heading text-base font-bold">
                    오늘 분석 한도를 모두 사용했어요
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    24시간 후 자동으로 초기화돼요. 더 필요하시면 상담을 신청해보세요.
                  </p>
                </>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                {tier === "guest" && (
                  <Link
                    href="/login?callbackUrl=/analyze"
                    className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    카카오로 가입 / 로그인
                  </Link>
                )}
                <Link
                  href="/contact"
                  className="inline-flex h-10 items-center rounded-full border border-foreground/20 px-5 text-sm font-medium hover:border-primary hover:text-primary"
                >
                  상담 신청
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
