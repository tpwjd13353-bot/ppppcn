"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Lock, Sparkles } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function AnalyzeCTA() {
  return (
    <section className="relative overflow-hidden border-y border-border/40 bg-gradient-to-br from-primary/[0.08] via-background to-background py-20 md:py-28">
      {/* 배경 장식 */}
      <div className="pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" />
            무료 분석 도구 NEW
          </div>

          <h2 className="mt-6 font-heading text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            우리 가게,
            <br />
            중국 관광객한테 어떨까?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            네이버 플레이스 URL만 넣으세요. 1분 안에 위치·메뉴·마케팅을
            <br className="hidden md:inline" />
            데이터로 정량 분석해 한 장 보고서로 드립니다.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <Link
              href="/analyze"
              className="group inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-base font-bold text-primary-foreground transition hover:opacity-90"
            >
              지금 무료로 분석하기
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="text-xs text-muted-foreground">
              회원가입 없이 3회까지 무료 · URL만 넣으면 끝
            </p>
          </motion.div>
        </motion.div>

        {/* 3-step 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
          className="mt-16 grid gap-4 md:grid-cols-3"
        >
          <Bullet
            icon={<Clock className="h-5 w-5" />}
            title="1분 안에"
            body="URL 한 줄 입력 → 자동 분석 → 결과 페이지"
          />
          <Bullet
            icon={<Sparkles className="h-5 w-5" />}
            title="2개 점수로 명확하게"
            body="상권 종합 점수와 중국 마케팅 점수를 분리해 손실 격차를 보여줍니다"
          />
          <Bullet
            icon={<Lock className="h-5 w-5" />}
            title="가입 없이 시작"
            body="3회까지 무료. 더 필요하면 카카오 3초 가입"
          />
        </motion.div>
      </div>
    </section>
  );
}

function Bullet({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-heading text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
