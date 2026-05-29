"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NOTICES = [
  "메이투안 본사 정식 인증 대행사 — 따종디엔핑 공식 파트너",
  "샤오홍슈 KOC 체험단 50~100팀 송출 시스템 운영",
  "일평균 매장 광고 12,400건 집행 — 국내 최대 로컬 마케팅 인프라",
  "직접 운영 매장 연 매출 15억·58억으로 마케팅 공식 자체 검증",
];

export function NoticeBar() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % NOTICES.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="border-y border-border/30 bg-background/60 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 text-xs md:text-sm">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="shrink-0 font-body-en text-[10px] uppercase tracking-[0.25em] text-primary">
          Official
        </span>
        <span className="shrink-0 text-muted-foreground/40">|</span>
        <div className="relative h-5 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 truncate font-medium text-foreground/90"
            >
              {NOTICES[idx]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
