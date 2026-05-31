import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import {
  ArrowLeft,
  MapPin,
  Utensils,
  Megaphone,
  Store,
  ExternalLink,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { db, schema } from "@/lib/db";
import type { AnalysisResult } from "@/lib/types/scoring";
import type { NaverPlaceData } from "@/lib/analyze/naver";
import { ScoreGauge } from "./ScoreGauge";

export const dynamic = "force-dynamic";

interface ReportData {
  place: NaverPlaceData;
  result: AnalysisResult;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select({
      placeName: schema.analyses.placeName,
      totalScore: schema.analyses.totalScore,
    })
    .from(schema.analyses)
    .where(eq(schema.analyses.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return { title: "분석 결과 — 퍼플페퍼" };
  return {
    title: `${row.placeName ?? "분석 결과"} ${row.totalScore}점 — 퍼플페퍼`,
    description: "중국 관광객 상권 분석 보고서",
  };
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(schema.analyses)
    .where(eq(schema.analyses.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) notFound();

  const data = row.reportData as ReportData;
  const { place, result } = data;
  const { store, marketing, details, conclusion, consultation } = result;
  const gap = store.score - marketing.score;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
      <Link
        href="/analyze"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        다시 분석하기
      </Link>

      {/* 가게 헤더 */}
      <header className="mt-6 rounded-2xl border border-border/40 bg-background/60 p-6 md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {place.category || "분석 결과"}
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold md:text-4xl">
              {place.name}
            </h1>
            {(place.address || place.roadAddress) && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {place.roadAddress || place.address}
              </p>
            )}
          </div>
          <a
            href={place.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 self-start rounded-full border border-foreground/20 px-3 text-xs font-medium hover:border-primary hover:text-primary"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            네이버에서 보기
          </a>
        </div>
      </header>

      {/* 결론 메시지 — 가장 눈에 띄게 */}
      <section className="mt-6 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] p-6 md:p-8">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-1 h-6 w-6 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              분석 요약
            </p>
            <p className="mt-2 font-heading text-xl font-bold leading-snug md:text-2xl">
              {conclusion}
            </p>
          </div>
        </div>
      </section>

      {/* 점수 2개 — 상권 vs 마케팅 */}
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <ScoreCard
          icon={<Store className="h-5 w-5" />}
          title="상권 종합"
          score={store.score}
          grade={store.grade}
          subtitle="위치 · 메뉴 조건"
          tone="store"
        >
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/30 pt-4">
            <SubScore
              icon={<MapPin className="h-3.5 w-3.5" />}
              label="지역"
              score={details.region.score}
              hint={
                details.region.match.matchedName
                  ? `${details.region.match.matchedName} (${details.region.match.tier})`
                  : details.region.match.tier
              }
            />
            <SubScore
              icon={<Utensils className="h-3.5 w-3.5" />}
              label="메뉴"
              score={details.menu.score}
              hint={`${details.menu.matchedCount}/${details.menu.matches.length} 매칭`}
            />
          </div>
        </ScoreCard>

        <ScoreCard
          icon={<Megaphone className="h-5 w-5" />}
          title="마케팅"
          score={marketing.score}
          grade={marketing.grade}
          subtitle="중국 인바운드 플랫폼"
          tone="marketing"
        >
          <p className="mt-4 border-t border-border/30 pt-4 text-sm text-muted-foreground">
            {marketing.message}
          </p>
        </ScoreCard>
      </section>

      {/* 격차 강조 */}
      {gap >= 30 && (
        <section className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-600">
                손실 격차
              </p>
              <p className="mt-2 font-heading text-2xl font-bold md:text-3xl">
                {store.score} → {marketing.score}
                <span className="ml-3 text-amber-500">−{gap}점</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                상권은 갖춰져 있지만 마케팅이 비어있는 만큼 손실이 발생하고 있습니다
              </p>
            </div>
            <ScoreGauge score={gap} />
          </div>
        </section>
      )}

      {/* 메뉴 분석 상세 */}
      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold">메뉴 분석 상세</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          입력된 메뉴 {details.menu.matches.length}개를 우리 DB와 매칭한 결과
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-border/40">
          <table className="w-full text-sm">
            <thead className="bg-background/40">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  네이버 메뉴
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  DB 매칭
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  점수
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">
                  분류
                </th>
              </tr>
            </thead>
            <tbody>
              {details.menu.matches.map((m, i) => (
                <tr
                  key={i}
                  className={`border-t border-border/30 ${m.matched ? "" : "bg-amber-500/[0.03]"}`}
                >
                  <td className="px-4 py-3">{m.input}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {m.matched ? m.menuName : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {m.matched ? (
                      <span className={scoreColor(m.score ?? 0)}>
                        {m.score}
                      </span>
                    ) : (
                      <span className="text-amber-500">50</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {m.matched ? m.분류 : "별도 분석 필요"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 상담 권장 카드 */}
      {consultation.recommended && (
        <section className="mt-10 rounded-2xl border border-primary/40 bg-primary/[0.04] p-6 md:p-8">
          <div className="flex items-start gap-3">
            <AlertCircle
              className={`mt-1 h-6 w-6 shrink-0 ${
                consultation.priority === "high"
                  ? "text-rose-500"
                  : consultation.priority === "medium"
                    ? "text-amber-500"
                    : "text-primary"
              }`}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-xl font-bold">
                  전문가 상담 권장
                </h3>
                <PriorityBadge priority={consultation.priority} />
              </div>

              {consultation.reasons.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {consultation.reasons.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">·</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  무료 상담 신청
                </Link>
                <Link
                  href="/analyze"
                  className="inline-flex h-11 items-center rounded-full border border-foreground/20 px-5 text-sm font-medium hover:border-primary hover:text-primary"
                >
                  다른 가게 분석
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function ScoreCard({
  icon,
  title,
  score,
  grade,
  subtitle,
  tone,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  score: number;
  grade: string;
  subtitle: string;
  tone: "store" | "marketing";
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        tone === "store"
          ? "border-primary/30 bg-primary/[0.04]"
          : "border-rose-500/30 bg-rose-500/[0.04]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          {icon}
          <span>{title}</span>
        </div>
        <span
          className={`rounded-md px-2 py-0.5 font-mono text-xs font-bold ${
            tone === "store"
              ? "bg-primary/15 text-primary"
              : "bg-rose-500/15 text-rose-500"
          }`}
        >
          {grade}
        </span>
      </div>
      <p
        className={`mt-4 font-heading text-5xl font-bold ${scoreColor(score)}`}
      >
        {score}
        <span className="text-lg font-medium text-muted-foreground">
          {" "}
          /100
        </span>
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      {children}
    </div>
  );
}

function SubScore({
  icon,
  label,
  score,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  score: number;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className={`mt-1 font-heading text-2xl font-bold ${scoreColor(score)}`}>
        {score}
      </p>
      {hint && (
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: "high" | "medium" | "low";
}) {
  const styles = {
    high: "bg-rose-500/15 text-rose-500",
    medium: "bg-amber-500/15 text-amber-600",
    low: "bg-primary/15 text-primary",
  } as const;
  const labels = { high: "긴급", medium: "권장", low: "참고" } as const;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-bold ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  );
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-amber-500";
  return "text-rose-500";
}
