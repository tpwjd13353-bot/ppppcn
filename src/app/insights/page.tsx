"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import initialData from "@/data/columns.json";
import type { Column, ColumnData } from "@/lib/column";

const INITIAL = (initialData as ColumnData).columns;

export default function InsightsPage() {
  const [columns, setColumns] = useState<Column[]>(INITIAL);

  useEffect(() => {
    fetch("/api/columns")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: ColumnData | null) => {
        if (d?.columns) setColumns(d.columns);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title={
          <>
            현장에서 쓰는
            <br />
            <span className="text-primary">마케팅 칼럼</span>.
          </>
        }
        subtitle="중국인 관광객을 매장으로 데려오는 법, 직접 운영하며 얻은 인사이트를 칼럼으로 풀어냅니다."
      />

      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            {columns.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/40 py-20 text-center text-sm text-muted-foreground">
                아직 등록된 칼럼이 없습니다.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...columns].reverse().map((col) => (
                  <Link
                    key={col.id}
                    href={`/insights/${col.id}`}
                    className="group block overflow-hidden rounded-xl border border-border/40 bg-background transition hover:border-primary/60"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-muted/10">
                      {col.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={col.thumbnail}
                          alt={col.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center font-body-en text-xs uppercase tracking-wider text-muted-foreground/30">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="font-body-en text-xs text-muted-foreground">
                        {col.date}
                      </div>
                      <h3 className="mt-2 font-heading text-xl font-bold leading-snug transition-colors group-hover:text-primary">
                        {col.title}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {col.summary}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
