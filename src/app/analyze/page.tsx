import Link from "next/link";
import { headers } from "next/headers";
import { UserPlus, LogIn, MessageCircle, Sparkles } from "lucide-react";
import { AnalyzeForm } from "./AnalyzeForm";
import { checkRateLimit, LIMITS } from "@/lib/analyze/rate-limit";
import { auth } from "@/lib/auth";

// 문의 채널 (로그인 안 된 방문자용 보조 CTA)
const KAKAO_OPEN_CHAT = "https://open.kakao.com/o/skmX5Pwi";

export const metadata = {
  title: "AI 상권 분석 — 퍼플페퍼",
  description:
    "네이버 플레이스 URL 하나로 중국 관광객 상권 적합성을 자동 분석합니다. 회원 가입 후 하루 3회 무료.",
};

export const dynamic = "force-dynamic";

export default async function AnalyzePage() {
  const session = await auth();

  if (!session?.user) {
    return <LoginRequiredNotice />;
  }

  const h = await headers();
  const fakeReq = new Request("http://localhost/analyze", { headers: h });
  const limit = await checkRateLimit(fakeReq, "analyze");

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
      <header className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          따종디엔핑 분석 도구
        </p>
        <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight md:text-5xl">
          중국 관광객, 우리 가게 어때?
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          네이버 플레이스 URL만 넣으시면 1분 안에 점수 보고서를 드려요.
          <br />
          상권·메뉴 데이터로 정량 분석합니다.
        </p>
      </header>

      <AnalyzeForm
        tier={limit.tier}
        remaining={limit.remaining}
        limit={limit.limit}
      />

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        <Step n={1} title="네이버 URL 입력" body="모바일 / PC URL 모두 가능" />
        <Step n={2} title="자동 분석" body="상권 점수 + 메뉴 점수 계산" />
        <Step n={3} title="한 장 보고서" body="공유 가능한 결과 페이지" />
      </section>
    </main>
  );
}

function LoginRequiredNotice() {
  const dailyLimit = LIMITS.analyze.member;
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-20 md:py-28">
      <header className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-primary">
          AI 상권 분석
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight md:text-4xl">
          로그인하시면 바로 사용하실 수 있어요
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          회원 가입 시 하루 {dailyLimit}회 무료 분석을 제공합니다.
          <br />
          네이버 플레이스 URL만 넣으시면 1분 안에 점수 보고서가 나옵니다.
        </p>
      </header>

      <section className="mt-12 space-y-3">
        <Link
          href="/signup?callbackUrl=/analyze"
          className="group flex items-center gap-4 rounded-2xl border border-primary bg-primary p-5 text-primary-foreground transition hover:opacity-90"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <UserPlus className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium opacity-80">
              처음이신가요?
            </p>
            <p className="mt-1 text-lg font-bold">회원가입하고 바로 분석하기</p>
            <p className="mt-1 text-xs opacity-75">
              가입 즉시 하루 {dailyLimit}회 무료 이용 가능
            </p>
          </div>
        </Link>

        <Link
          href="/login?callbackUrl=/analyze"
          className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-background/40 p-5 transition hover:border-primary hover:bg-background/60"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background">
            <LogIn className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              이미 회원이신가요?
            </p>
            <p className="mt-1 text-lg font-bold">로그인하기</p>
            <p className="mt-1 text-xs text-muted-foreground">
              카카오톡 또는 이메일 로그인
            </p>
          </div>
        </Link>
      </section>

      <div className="mt-10 rounded-xl border border-border/40 bg-background/40 p-5">
        <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <MessageCircle className="h-3.5 w-3.5" />
          궁금한 점이 있으신가요?
        </p>
        <p className="mt-2 text-sm">
          <a
            href={KAKAO_OPEN_CHAT}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
          >
            카카오톡 오픈채팅
          </a>
          {"으로 편하게 문의 주세요. 매장 URL 보내주시면 담당자가 직접 분석 결과를 드립니다."}
        </p>
      </div>
    </main>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-background/40 p-6 backdrop-blur">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 font-heading text-sm font-bold text-primary">
        {n}
      </div>
      <h3 className="mt-4 font-heading text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
