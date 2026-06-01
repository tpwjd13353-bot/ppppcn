import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signIn } from "@/lib/auth";

export const metadata = {
  title: "로그인 — 퍼플페퍼",
  description: "카카오 계정으로 빠르게 시작하세요.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  // 가입 직후엔 무조건 /onboarding 거치게 (프로필 완성됐으면 즉시 메인으로 빠짐)
  const redirectTo = callbackUrl ?? "/onboarding";

  if (session?.user) redirect(redirectTo);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-2xl border border-border/40 bg-background/60 p-8 backdrop-blur">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          로그인 / 가입
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          카카오 계정으로 3초 안에 시작할 수 있어요. 별도 가입 절차는 없습니다.
        </p>

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
            카카오로 시작하기
          </button>
        </form>

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
