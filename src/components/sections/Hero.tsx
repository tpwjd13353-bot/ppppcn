"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const ROTATING_VERBS = ["고르고", "결제하고", "방문하고"];
const META = [
  { num: "700만+", label: "2026 방한 중국인 관광객" },
  { num: "70%", label: "따종디엔핑 사용률" },
  { num: "12,400", label: "일평균 매장 광고" },
  { num: "350명", label: "전담 운영 인력" },
];

export function Hero() {
  const [verbIdx, setVerbIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setVerbIdx((i) => (i + 1) % ROTATING_VERBS.length),
      2400,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative flex min-h-[82vh] items-center overflow-hidden bg-background">
      {/* 배경 글로우 */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-primary/25 blur-[120px]"
        />
        <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      {/* 좌측 빨강 세로줄 */}
      <div className="absolute left-0 top-0 h-full w-1 bg-primary/80" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-14 md:py-16">
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex flex-wrap items-center gap-3"
        >
          <span className="rounded-full border border-primary/50 px-3 py-1 font-body-en text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            Meituan Official Partner
          </span>
          <span className="font-body-en text-xs uppercase tracking-[0.25em] text-muted-foreground">
            메이투안 본사 정식 인증 대행사
          </span>
        </motion.div>

        {/* 메인 헤드라인 (단어 회전 포함) */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-heading text-[clamp(2.5rem,7.5vw,7rem)] font-black leading-[0.9] tracking-[-0.02em]"
        >
          중국인 관광객은
          <br />
          이미 매장을{" "}
          <span className="relative inline-block align-baseline">
            <span className="invisible">결제하고</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={ROTATING_VERBS[verbIdx]}
                initial={{ y: "60%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-60%", opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 text-primary"
              >
                {ROTATING_VERBS[verbIdx]}
              </motion.span>
            </AnimatePresence>
          </span>{" "}
          있다.
        </motion.h1>

        {/* 서브카피 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          따종디엔핑 · 샤오홍슈 · 고덕지도 · 도우인 · 웨이보.
          <br />
          중국인 관광객의 동선 안에 한국 매장을 올리는 공식 대행사.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10 flex flex-col items-start gap-4 md:flex-row md:items-center"
        >
          <Link
            href="/analyze"
            className="group inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-7 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 md:h-16 md:px-9 md:text-lg"
          >
            <Sparkles className="h-5 w-5" />
            무료 상권 분석하기
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-foreground/20 px-5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary md:h-14 md:px-6"
          >
            상담 신청
          </Link>
        </motion.div>
        <p className="mt-3 text-xs text-muted-foreground/70">
          회원가입 없이 3회까지 무료 · 네이버 플레이스 URL만 있으면 1분 만에 진단
        </p>

        {/* 하단 메타 */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } },
          }}
          className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-12"
        >
          {META.map((m) => (
            <motion.div
              key={m.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              <div className="font-display text-3xl text-foreground md:text-4xl">
                {m.num}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{m.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
