"use client";

import { motion } from "framer-motion";

const PAINS = [
  {
    quote: "거리는 중국인 관광객으로 가득한데,\n우리 매장엔 들어오지 않습니다.",
    sub: "홍대·성수·한남·명동",
  },
  {
    quote: "구글 리뷰가 1,000개나 되는데\n왜 중국인 관광객은 안 올까요?",
    sub: "검증 채널이 다른 문제",
  },
  {
    quote: "샤오홍슈·따종디엔핑,\n어디서부터 시작해야 할지 모르겠어요.",
    sub: "언어·시스템·운영 장벽",
  },
];

export function PainPoints() {
  return (
    <section className="relative border-t border-border/30 bg-background py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="font-body-en text-xs uppercase tracking-[0.25em] text-primary"
        >
          The Problem
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-6 font-heading text-4xl font-black leading-[1.05] tracking-tight md:text-6xl"
        >
          혹시, <span className="text-primary">이런 고민?</span>
        </motion.h2>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {PAINS.map((p, i) => (
            <motion.div
              key={p.quote}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-border/40 bg-background p-8"
            >
              <span className="block font-display text-5xl leading-none text-primary/40">
                &ldquo;
              </span>
              <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-foreground md:text-xl">
                {p.quote}
              </p>
              <div className="mt-6 border-t border-border/30 pt-4 font-body-en text-[11px] uppercase tracking-wider text-muted-foreground">
                {p.sub}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="font-heading text-2xl font-bold leading-tight md:text-3xl">
            원인은 단 하나 —
            <br className="md:hidden" />
            <span className="text-primary">
              {" "}
              그들의 검증 앱에 우리 매장이 없기 때문입니다.
            </span>
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            중국인 관광객 70% 이상이 따종디엔핑 하나로 모든 의사결정을 내립니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
