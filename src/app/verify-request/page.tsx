import Link from "next/link";
import { Mail } from "lucide-react";

export const metadata = {
  title: "이메일을 확인해주세요 — 퍼플페퍼",
};

export default function VerifyRequestPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-2xl border border-border/40 bg-background/60 p-8 text-center backdrop-blur">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Mail className="h-7 w-7" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold tracking-tight">
          이메일을 확인해주세요
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          로그인 링크를 보냈어요. 받은 메일함에서 링크를 클릭하면
          자동으로 로그인됩니다.
          <br />
          <br />
          메일이 안 보이면 스팸함도 확인해주세요.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block text-sm font-semibold text-primary hover:underline"
        >
          ← 로그인 페이지로
        </Link>
      </div>
    </main>
  );
}
