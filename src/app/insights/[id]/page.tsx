"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import initialData from "@/data/columns.json";
import type { Column, ColumnData } from "@/lib/column";

const INITIAL = (initialData as ColumnData).columns;

export default function ColumnDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [columns, setColumns] = useState<Column[]>(INITIAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/columns")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: ColumnData | null) => {
        if (d?.columns) setColumns(d.columns);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const col = columns.find((c) => c.id === id);

  if (!loading && !col) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <p className="text-muted-foreground">칼럼을 찾을 수 없습니다.</p>
        <Link href="/insights" className="mt-4 text-sm font-semibold text-primary">
          ← 칼럼 목록으로
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <article className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          칼럼 목록
        </Link>

        {col && (
          <>
            <div className="mt-10 font-body-en text-xs uppercase tracking-[0.25em] text-primary">
              Insight
            </div>
            <h1 className="mt-4 font-heading text-3xl font-black leading-tight tracking-tight md:text-5xl">
              {col.title}
            </h1>
            <div className="mt-4 font-body-en text-sm text-muted-foreground">
              {col.date}
            </div>

            {col.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={col.thumbnail}
                alt={col.title}
                className="mt-10 w-full rounded-2xl border border-border/30 object-cover"
              />
            )}

            {col.body && (
              <div className="mt-10 whitespace-pre-wrap text-base leading-relaxed text-foreground/90 md:text-lg">
                {col.body}
              </div>
            )}

            {col.images && col.images.length > 0 && (
              <div className="mt-10 space-y-4">
                {col.images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img}
                    alt={`${col.title} 이미지 ${i + 1}`}
                    className="w-full rounded-2xl border border-border/30"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </article>
    </main>
  );
}
