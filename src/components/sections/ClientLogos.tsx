"use client";

import { motion } from "framer-motion";

export function ClientLogos() {
  return (
    <section className="relative border-t border-border/30 bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="font-body-en text-xs uppercase tracking-[0.25em] text-primary">
            Clients
          </div>
          <h2 className="mt-6 font-heading text-3xl font-black leading-tight tracking-tight md:text-5xl">
            누적 거래 매장 <span className="text-primary">___ 곳</span>
          </h2>
          <p className="mt-6 text-sm text-muted-foreground">
            F&B · 뷰티 · 레저 · 호텔 · 프랜차이즈
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-16 grid grid-cols-2 gap-px border border-border/30 bg-border/30 md:grid-cols-4 lg:grid-cols-6"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-[3/2] items-center justify-center bg-background font-body-en text-xs text-muted-foreground/30"
            >
              LOGO
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center font-body-en text-xs uppercase tracking-[0.2em] text-muted-foreground/60"
        >
          홍대 · 성수 · 한남 · 명동 · 부산 · 전국
        </motion.p>
      </div>
    </section>
  );
}
