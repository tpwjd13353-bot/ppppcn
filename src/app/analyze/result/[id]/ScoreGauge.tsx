"use client";

import { motion } from "framer-motion";

export function ScoreGauge({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const angle = (clamped / 100) * 360;

  const color =
    clamped >= 80
      ? "text-emerald-500"
      : clamped >= 60
        ? "text-primary"
        : clamped >= 40
          ? "text-amber-500"
          : "text-rose-500";

  return (
    <div className="relative mt-6 flex h-32 w-32 items-center justify-center">
      {/* 배경 링 */}
      <div className="absolute inset-0 rounded-full border-[10px] border-border/30" />

      {/* 점수 링 (애니메이션) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(currentColor ${angle}deg, transparent ${angle}deg)`,
          WebkitMask:
            "radial-gradient(circle, transparent 56px, black 56px, black 64px, transparent 64px)",
          mask: "radial-gradient(circle, transparent 56px, black 56px, black 64px, transparent 64px)",
        }}
      >
        <div className={`h-full w-full ${color}`} />
      </motion.div>

      {/* 가운데 숫자 */}
      <motion.span
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className={`font-heading text-4xl font-bold ${color}`}
      >
        {clamped}
      </motion.span>
    </div>
  );
}
