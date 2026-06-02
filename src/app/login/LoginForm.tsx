"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface Props {
  callbackUrl: string;
  initialError?: string;
}

const inputCls =
  "w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none";

export function LoginForm({ callbackUrl, initialError }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    initialError ? "이메일 또는 비밀번호가 올바르지 않아요." : null,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("이메일 또는 비밀번호가 올바르지 않아요.");
      setSubmitting(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        required
        placeholder="이메일 주소"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={submitting}
        className={inputCls}
      />
      <input
        type="password"
        required
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={submitting}
        className={inputCls}
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-foreground/20 text-sm font-bold transition hover:border-primary hover:text-primary disabled:opacity-60"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        이메일로 로그인
      </button>
      <div className="flex justify-end pt-1">
        <Link
          href="/reset-password"
          className="text-xs text-muted-foreground hover:text-primary"
        >
          비밀번호를 잊으셨나요?
        </Link>
      </div>
    </form>
  );
}
