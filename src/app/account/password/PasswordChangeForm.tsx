"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  hasPassword: boolean;
}

const inputCls =
  "w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none disabled:opacity-60";
const labelCls = "block text-xs font-medium text-muted-foreground mb-1.5";

export function PasswordChangeForm({ hasPassword }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (next.length < 8) {
      setError("새 비밀번호는 8자 이상이어야 해요.");
      return;
    }
    if (next !== confirm) {
      setError("새 비밀번호 확인이 일치하지 않아요.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: hasPassword ? current : undefined,
          newPassword: next,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "변경에 실패했어요.");
        setSubmitting(false);
        return;
      }
      setDone(true);
      setSubmitting(false);
      setCurrent("");
      setNext("");
      setConfirm("");
      // 4초 후 새로고침 → 다음 로그인부터 새 비번 사용 (현 세션은 JWT라 즉시 만료 안 됨)
      setTimeout(() => router.refresh(), 4000);
    } catch {
      setError("네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          <div>
            <p className="text-sm font-semibold text-emerald-500">
              비밀번호가 변경됐어요.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              다음 로그인부터 새 비밀번호를 사용해주세요. 현재 세션은 그대로 유지됩니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {hasPassword && (
        <div>
          <label htmlFor="current" className={labelCls}>
            현재 비밀번호
          </label>
          <input
            id="current"
            type="password"
            required
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            disabled={submitting}
            className={inputCls}
            placeholder="현재 비밀번호"
          />
        </div>
      )}

      <div>
        <label htmlFor="next" className={labelCls}>
          새 비밀번호 <span className="text-muted-foreground/70">(8자 이상)</span>
        </label>
        <input
          id="next"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          disabled={submitting}
          className={inputCls}
          placeholder="새 비밀번호"
        />
      </div>

      <div>
        <label htmlFor="confirm" className={labelCls}>
          새 비밀번호 확인
        </label>
        <input
          id="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={submitting}
          className={inputCls}
          placeholder="새 비밀번호 다시 입력"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-rose-500/40 bg-rose-500/5 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
          <p className="text-xs text-rose-500">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {hasPassword ? "비밀번호 변경" : "비밀번호 설정"}
      </button>
    </form>
  );
}
