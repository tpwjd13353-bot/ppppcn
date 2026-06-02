import Link from "next/link";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata = {
  title: "비밀번호 재설정 — 퍼플페퍼",
};

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-2xl border border-border/40 bg-background/60 p-8 backdrop-blur">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          비밀번호 재설정
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          가입 시 등록한 휴대폰으로 인증 후 비밀번호를 새로 설정합니다.
        </p>

        <ResetPasswordForm />

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/login" className="hover:text-primary">
            ← 로그인 페이지로
          </Link>
        </p>
      </div>
    </main>
  );
}
