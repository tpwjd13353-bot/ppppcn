"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, RefreshCw, Edit3 } from "lucide-react";

interface Props {
  analysisId: string;
  unmatchedCount: number;
}

const SLOT_COUNT = 5;

export function RefineForm({ analysisId, unmatchedCount }: Props) {
  const router = useRouter();
  const [slots, setSlots] = useState<string[]>(Array(SLOT_COUNT).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setSlot(i: number, v: string) {
    setSlots((prev) => prev.map((x, idx) => (idx === i ? v : x)));
  }

  async function handleRefine() {
    const additional = slots.map((s) => s.trim()).filter(Boolean);
    if (additional.length === 0) {
      setError("최소 한 개 이상 메뉴를 입력해주세요.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/analyze/${analysisId}/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ additionalMenus: additional }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "재분석에 실패했어요.");
        setSubmitting(false);
        return;
      }
      router.refresh();
      setSubmitting(false);
      setSlots(Array(SLOT_COUNT).fill(""));
    } catch {
      setError("재분석 중 오류가 발생했어요.");
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-6 md:p-8">
      <div className="flex items-start gap-3">
        <Edit3 className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
        <div className="flex-1">
          <h3 className="font-heading text-xl font-bold">
            분석 정확도 높이기
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            정보가 부족한 메뉴가 <strong>{unmatchedCount}개</strong> 있어요.
            <br />
            일반적인 메뉴명으로 직접 입력하시면 점수가 정확해져요.
            (예: <code className="rounded bg-muted/40 px-1.5 py-0.5 text-xs">소 2~3인분 세트</code> → <code className="rounded bg-muted/40 px-1.5 py-0.5 text-xs">한우 등심</code>)
          </p>

          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {slots.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <Plus className="h-3.5 w-3.5 text-muted-foreground/50" />
                <input
                  type="text"
                  value={v}
                  onChange={(e) => setSlot(i, e.target.value)}
                  placeholder={`메뉴 ${i + 1}`}
                  disabled={submitting}
                  className="flex-1 rounded-md border border-border/50 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none disabled:opacity-60"
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="mt-3 text-sm text-rose-500">{error}</p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefine}
              disabled={submitting}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  재분석 중...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  재분석하기
                </>
              )}
            </button>
            <span className="text-xs text-muted-foreground/70">
              · 무료 · 횟수 차감 X
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
