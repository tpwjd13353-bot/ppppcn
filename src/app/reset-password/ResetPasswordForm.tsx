"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

const inputCls =
  "w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none disabled:opacity-60";
const labelCls = "mb-1.5 block text-xs font-medium text-foreground/80";

export function ResetPasswordForm() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSendCode() {
    setError(null);
    setSending(true);
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, purpose: "reset" }),
    });
    const data = await res.json();
    setSending(false);
    if (!data.ok) {
      setError(data.error || "인증번호 발송에 실패했어요.");
      return;
    }
    setSent(true);
    setCooldown(60);
  }

  async function handleVerifyCode() {
    setError(null);
    setVerifying(true);
    const res = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code, purpose: "reset" }),
    });
    const data = await res.json();
    setVerifying(false);
    if (!data.ok) {
      setError(data.error || "인증번호가 일치하지 않아요.");
      return;
    }
    setVerified(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!verified) {
      setError("휴대폰 인증을 완료해주세요.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상으로 설정해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않아요.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
    const data = await res.json();
    if (!data.ok) {
      setError(data.error || "재설정에 실패했어요.");
      setSubmitting(false);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/login"), 1500);
  }

  if (done) {
    return (
      <div className="mt-8 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4 text-center text-sm text-emerald-600">
        <CheckCircle2 className="mx-auto mb-2 h-6 w-6" />
        비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다…
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label className={labelCls}>휴대폰 번호</label>
        <div className="flex gap-2">
          <input
            type="tel"
            required
            placeholder="01012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
            disabled={verified}
            className={inputCls}
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={
              sending ||
              verified ||
              cooldown > 0 ||
              !/^010\d{8}$/.test(phone)
            }
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-md border border-foreground/20 px-4 text-xs font-bold transition hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : cooldown > 0 ? (
              `${cooldown}초`
            ) : sent ? (
              "재발송"
            ) : (
              "인증요청"
            )}
          </button>
        </div>
      </div>

      {sent && !verified && (
        <div>
          <label className={labelCls}>인증번호 (6자리)</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              className={inputCls}
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={verifying || code.length !== 6}
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-md bg-primary px-4 text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "확인"}
            </button>
          </div>
        </div>
      )}

      {verified && (
        <>
          <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            인증 완료
          </div>
          <div>
            <label className={labelCls}>새 비밀번호</label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="8자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>새 비밀번호 확인</label>
            <input
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className={inputCls}
            />
          </div>
        </>
      )}

      {error && <p className="text-xs text-rose-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !verified}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        비밀번호 재설정
      </button>
    </form>
  );
}
