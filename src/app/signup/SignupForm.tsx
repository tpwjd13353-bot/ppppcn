"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, CheckCircle2 } from "lucide-react";

const INDUSTRIES = ["외식", "뷰티", "레저", "숙박·호텔", "기타"];

const inputCls =
  "w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none disabled:opacity-60";
const labelCls = "mb-1.5 block text-xs font-medium text-foreground/80";

export function SignupForm() {
  const router = useRouter();

  // form 필드
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [region, setRegion] = useState("");
  const [industry, setIndustry] = useState("");
  const [placeUrl, setPlaceUrl] = useState("");

  // 휴대폰 인증 상태
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  // 재요청 쿨다운
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // 제출
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendCode() {
    setError(null);
    setSending(true);
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, purpose: "signup" }),
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
      body: JSON.stringify({ phone, code, purpose: "signup" }),
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
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        phone,
        businessName,
        region,
        industry,
        placeUrl,
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      setError(data.error || "가입에 실패했어요.");
      setSubmitting(false);
      return;
    }

    // 가입 성공 → 자동 로그인
    const signed = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (signed?.error) {
      router.push("/login");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {/* 휴대폰 인증 */}
      <div>
        <label className={labelCls}>
          휴대폰 번호 <span className="text-primary">*</span>
        </label>
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
              pattern="\d{6}"
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
        <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          휴대폰 인증 완료
        </div>
      )}

      {/* 이메일 */}
      <div>
        <label className={labelCls}>
          이메일 <span className="text-primary">*</span>
        </label>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </div>

      {/* 비밀번호 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>
            비밀번호 <span className="text-primary">*</span>
          </label>
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
          <label className={labelCls}>
            비밀번호 확인 <span className="text-primary">*</span>
          </label>
          <input
            type="password"
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* 상호명 */}
      <div>
        <label className={labelCls}>
          상호명 <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="예) 퍼플페퍼"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>지역 (선택)</label>
          <input
            type="text"
            placeholder="예) 홍대"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>업종 (선택)</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className={inputCls}
          >
            <option value="">선택 안 함</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>네이버 플레이스 URL (선택)</label>
        <input
          type="url"
          placeholder="https://map.naver.com/..."
          value={placeUrl}
          onChange={(e) => setPlaceUrl(e.target.value)}
          className={inputCls}
        />
      </div>

      {error && (
        <p className="text-xs text-rose-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || !verified}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        가입하기
      </button>
    </form>
  );
}
