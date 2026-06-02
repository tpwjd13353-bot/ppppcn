import { AnalyzeForm } from "./AnalyzeForm";
import { checkRateLimit } from "@/lib/analyze/rate-limit";
import { headers } from "next/headers";

export const metadata = {
  title: "중국 관광객 상권 분석 — 퍼플페퍼",
  description: "네이버 플레이스 URL만 넣으면 중국 관광객 선호도를 분석해드려요.",
};

export const dynamic = "force-dynamic";

export default async function AnalyzePage() {
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

      <AnalyzeForm tier={limit.tier} />

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        <Step n={1} title="네이버 URL 입력" body="모바일 / PC URL 모두 가능" />
        <Step n={2} title="자동 분석" body="상권 점수 + 메뉴 점수 계산" />
        <Step n={3} title="한 장 보고서" body="공유 가능한 결과 페이지" />
      </section>
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
