"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

const INDUSTRIES = ["외식", "뷰티", "레저", "숙박·호텔", "기타"];

const inputCls =
  "w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none disabled:opacity-60";
const labelCls = "mb-1.5 block text-xs font-medium text-foreground/80";

export function SignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [region, setRegion] = useState("");
  const [industry, setIndustry] = useState("");
  const [placeUrl, setPlaceUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("비밀번호는 8자 이상으로 설정해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않아요.");
      return;
    }
    if (!/^010\d{8}$/.test(phone)) {
      setError("휴대폰 번호 형식이 올바르지 않아요. (01012345678)");
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

      <div>
        <label className={labelCls}>
          휴대폰 번호 <span className="text-primary">*</span>
        </label>
        <input
          type="tel"
          required
          placeholder="01012345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
          className={inputCls}
        />
      </div>

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

      {error && <p className="text-xs text-rose-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        가입하기
      </button>
    </form>
  );
}
