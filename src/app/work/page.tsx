import { PageHeader } from "@/components/layout/PageHeader";
import { FinalCTA } from "@/components/sections/FinalCTA";

type Case = {
  name?: string;
  location: string;
  industry: string;
  service: string;
  result: string;
  line: string;
  tag: string;
  image?: string;
};

const CASES: Case[] = [
  {
    name: "육지",
    location: "홍대",
    industry: "고기집",
    service: "매장 운영 + 통합 마케팅",
    result: "연 매출 15억",
    line: "직접 운영하며 마케팅 공식을 검증한, 홍대 줄 서는 고기집.",
    tag: "검증",
  },
  {
    location: "여수",
    industry: "외식 · 직접 운영",
    service: "매장 운영 + 통합 마케팅",
    result: "연 매출 58억",
    line: "지방 상권에서 검증한 중국인 관광객 매출 모델.",
    tag: "검증",
  },
  {
    location: "전국",
    industry: "F&B 프랜차이즈",
    service: "통합 마케팅 + 출점 컨설팅",
    result: "12개 지점 확장",
    line: "마케팅으로 만들어진 확장 가능한 매장 모델.",
    tag: "확장",
  },
  {
    location: "부산",
    industry: "한식 · 해산물",
    service: "따종디엔핑 입점 + 샤오홍슈 체험단",
    result: "중국인 관광객 유입 급증",
    line: "중국 SNS 자연 흐름에 진입해 줄 서는 매장으로 전환.",
    tag: "운영",
  },
  {
    location: "서면",
    industry: "중식 · 훠궈",
    service: "따종디엔핑 광고 + 매장 페이지 세팅",
    result: "매장 앞 대기 줄 형성",
    line: "광고 노출 → 자연 검색 → 결제까지 한 흐름으로 연결.",
    tag: "운영",
  },
  {
    location: "한남",
    industry: "뷰티 · 헤어샵",
    service: "샤오홍슈 KOC + 따종디엔핑 입점",
    result: "중국인 예약 비중 상승",
    line: "K-뷰티 콘텐츠로 발견 → 예약까지 연결되는 흐름 설계.",
    tag: "운영",
  },
  {
    location: "경복궁 인근",
    industry: "레저 · 한복 체험",
    service: "고덕지도 + 샤오홍슈 콘텐츠",
    result: "체험 예약 문의 증가",
    line: "체험형 콘텐츠를 중국 지도·SNS 동선에 노출.",
    tag: "운영",
  },
  {
    location: "성수",
    industry: "외식 · 카페",
    service: "따종디엔핑 입점 + 리뷰 관리",
    result: "검색 상위 노출 안착",
    line: "감성 카페 콘텐츠로 핫플 상권 검색 점유.",
    tag: "운영",
  },
];

const TAG_COLORS: Record<string, string> = {
  검증: "border-primary/60 text-primary",
  확장: "border-amber-400/60 text-amber-400",
  운영: "border-border/50 text-muted-foreground",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title={
          <>
            우리가 직접 만든
            <br />
            매장의 <span className="text-primary">결과</span>.
          </>
        }
        subtitle="마케팅 공식을 매장에서 직접 검증하고, 검증된 공식을 다른 매장에 동일하게 적용합니다."
      />

      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {CASES.map((c, i) => (
                <article
                  key={c.location + i}
                  className="group relative border border-border/40 bg-background p-8 transition-colors hover:border-primary/60"
                >
                  <div
                    className={`absolute right-6 top-6 rounded-full border px-2 py-0.5 font-body-en text-[10px] uppercase tracking-wider ${
                      TAG_COLORS[c.tag] ?? "border-border/50 text-muted-foreground"
                    }`}
                  >
                    {c.tag}
                  </div>

                  <div className="relative mb-6 aspect-[4/3] overflow-hidden border border-border/30 bg-muted/10">
                    {c.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.image}
                        alt={c.name ?? c.location}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground/40">
                        IMG · {c.location}
                      </div>
                    )}
                  </div>

                  {c.name && (
                    <div className="mb-1 font-heading text-lg font-bold">{c.name}</div>
                  )}
                  <div className="mb-4 flex gap-2 font-body-en text-[11px] uppercase tracking-wider text-muted-foreground">
                    <span>{c.location}</span>
                    <span>·</span>
                    <span>{c.industry}</span>
                  </div>

                  <div className="font-heading text-2xl font-bold leading-tight">
                    {c.result}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {c.line}
                  </p>
                  <div className="mt-6 border-t border-border/30 pt-6 text-xs text-muted-foreground">
                    {c.service}
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-12 text-center text-xs text-muted-foreground/60">
              ※ 일부 사례는 매장과의 협의에 따라 매장명·세부 수치를 비공개로 표기합니다.
            </p>
          </div>
        </section>

        <FinalCTA />
      </main>
    </>
  );
}
