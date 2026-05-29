import { PageHeader } from "@/components/layout/PageHeader";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { BadgeCheck, Store, Megaphone, Users } from "lucide-react";

const BIG_STATS = [
  { num: "350명", label: "전담 운영 인력" },
  { num: "12,400건", label: "일평균 매장 광고 집행" },
  { num: "연 15억", label: "홍대 직접 운영 매장" },
  { num: "연 58억", label: "여수 직접 운영 매장" },
  { num: "12지점", label: "C 프랜차이즈 확장" },
  { num: "정식 인증", label: "메이투안 본사 공식 대행" },
];

const PILLARS = [
  {
    icon: Store,
    title: "직접 운영하며 검증합니다",
    desc: "홍대·여수에서 매장을 직접 운영하며 성공하는 마케팅 공식을 연구합니다. 책상 위 이론이 아니라, 우리 매출로 증명한 방법만 적용합니다.",
  },
  {
    icon: BadgeCheck,
    title: "따종디엔핑 공식 대행사입니다",
    desc: "메이투안 본사와 정식 계약을 맺고 직접 소통하는 공식 대행사. 정식 입점·광고 운영은 공식 대행사를 통해서만 가능합니다.",
  },
  {
    icon: Megaphone,
    title: "국내 최대 로컬 마케팅 인프라",
    desc: "350명의 전담 인력이 일평균 12,400건의 매장 광고를 집행합니다. 중국인 관광객 채널부터 한국 채널까지 한 번에 운영합니다.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            성과로 증명하는
            <br />
            <span className="text-primary">로컬 마케팅 대행사</span>.
          </>
        }
        subtitle="퍼플페퍼는 따종디엔핑 공식 대행사이자, 매장을 직접 운영하며 마케팅을 연구하는 회사입니다."
      />

      <main className="flex-1">
        {/* 스토리 */}
        <section className="border-b border-border/30 py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6">
            <p className="font-heading text-2xl font-bold leading-snug md:text-4xl">
              중국인 관광객은 한국에서 네이버를 켜지 않습니다.
              <br />
              <span className="text-muted-foreground">
                샤오홍슈에서 발견하고, 따종디엔핑에서 결제까지 끝냅니다.
              </span>
            </p>
            <p className="mt-8 text-base leading-relaxed text-muted-foreground md:text-lg">
              2026년, 700만 명의 중국인 관광객이 한국을 찾습니다. 그러나 그들의 70%는 검증 앱 하나로
              모든 의사결정을 내립니다. 그 앱에 없는 매장은 고려 대상조차 되지 못합니다.
              <br />
              <br />
              퍼플페퍼는 그 자연스러운 흐름 안에 한국 매장이 들어가도록 만드는 공식
              대행사입니다. 우리는 매장을 직접 운영하며 검증한 공식을, 점주님의 매장에 그대로
              적용합니다.
            </p>
          </div>
        </section>

        {/* 통계 */}
        <section className="border-b border-border/30 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold md:text-3xl">
                규모 · 증명 · 자격으로 말합니다
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/30 bg-border/30 md:grid-cols-3">
              {BIG_STATS.map((s) => (
                <div key={s.label} className="bg-background p-8 md:p-10">
                  <div className="font-display text-3xl text-foreground md:text-4xl">
                    {s.num}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground md:text-sm">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 핵심 가치 */}
        <section className="border-b border-border/30 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className="rounded-2xl border border-border/40 p-8"
                  >
                    <Icon className="h-8 w-8 text-primary" />
                    <h3 className="mt-6 font-heading text-xl font-bold leading-tight">
                      {p.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {p.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>
    </>
  );
}
