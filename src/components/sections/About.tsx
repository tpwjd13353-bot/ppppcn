"use client";

import { motion } from "framer-motion";

const STATS = [
  { num: "연 15억", label: "홍대 직접 운영 매장" },
  { num: "연 58억", label: "여수 직접 운영 매장" },
  { num: "12지점", label: "C 프랜차이즈 확장" },
  { num: "350명", label: "전담 운영 인력" },
  { num: "12,400건", label: "일평균 매장 광고 집행" },
  { num: "정식 인증", label: "메이투안 본사 공식 대행" },
];

export function About() {
  return (
    <section id="about" className="relative border-t border-border/30 bg-background py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="font-body-en text-xs uppercase tracking-[0.25em] text-primary"
        >
          About
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-6 max-w-4xl font-heading text-4xl font-black leading-[1.05] tracking-tight md:text-6xl"
        >
          중국인 관광객을<br />
          우리 매장으로 데려오는<br />
          <span className="text-primary">한 가지 방법.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-12 max-w-3xl space-y-8"
        >
          <p className="text-xl font-medium leading-relaxed text-foreground md:text-2xl">
            중국인 관광객은 한국에서{" "}
            <span className="text-primary">네이버를 켜지 않습니다.</span>
            <br />
            샤오홍슈에서 매장을 발견하고, 따종디엔핑에서 결제까지 끝냅니다.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            퍼플페퍼는 그 자연 흐름 안에 한국 매장이 들어가도록 만드는{" "}
            <span className="font-semibold text-foreground">공식 대행사</span>입니다. 메이투안
            본사 정식 인증 · 일평균 12,400건 광고 집행 · 국내 최대 로컬 마케팅 인프라.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 gap-px border border-border/30 bg-border/30 md:grid-cols-3"
        >
          {STATS.map((s) => (
            <div key={s.label} className="bg-background p-8">
              <div className="font-display text-2xl text-foreground md:text-3xl">
                {s.num}
              </div>
              <div className="mt-2 text-xs text-muted-foreground md:text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
