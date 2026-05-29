import { PageHeader } from "@/components/layout/PageHeader";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Check } from "lucide-react";

type Service = {
  no: string;
  title: string;
  en: string;
  desc: string;
  items: string[];
};

type Group = {
  flag: string;
  label: string;
  tone: "main" | "sub" | "ext";
  services: Service[];
};

const GROUPS: Group[] = [
  {
    flag: "🇨🇳",
    label: "중국인 관광객 채널 — Main",
    tone: "main",
    services: [
      {
        no: "01",
        title: "따종디엔핑 공식 입점·운영",
        en: "Dianping Official",
        desc: "메이투안 본사 정식 인증 대행. 입점 신청부터 매장 세팅·광고·결제·관리까지 전 과정을 대신합니다.",
        items: [
          "매장 페이지 중국어 세팅 (사진·스토리·메뉴)",
          "공식 인증 마크 획득",
          "AI 정밀 타겟 광고 (투이광통)",
          "바우처 선결제 시스템 (노쇼 0%)",
          "리뷰 모니터링·품질 점수 최적화",
        ],
      },
      {
        no: "02",
        title: "샤오홍슈 인플루언서 마케팅",
        en: "Xiaohongshu KOC",
        desc: "중국판 인스타그램. '발견' 단계의 유입 자산을 만들어 매장을 검색 전부터 노출시킵니다.",
        items: [
          "무료 KOC 체험단 50~100팀 송출",
          "콘텐츠 기획·검수",
          "해시태그·키워드 최적화",
          "리뷰·후기 축적",
        ],
      },
      {
        no: "03",
        title: "고덕지도 (高德地图)",
        en: "Amap",
        desc: "중국인 관광객이 매장 검색에 점점 더 많이 쓰는 지도 채널. 부상 단계에서 선점합니다.",
        items: [
          "매장 정보 등록·최적화",
          "위치 기반 노출 강화",
          "부상 채널 선점",
        ],
      },
      {
        no: "04",
        title: "도우인 (抖音)",
        en: "Douyin",
        desc: "중국판 틱톡. 숏폼 영상으로 매장을 바이럴시켜 폭발적인 '발견'을 만듭니다.",
        items: [
          "숏폼 영상 콘텐츠 기획",
          "바이럴·챌린지 설계",
          "해시태그 최적화",
        ],
      },
      {
        no: "05",
        title: "웨이보 (微博)",
        en: "Weibo",
        desc: "중국판 X(트위터). 실시간 화제성과 입소문으로 매장 인지도를 확산합니다.",
        items: [
          "계정 운영·콘텐츠 발행",
          "실시간 화제성 확산",
          "입소문 모니터링",
        ],
      },
    ],
  },
  {
    flag: "🔧",
    label: "매장 운영 컨설팅 — Extension",
    tone: "ext",
    services: [
      {
        no: "06",
        title: "매장 운영·마케팅 통합 컨설팅",
        en: "Consulting",
        desc: "직접 운영한 매장 케이스에서 검증한 공식을 기반으로 한 통합 컨설팅. 출점 단계부터 함께 설계할 수 있습니다.",
        items: ["직접 운영 검증 공식 적용", "출점·상권 컨설팅", "통합 마케팅 설계"],
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            거리를 가득 메운 중국인 관광객,
            <br />
            그 발길을 <span className="text-primary">우리 매장으로</span>.
          </>
        }
        subtitle="지금 홍대·성수·명동 거리는 중국인 관광객으로 넘칩니다. 그들이 매장을 고르는 채널에 우리 매장을 올려, 방문과 매출로 연결합니다."
      />

      <main className="flex-1">
        {GROUPS.map((group) => (
          <section
            key={group.label}
            className="border-b border-border/30 py-20 md:py-28"
          >
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-12 flex flex-wrap items-center gap-4">
                <span className="text-3xl">{group.flag}</span>
                <h2
                  className={`font-heading text-2xl font-bold md:text-3xl ${
                    group.tone === "sub" ? "text-muted-foreground" : ""
                  }`}
                >
                  {group.label}
                </h2>
              </div>

              <div className="space-y-px overflow-hidden rounded-2xl border border-border/30 bg-border/30">
                {group.services.map((s) => (
                  <div
                    key={s.no}
                    className={`bg-background p-8 md:p-10 ${
                      group.tone === "main" ? "" : ""
                    }`}
                  >
                    <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
                      <div>
                        <div className="flex items-baseline gap-4">
                          <span
                            className={`font-display text-5xl leading-none md:text-6xl ${
                              group.tone === "main"
                                ? "text-primary"
                                : "text-foreground/30"
                            }`}
                          >
                            {s.no}
                          </span>
                          <span className="font-body-en text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {s.en}
                          </span>
                        </div>
                        <h3 className="mt-6 font-heading text-2xl font-bold leading-tight md:text-3xl">
                          {s.title}
                        </h3>
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                          {s.desc}
                        </p>
                      </div>

                      <ul className="grid content-start gap-3 md:border-l md:border-border/30 md:pl-10">
                        {s.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-sm text-foreground/80 md:text-base"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        <FinalCTA />
      </main>
    </>
  );
}
