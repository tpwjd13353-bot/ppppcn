"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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
];

export function Portfolio() {
  return (
    <section id="work" className="relative border-t border-border/30 bg-background py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <div className="font-body-en text-xs uppercase tracking-[0.25em] text-primary">
              Work
            </div>
            <h2 className="mt-6 max-w-3xl font-heading text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
              우리가 직접 만든<br />
              매장의 결과.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            마케팅 공식을 매장에서 직접 검증합니다.
            <br />
            검증된 공식을 다른 매장에 동일하게 적용합니다.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <motion.article
              key={c.location + i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative border border-border/40 bg-background p-8 transition-colors hover:border-primary/60"
            >
              <div className="absolute right-6 top-6 rounded-full border border-primary/40 px-2 py-0.5 font-body-en text-[10px] uppercase tracking-wider text-primary">
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
            </motion.article>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex min-h-[420px] items-center justify-center border border-border/30 bg-background p-8"
          >
            <Link
              href="/work"
              className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              전체 사례 보기 →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
