"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import initialData from "@/data/columns.json";
import type { Column, ColumnData } from "@/lib/column";

const INITIAL = (initialData as ColumnData).columns;

function ColumnCard({
  col,
  wasDragged,
}: {
  col: Column;
  wasDragged: () => boolean;
}) {
  return (
    <Link
      href={`/insights/${col.id}`}
      draggable={false}
      onClick={(e) => {
        if (wasDragged()) e.preventDefault();
      }}
      className="group block w-[260px] shrink-0 select-none md:w-[300px]"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border/40 bg-muted/10">
        {col.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={col.thumbnail}
            alt={col.title}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-body-en text-xs uppercase tracking-wider text-muted-foreground/30">
            No Image
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="font-body-en text-xs text-muted-foreground">{col.date}</div>
        <h3 className="mt-2 line-clamp-2 font-heading text-lg font-bold leading-snug transition-colors group-hover:text-primary">
          {col.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {col.summary}
        </p>
      </div>
    </Link>
  );
}

export function ColumnsPreview() {
  const [columns, setColumns] = useState<Column[]>(INITIAL);
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false });

  useEffect(() => {
    fetch("/api/columns")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: ColumnData | null) => {
        if (d?.columns) setColumns(d.columns);
      })
      .catch(() => {});
  }, []);

  function onDown(e: React.MouseEvent) {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = {
      down: true,
      startX: e.pageX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
  }
  function onMove(e: React.MouseEvent) {
    if (!drag.current.down) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.pageX - drag.current.startX;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  }
  function onUp() {
    drag.current.down = false;
  }
  function wasDragged() {
    return drag.current.moved;
  }
  function scrollByDir(dir: 1 | -1) {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  }

  if (columns.length === 0) return null;

  const ordered = [...columns].reverse(); // 오래된순

  return (
    <section className="overflow-hidden border-t border-border/30 bg-background py-32">
      <div className="mx-auto mb-12 flex max-w-7xl flex-wrap items-end justify-between gap-8 px-6">
        <div>
          <div className="font-body-en text-xs uppercase tracking-[0.25em] text-primary">
            Insights
          </div>
          <h2 className="mt-6 font-heading text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            현장에서 쓰는
            <br />
            마케팅 칼럼.
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollByDir(-1)}
            aria-label="이전"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-foreground transition hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scrollByDir(1)}
            aria-label="다음"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-foreground transition hover:border-primary hover:text-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <Link
            href="/insights"
            className="ml-2 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-primary"
          >
            전체 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 드래그/스와이프 가로 스크롤 */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent md:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent md:w-24" />

        <div
          ref={scrollRef}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          className="flex cursor-grab gap-6 overflow-x-auto px-6 pb-4 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {ordered.map((col) => (
            <ColumnCard key={col.id} col={col} wasDragged={wasDragged} />
          ))}
        </div>
      </div>
    </section>
  );
}
