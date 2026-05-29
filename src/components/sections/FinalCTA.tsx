"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Check } from "lucide-react";

const TRUST_POINTS = [
  "메이투안 본사 공식 인증 대행",
  "일평균 매장 광고 12,400건 집행",
  "직접 운영 매장 연 매출 15억·58억 검증",
];

export function FinalCTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-border/30 bg-background py-32"
    >
      {/* 빨강 글로우 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-body-en text-xs uppercase tracking-[0.25em] text-primary"
        >
          Contact
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 font-heading text-4xl font-black leading-[1] tracking-tight md:text-7xl"
        >
          중국인 관광객은 매년 늘어나는데
          <br />
          <span className="text-primary">우리 가게엔 방문이 없다면.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          광고비가 어디서 새고 있는지부터 무료로 점검해드립니다.
          <br />
          업종과 지역만 알려주시면 됩니다.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-12"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition hover:opacity-90"
          >
            <MessageCircle className="h-5 w-5" />
            지금 상담 신청
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
        >
          {TRUST_POINTS.map((t) => (
            <li key={t} className="inline-flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              {t}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
