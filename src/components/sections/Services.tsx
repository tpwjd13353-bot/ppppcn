"use client";

import { motion } from "framer-motion";

type Service = {
  title: string;
  badge: "MAIN" | "SUB" | "EXT";
  desc: string;
};

const CHINA_SERVICES: Service[] = [
  {
    title: "따종디엔핑 공식 입점·운영",
    badge: "MAIN",
    desc: "메이투안 본사 정식 인증 대행. 매장 페이지 세팅(중국어) · AI 정밀 타겟 광고(투이광통) · 바우처 선결제 · 리뷰 관리까지 풀패키지.",
  },
  {
    title: "샤오홍슈 인플루언서 마케팅",
    badge: "MAIN",
    desc: "중국판 인스타그램. 무료 KOC 체험단 50~100팀 송출로 '발견' 단계의 유입 자산을 만듭니다.",
  },
  {
    title: "고덕지도 (高德地图)",
    badge: "MAIN",
    desc: "중국인 관광객이 매장 검색에 점점 더 많이 쓰는 채널. 부상 단계에서 선점합니다.",
  },
  {
    title: "도우인 (抖音)",
    badge: "MAIN",
    desc: "중국판 틱톡. 숏폼 영상으로 매장을 바이럴시켜 '발견' 단계의 폭발적 노출을 만듭니다.",
  },
  {
    title: "웨이보 (微博)",
    badge: "MAIN",
    desc: "중국판 X(트위터). 실시간 화제성과 입소문으로 매장 인지도를 빠르게 확산합니다.",
  },
];

const CONSULTING: Service[] = [
  {
    title: "매장 운영·마케팅 통합 컨설팅",
    badge: "EXT",
    desc: "직접 운영한 매장 케이스에서 검증한 공식을 기반으로 한 통합 컨설팅. 출점 단계부터 함께 설계할 수 있습니다.",
  },
];

const FLAGS = {
  MAIN: { label: "중국인 관광객", classes: "border-primary/60 text-primary" },
  SUB: { label: "한국 채널 부가", classes: "border-border/50 text-muted-foreground" },
  EXT: { label: "통합 컨설팅", classes: "border-foreground/30 text-foreground/80" },
};

function ServiceCard({ s, i }: { s: Service; i: number }) {
  const flag = FLAGS[s.badge];
  const isMain = s.badge === "MAIN";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: i * 0.06 }}
      className={`group border p-8 transition-colors hover:border-primary/60 ${
        isMain
          ? "border-primary/30 bg-primary/[0.04]"
          : "border-border/40 bg-background"
      }`}
    >
      <div
        className={`inline-flex items-center rounded-full border px-2 py-0.5 font-body-en text-[10px] uppercase tracking-wider ${flag.classes}`}
      >
        {flag.label}
      </div>
      <h3 className="mt-6 font-heading text-2xl font-bold leading-tight md:text-3xl">
        {s.title}
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        {s.desc}
      </p>
    </motion.div>
  );
}

export function Services() {
  return (
    <section id="services" className="relative border-t border-border/30 bg-background py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="font-body-en text-xs uppercase tracking-[0.25em] text-primary">
          Services
        </div>
        <h2 className="mt-6 max-w-4xl font-heading text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
          거리를 가득 메운 중국인 관광객,
          <br />
          그 발길을 <span className="text-primary">우리 매장으로</span>.
        </h2>

        {/* 중국 채널 - MAIN */}
        <div className="mt-20">
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <span className="text-3xl">🇨🇳</span>
            <h3 className="font-heading text-2xl font-bold">중국인 관광객 채널</h3>
            <span className="font-body-en text-xs uppercase tracking-wider text-primary">
              — Main
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {CHINA_SERVICES.map((s, i) => (
              <ServiceCard key={s.title} s={s} i={i} />
            ))}
          </div>
        </div>

        {/* 컨설팅 - EXT */}
        <div className="mt-20">
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <span className="text-3xl">🔧</span>
            <h3 className="font-heading text-2xl font-bold">매장 운영 컨설팅</h3>
            <span className="font-body-en text-xs uppercase tracking-wider text-muted-foreground">
              — Extension
            </span>
          </div>
          <div className="grid gap-6">
            {CONSULTING.map((s, i) => (
              <ServiceCard key={s.title} s={s} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
