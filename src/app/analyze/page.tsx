import Link from "next/link";
import { headers } from "next/headers";
import { MessageCircle, Phone, Lock, Sparkles } from "lucide-react";
import { AnalyzeForm } from "./AnalyzeForm";
import { checkRateLimit } from "@/lib/analyze/rate-limit";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

// 담당자·문의 채널 — 사이트 다른 곳과 정보 통일
const KAKAO_OPEN_CHAT = "https://open.kakao.com/o/skmX5Pwi";
const CONTACT_PHONE = "010-2991-5990";
const CONTACT_NAME = "세정 담당자";

export const metadata = {
  title: "AI 상권 분석 (어드민 전용) — 퍼플페퍼",
  description:
    "어드민 계정으로 로그인한 담당자만 사용할 수 있는 AI 매장 분석 도구입니다.",
};

export const dynamic = "force-dynamic";

export default async function AnalyzePage() {
  const session = await auth();
  const admin = isAdminEmail(session?.user?.email);

  if (!admin) {
    return <AdminOnlyNotice loggedIn={!!session?.user} />;
  }

  const h = await headers();
  const fakeReq = new Request("http://localhost/analyze", { headers: h });
  const limit = await checkRateLimit(fakeReq, "analyze");

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
      <header className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          따종디엔핑 분석 도구 · 어드민 전용
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

      <AnalyzeForm tier={limit.tier} />

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        <Step n={1} title="네이버 URL 입력" body="모바일 / PC URL 모두 가능" />
        <Step n={2} title="자동 분석" body="상권 점수 + 메뉴 점수 계산" />
        <Step n={3} title="한 장 보고서" body="공유 가능한 결과 페이지" />
      </section>
    </main>
  );
}

function AdminOnlyNotice({ loggedIn }: { loggedIn: boolean }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-20 md:py-28">
      <header className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-primary">
          AI 상권 분석 · 어드민 전용
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight md:text-4xl">
          이 페이지는 담당자만 사용할 수 있어요
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          매장별 AI 분석 · 잠재 손실 리포트 · PDF 다운로드는 퍼플페퍼 내부 담당자만
          이용 가능한 도구입니다.
          <br />
          분석이 필요하시면 아래로 편하게 연락 주세요.
        </p>
      </header>

      <section className="mt-12 space-y-4">
        <a
          href={KAKAO_OPEN_CHAT}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-2xl border border-[#FEE500]/60 bg-[#FEE500]/10 p-5 transition hover:border-[#FEE500] hover:bg-[#FEE500]/20"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FEE500]">
            <MessageCircle className="h-6 w-6 text-black" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              가장 빠른 응답 · 평균 10분 이내
            </p>
            <p className="mt-1 text-lg font-bold">카카오톡으로 문의하기</p>
            <p className="mt-1 text-xs text-muted-foreground">
              매장 URL 또는 상호명을 보내주시면 AI 분석 결과를 회신드립니다.
            </p>
          </div>
          <Sparkles className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
        </a>

        <a
          href={`tel:${CONTACT_PHONE.replace(/-/g, "")}`}
          className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-background/40 p-5 transition hover:border-primary hover:bg-background/60"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              전화 상담 · 평일 10:00 ~ 19:00
            </p>
            <p className="mt-1 text-lg font-bold tracking-wide">
              {CONTACT_PHONE}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {CONTACT_NAME} · 퍼플페퍼 co., Ltd.
            </p>
          </div>
        </a>
      </section>

      <p className="mt-10 text-center text-xs text-muted-foreground/70">
        {loggedIn
          ? "이미 로그인된 계정은 어드민 권한이 없습니다. 담당자 계정이 필요하시면 위 채널로 문의해주세요."
          : "담당자 계정을 가지고 계시면 로그인 후 이용해주세요."}{" "}
        {!loggedIn && (
          <Link
            href="/login?callbackUrl=/analyze"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            로그인
          </Link>
        )}
      </p>
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
