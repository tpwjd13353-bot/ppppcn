import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignupForm } from "./SignupForm";

export const metadata = {
  title: "회원가입 — 퍼플페퍼",
  description: "이메일·휴대폰 인증으로 가입하세요.",
};

export default async function SignupPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg rounded-2xl border border-border/40 bg-background/60 p-8 backdrop-blur">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          회원가입
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          이미 회원이신가요?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            로그인
          </Link>
        </p>

        <SignupForm />
      </div>
    </main>
  );
}
