import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signIn } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "로그인 — 퍼플페퍼",
  description: "이메일·비밀번호 또는 카카오로 로그인하세요.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;
  const redirectTo = callbackUrl ?? "/onboarding";

  if (session?.user) redirect(redirectTo);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-2xl border border-border/40 bg-background/60 p-8 backdrop-blur">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          로그인
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          처음이신가요?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            회원가입
          </Link>
        </p>

        {/* 카카오 로그인 */}
        <form
          action={async () => {
            "use server";
            await signIn("kakao", { redirectTo });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#FEE500] text-sm font-bold text-[#191919] transition hover:brightness-95"
          >
            <KakaoIcon />
            카카오로 로그인
          </button>
        </form>

        {/* 구분선 */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/40" />
          <span className="font-body-en text-[10px] uppercase tracking-wider text-muted-foreground/60">
            or
          </span>
          <div className="h-px flex-1 bg-border/40" />
        </div>

        {/* 이메일 + 비밀번호 */}
        <LoginForm callbackUrl={redirectTo} initialError={error} />

        <p className="mt-6 text-xs text-muted-foreground">
          로그인하면{" "}
          <Link href="/about" className="underline hover:text-foreground">
            서비스 이용약관
          </Link>{" "}
          및 개인정보 처리방침에 동의한 것으로 간주됩니다.
        </p>
      </div>
    </main>
  );
}

function KakaoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9 1.5C4.582 1.5 1 4.265 1 7.676c0 2.227 1.523 4.18 3.815 5.291l-.78 2.85c-.07.255.215.46.443.317l3.42-2.249c.36.04.727.06 1.102.06 4.418 0 8-2.765 8-6.176C17 4.265 13.418 1.5 9 1.5Z" />
    </svg>
  );
}
