"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    no: "01",
    system: "Shanghoutong",
    krSystem: "상후통 (商户通)",
    title: "온라인 매장 운영",
    desc: "잠재 고객이 검색했을 때 호기심을 갖게 만들고, 확신으로 바꿔주도록 사진과 매장 소개를 중국어로 세팅합니다.",
    bullets: ["고화질 사진·영상", "중국어 메뉴판", "매장 스토리", "공식 인증 마크"],
  },
  {
    no: "02",
    system: "Tuiguangtong",
    krSystem: "투이광통 (推广通)",
    title: "AI 정밀 타겟 광고",
    desc: "우리 매장 근처에서, 지금 이 순간 맛집을 찾는 사람에게만 광고가 나갑니다. 광고비 유실이 줄어듭니다.",
    bullets: ["상권 키워드 타겟", "피크 타임 집중", "클릭당 과금", "2030 여성 옵션"],
  },
  {
    no: "03",
    system: "Voucher",
    krSystem: "바우처 (선결제)",
    title: "원스톱 결제",
    desc: "방문 전에 이미 메뉴 선택과 결제가 끝납니다. 노쇼는 0%에 가깝고, 사장님은 서빙만 하시면 됩니다.",
    bullets: ["선결제 매출 확정", "노쇼 0%", "언어 장벽 0%", "QR 한 번이면 끝"],
  },
];

export function Solution() {
  return (
    <section className="relative border-t border-border/30 bg-background py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="font-body-en text-xs uppercase tracking-[0.25em] text-primary"
        >
          How it works
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-6 max-w-4xl font-heading text-4xl font-black leading-[1.05] tracking-tight md:text-6xl"
        >
          따종디엔핑에서
          <br />
          매출이 만들어지는 <span className="text-primary">3단계.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          입점 — 광고 — 결제. 메이투안 본사의 공식 상품(상후통·투이광통·바우처)으로 매장에
          방문하기 전에 이미 매출이 발생하는 구조를 만듭니다.
        </motion.p>

        <div className="mt-20 grid gap-px border border-border/30 bg-border/30 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.no}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group relative bg-background p-10 transition-colors hover:bg-primary/[0.04]"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-6xl leading-none text-primary md:text-7xl">
                  {s.no}
                </span>
                <div className="flex flex-col">
                  <span className="font-body-en text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Step {s.no}
                  </span>
                  <span className="mt-1 font-body-en text-xs uppercase tracking-wider text-foreground/60">
                    {s.system}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs text-muted-foreground">{s.krSystem}</div>

              <h3 className="mt-8 font-heading text-2xl font-bold leading-tight md:text-3xl">
                {s.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                {s.desc}
              </p>

              <ul className="mt-8 space-y-2 border-t border-border/30 pt-6">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-xs text-foreground/70"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-center text-xs text-muted-foreground/70"
        >
          ※ 본 시스템은 메이투안 본사의 공식 상품을 기반으로 운영됩니다.
        </motion.p>
      </div>
    </section>
  );
}
