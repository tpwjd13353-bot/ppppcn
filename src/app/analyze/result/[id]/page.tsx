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
  FileText,
  Lock,
  Download,
  TrendingUp,
  Users,
  Award,
  Zap,
} from "lucide-react";
import { db, schema } from "@/lib/db";
import type { AnalysisResult } from "@/lib/types/scoring";
import type { NaverPlaceData } from "@/lib/analyze/naver";
import { ScoreGauge } from "./ScoreGauge";
import { RefineForm } from "./RefineForm";
import { auth } from "@/lib/auth";
import { lookupLossFromReport } from "@/lib/analyze/lossLookup";
import { pickScenario, page2GapLine } from "@/lib/pdf/scenario";

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
  const [rows, session] = await Promise.all([
    db
      .select()
      .from(schema.analyses)
      .where(eq(schema.analyses.id, id))
      .limit(1),
    auth(),
  ]);
  const row = rows[0];
  if (!row) notFound();
  const isMember = !!session?.user;

  const data = row.reportData as ReportData;
  const { place, result } = data;
  const { store, marketing, details, conclusion, consultation } = result;
  const gap = store.score - marketing.score;

  // 개인화 데이터(시군구, 월·연 방문객, 전국 순위) 조회
  const loss = await lookupLossFromReport(data);
  const scenario = pickScenario(result);
  const scenarioLine = page2GapLine(scenario);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
      <Link
        href="/analyze"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        다시 분석하기
      </Link>

      {/* ─────────────────────────────────────────
          1. HEADER — 가게 정보 + MEITUAN 신뢰 뱃지
          ───────────────────────────────────────── */}
      <header className="mt-6 rounded-2xl border border-border/40 bg-background/60 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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
          <div className="flex flex-col items-stretch gap-2 md:items-end">
            <MeituanBadge />
            <a
              href={place.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center gap-1.5 self-start rounded-full border border-foreground/20 px-3 text-xs font-medium hover:border-primary hover:text-primary md:self-end"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              네이버에서 보기
            </a>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────
          2. 즉답 — 분석 요약 (가게명 강조)
          ───────────────────────────────────────── */}
      <section className="mt-6 rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] p-6 md:p-8">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-1 h-6 w-6 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              분석 요약
            </p>
            <p className="mt-2 font-heading text-xl font-bold leading-snug md:text-2xl">
              {highlightPlaceInText(conclusion, place.name)}
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          3. 점수 2개 — 진단
          ───────────────────────────────────────── */}
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
              score={details.menu.score ?? null}
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

      {/* ─────────────────────────────────────────
          4. 메뉴 분석 표 — 근거
          ───────────────────────────────────────── */}
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
                      <span className="text-amber-500" title="정보 부족">?</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {m.matched ? m.분류 : "정보 부족"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 미매칭 메뉴 직접 입력 (불일치 메뉴가 있을 때만) */}
      {details.menu.unmatchedCount > 0 && (
        <RefineForm
          analysisId={id}
          unmatchedCount={details.menu.unmatchedCount}
        />
      )}

      {/* ─── 여기까지 진단·근거 ─── 아래부터 인사이트 + CTA ─── */}

      {/* ─────────────────────────────────────────
          5. 진단 한 줄 + (조건부) 격차 시각화
          ───────────────────────────────────────── */}
      <section
        className={`mt-10 rounded-2xl border p-6 md:p-8 ${
          gap >= 30
            ? "border-amber-500/40 bg-amber-500/[0.04]"
            : "border-border/40 bg-background/60"
        }`}
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <p
              className={`text-xs font-medium uppercase tracking-[0.18em] ${
                gap >= 30 ? "text-amber-600" : "text-primary"
              }`}
            >
              진단 결과
            </p>
            <p className="mt-3 font-heading text-lg font-bold leading-snug md:text-xl">
              {scenarioLine}
            </p>
            {gap >= 30 && (
              <p className="mt-3 font-heading text-2xl font-bold text-foreground md:text-3xl">
                <span className="text-foreground">{store.score}</span>
                <span className="mx-2 text-muted-foreground">→</span>
                <span className="text-foreground">{marketing.score}</span>
                <span className="ml-3 text-amber-500">−{gap}점</span>
              </p>
            )}
          </div>
          {gap >= 30 && <ScoreGauge score={gap} />}
        </div>
      </section>

      {/* ─────────────────────────────────────────
          6. 개인화 인사이트 — "내 동네 얘기"
          ───────────────────────────────────────── */}
      {loss && (
        <section className="mt-6 rounded-2xl border border-primary/30 bg-primary/[0.04] p-6 md:p-8">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                사장님 매장 주변 데이터
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground md:text-lg">
                <Hl>{loss.sigungu}</Hl>는 전국 외국인 방문{" "}
                <Hl>{loss.nationalRank}위</Hl> 시군구입니다.
                <br />
                매월{" "}
                <Hl>{loss.monthlyChineseVisitors.toLocaleString()}명</Hl>의
                중국 관광객이 사장님 매장 주변을 지나갑니다.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 md:gap-4">
                <StatBox
                  label="전국 외국인 방문 순위"
                  big={`${loss.nationalRank}위`}
                  sub="외국인 방문 시군구"
                />
                <StatBox
                  label="월 방문 중국 관광객"
                  big={`${loss.monthlyChineseVisitors.toLocaleString()}명`}
                  sub={`${loss.sigungu} 기준`}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────
          7. URGENCY — 왜 지금
          ───────────────────────────────────────── */}
      <section className="mt-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.06] to-amber-500/[0.02] p-6 md:p-8">
        <div className="flex items-start gap-3">
          <Zap className="mt-1 h-6 w-6 shrink-0 text-amber-600" />
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-600">
              지금 시작해야 하는 이유
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <UrgencyItem
                icon={<TrendingUp className="h-5 w-5" />}
                big="+15.4%"
                text="2025년 방한 중국인 증가율"
                note="한국관광공사"
              />
              <UrgencyItem
                icon={<Users className="h-5 w-5" />}
                big="무비자 확대"
                text="2026 단체 관광객 한시 무비자"
                note="~2026.06.30 만료"
              />
              <UrgencyItem
                icon={<Award className="h-5 w-5" />}
                big="14일"
                text="MEITUAN 인증 등록 속도"
                note="자체 등록 8주+"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          8. CTA 후크 + PDF 카드 — 호기심 → 다운로드
          ───────────────────────────────────────── */}
      <section className="mt-10">
        <div className="rounded-t-2xl border border-b-0 border-primary/30 bg-gradient-to-br from-primary/[0.10] to-primary/[0.02] p-6 md:p-8">
          <p className="text-center font-heading text-xl font-bold leading-snug md:text-2xl">
            2025년 방한 중국 관광객{" "}
            <span className="text-primary">509만 명</span>.
            <br />
            <Hl>{place.name}</Hl>은 그 중 몇 명을 받고 계십니까?
          </p>
          <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground md:text-base">
            <Hl>{place.name}</Hl>의 연간 잠재 매출 손실 추정,
            <br />
            단계별 액션 가이드, 보수적 시나리오까지
            <br />
            <span className="text-foreground">3페이지 PDF 보고서에 담아드립니다.</span>
          </p>
        </div>
        <PdfReportCard
          isMember={isMember}
          analysisId={id}
          placeName={place.name}
        />
      </section>

      {/* ─────────────────────────────────────────
          9. 상담 카드 (조건부)
          ───────────────────────────────────────── */}
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

/* ─────────────────────────────────────────
   강조 컴포넌트
   ───────────────────────────────────────── */

function Hl({ children }: { children: React.ReactNode }) {
  return <span className="font-bold text-primary">{children}</span>;
}

/** 결론 문구 안에 placeName이 등장하면 그 부분만 Hl로 감쌈 */
function highlightPlaceInText(text: string, placeName: string): React.ReactNode {
  if (!placeName || !text.includes(placeName)) return text;
  const parts = text.split(placeName);
  return parts.flatMap((p, i) =>
    i === 0 ? [p] : [<Hl key={i}>{placeName}</Hl>, p],
  );
}

function MeituanBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-primary/50 px-3 py-1.5 md:self-end">
      <Award className="h-3.5 w-3.5 text-primary" />
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
        Meituan Official Partner
      </span>
    </div>
  );
}

function StatBox({
  label,
  big,
  sub,
}: {
  label: string;
  big: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-primary/30 bg-background/60 p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-heading text-2xl font-bold text-primary md:text-3xl">
        {big}
      </p>
      {sub && (
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      )}
    </div>
  );
}

function UrgencyItem({
  icon,
  big,
  text,
  note,
}: {
  icon: React.ReactNode;
  big: string;
  text: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-background/60 p-4">
      <div className="text-amber-600">{icon}</div>
      <p className="mt-2 font-heading text-lg font-bold text-amber-600 md:text-xl">
        {big}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{text}</p>
      {note && (
        <p className="mt-1 text-[11px] text-muted-foreground">{note}</p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   기존 컴포넌트
   ───────────────────────────────────────── */

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
  score: number | null;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      {score === null ? (
        <p className="mt-1 font-heading text-2xl font-bold text-amber-500">?</p>
      ) : (
        <p className={`mt-1 font-heading text-2xl font-bold ${scoreColor(score)}`}>
          {score}
        </p>
      )}
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

function PdfReportCard({
  isMember,
  analysisId,
  placeName,
}: {
  isMember: boolean;
  analysisId: string;
  placeName: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-b-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.08] via-background to-background p-6 md:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* 좌측: 미리보기 카드 (블러) */}
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md border border-border/40 bg-background/60">
            <div className="absolute inset-0 flex flex-col items-stretch gap-1 p-2">
              <div className="h-1.5 w-3/4 rounded-full bg-primary/40" />
              <div className="h-1 w-full rounded-full bg-muted-foreground/30" />
              <div className="h-1 w-5/6 rounded-full bg-muted-foreground/30" />
              <div className="mt-1 h-6 w-full rounded bg-primary/20" />
              <div className="h-1 w-2/3 rounded-full bg-muted-foreground/30" />
              <div className="h-1 w-full rounded-full bg-muted-foreground/30" />
            </div>
            <div
              className={`absolute inset-0 backdrop-blur-[2px] ${
                isMember ? "" : "bg-background/30"
              }`}
            />
            {!isMember && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-heading text-lg font-bold md:text-xl">
                상세 분석 보고서 PDF
              </h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {placeName} 진단 결과를 한 장 보고서로 받아보실 수 있어요.
              <br />
              직원·파트너와 공유, 회의 자료로 활용하기 좋아요.
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground/80">
              <li>· 연간 잠재 손실 금액 추정</li>
              <li>· 메뉴 매칭 상세표</li>
              <li>· 단계별 액션 가이드</li>
              <li>· 보수적 시나리오 분석</li>
            </ul>
          </div>
        </div>

        {/* 우측: 버튼 */}
        <div className="flex shrink-0 flex-col items-stretch gap-2 md:items-end">
          {isMember ? (
            <>
              <a
                href={`/api/analyze/${analysisId}/pdf`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                PDF 다운로드
              </a>
              <p className="text-center text-[11px] text-muted-foreground/70 md:text-right">
                계정당 총 3회 · 메이투안 인증 보고서
              </p>
            </>
          ) : (
            <>
              <Link
                href={`/login?callbackUrl=/analyze/result/${analysisId}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:opacity-90"
              >
                <Lock className="h-4 w-4" />
                3초 가입하고 PDF 받기
              </Link>
              <p className="text-center text-[11px] text-muted-foreground/70 md:text-right">
                카카오 · 이메일 가입 · 가입 후 PDF 3회 제공
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
