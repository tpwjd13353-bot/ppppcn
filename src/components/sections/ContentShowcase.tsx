"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";
import initialData from "@/data/showcase.json";
import {
  GRADIENT_PRESETS,
  cleanUrl,
  type ShowcaseCard,
  type ShowcaseData,
} from "@/lib/showcase";

const INITIAL = (initialData as ShowcaseData).cards;

function ShowcaseCardView({
  c,
  colorIndex,
}: {
  c: ShowcaseCard;
  colorIndex: number;
}) {
  const autoGradient = GRADIENT_PRESETS[colorIndex % GRADIENT_PRESETS.length];
  const link = cleanUrl(c.linkUrl);
  const cardClass =
    "group relative block h-[300px] w-[180px] shrink-0 overflow-hidden rounded-2xl border border-border/40 transition-transform duration-300 hover:scale-[1.04] md:h-[380px] md:w-[230px]";

  const inner = (
    <>
      {c.mediaType === "video" && c.mediaUrl ? (
        <video
          src={c.mediaUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : c.mediaType === "image" && c.mediaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={c.mediaUrl}
          alt={c.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${autoGradient}`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 font-body-en text-[10px] uppercase tracking-wider text-white backdrop-blur">
        {c.platform}
      </div>

      {link && (
        <div className="absolute right-3 top-3 rounded-full bg-black/40 p-1.5 text-white backdrop-blur transition group-hover:bg-primary">
          <ExternalLink className="h-3.5 w-3.5" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-sm font-semibold leading-snug text-white">{c.title}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-white/75">
          <span>{c.author}</span>
          <span className="inline-flex items-center gap-1">
            <Heart className="h-3 w-3 fill-current" />
            {c.likes}
          </span>
        </div>
      </div>
    </>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
      >
        {inner}
      </a>
    );
  }
  return <div className={cardClass}>{inner}</div>;
}

function MarqueeRow({
  cards,
  direction,
  startIndex,
}: {
  cards: ShowcaseCard[];
  direction: "left" | "right";
  startIndex: number;
}) {
  if (cards.length === 0) return null;
  const doubled = [...cards, ...cards];
  const animate =
    direction === "left" ? { x: ["0%", "-50%"] } : { x: ["-50%", "0%"] };

  return (
    <motion.div
      className="flex w-max gap-5"
      animate={animate}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
    >
      {doubled.map((c, i) => (
        <ShowcaseCardView
          key={`${c.id}-${i}`}
          c={c}
          colorIndex={startIndex + (i % cards.length)}
        />
      ))}
    </motion.div>
  );
}

export function ContentShowcase() {
  const [cards, setCards] = useState<ShowcaseCard[]>(INITIAL);

  useEffect(() => {
    fetch("/api/showcase")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ShowcaseData | null) => {
        if (data?.cards?.length) setCards(data.cards);
      })
      .catch(() => {});
  }, []);

  const half = Math.ceil(cards.length / 2);
  const rowA = cards.slice(0, half);
  const rowB = cards.slice(half);

  return (
    <section className="overflow-hidden border-t border-border/30 bg-background py-20 md:py-28">
      <div className="mx-auto mb-14 max-w-7xl px-6">
        <div className="font-body-en text-xs uppercase tracking-[0.25em] text-primary">
          Showcase
        </div>
        <h2 className="mt-6 max-w-4xl font-heading text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
          중국 SNS 안에서,
          <br />
          우리 매장이 이렇게 <span className="text-primary">노출</span>됩니다.
        </h2>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          샤오홍슈에서 발견하고, 따종디엔핑에서 검증하고, 고덕지도로 찾아옵니다.
          중국인 관광객의 자연스러운 동선 안에 매장 콘텐츠를 심습니다.
        </p>
      </div>

      <div className="relative space-y-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent md:w-32" />

        <MarqueeRow cards={rowA} direction="left" startIndex={0} />
        <MarqueeRow cards={rowB} direction="right" startIndex={half} />
      </div>
    </section>
  );
}
