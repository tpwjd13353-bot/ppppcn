import { notFound } from "next/navigation";
import Link from "next/link";
import { eq, asc } from "drizzle-orm";
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  Award,
  Lock,
  Download,
  FileText,
  Zap,
  TrendingUp,
  Users,
  Sparkles,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { db, schema } from "@/lib/db";
import type { AnalysisResult } from "@/lib/types/scoring";
import type { NaverPlaceData } from "@/lib/analyze/naver";
import { RefineForm } from "./RefineForm";
import { ScoreGauge } from "./ScoreGauge";
import { MenuTable } from "./MenuTable";
import { auth } from "@/lib/auth";
import { lookupRegionInsight } from "@/lib/analyze/regionInsightLookup";
import { lookupLossFromReport } from "@/lib/analyze/lossLookup";
import { extractViralMenus, applyViralTemplate } from "@/lib/analyze/viralMenus";
import {
  buildMonthlyTrend,
  formatPersons,
} from "@/lib/analyze/monthlyDistribution";
import { pickScenario, page2GapLine } from "@/lib/pdf/scenario";

// 한국관광공사 2025 방한 중국 관광객 통계 (전국 공통값)
const KTO_INBOUND_TOTAL_2025 = 5_530_000;
const KTO_INBOUND_YOY_2025 = "+15.4%";

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
  const [rows, session, platforms] = await Promise.all([
    db
      .select()
      .from(schema.analyses)
      .where(eq(schema.analyses.id, id))
      .limit(1),
    auth(),
    db
      .select()
      .from(schema.platformPlaybook)
      .where(eq(schema.platformPlaybook.enabled, true))
      .orderBy(asc(schema.platformPlaybook.sortOrder)),
  ]);
  const row = rows[0];
  if (!row) notFound();
  const isMember = !!session?.user;

  const data = row.reportData as ReportData;
  const { place, result } = data;
  const { store, marketing, details, conclusion, consultation } = result;
  const gap = store.score - marketing.score;

  // 1순위: 사용자 수기 등록 region_insight (28개 외 지역용)
  // 2순위: region_stats.csv 자동 매핑 (28개 시군구 — lossLookup 결과 활용)
  const [regionRow, loss] = await Promise.all([
    lookupRegionInsight(place),
    lookupLossFromReport(data),
  ]);
  const region = regionRow
    ? {
        regionName: regionRow.regionName,
        regionAnnualVisitors: regionRow.regionAnnualVisitors,
        inboundTotal: regionRow.inboundTotal ?? KTO_INBOUND_TOTAL_2025,
        inboundYoy: regionRow.inboundYoy ?? KTO_INBOUND_YOY_2025,
        isEstimate: regionRow.isEstimate,
        sourceLabel: regionRow.sourceLabel,
        peakNote: regionRow.peakNote,
      }
    : loss
      ? {
          regionName: loss.sigungu,
          regionAnnualVisitors: loss.annualChineseVisitors,
          inboundTotal: KTO_INBOUND_TOTAL_2025,
          inboundYoy: KTO_INBOUND_YOY_2025,
          isEstimate: true,
          sourceLabel: "한국관광공사 외래관광객 통계 기반 자체 추정",
          peakNote: null as string | null,
        }
      : null;
  const viral = extractViralMenus(details.menu.matches);
  const scenario = pickScenario(result);
  const scenarioLine = page2GapLine(scenario);

  const hasMenuRows = details.menu.matches.length > 0;

  return (
    <main className="result-scope mx-auto w-full max-w-[920px] px-5 py-12 md:py-16">
      <Link
        href="/analyze"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--rc-txt2)] hover:text-[var(--rc-txt)]"
      >
        <ArrowLeft className="h-4 w-4" />
        다시 분석하기
      </Link>

      {/* 1. 가게 헤더 */}
      <header className="rc-card mt-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-[13px] font-medium text-[var(--rc-red)]">
              {place.category || "분석 결과"}
            </p>
            <h1 className="mt-2 font-heading text-[28px] font-black tracking-tight md:text-[30px]">
              {place.name}
            </h1>
            {(place.address || place.roadAddress) && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--rc-txt2)]">
                <MapPin className="h-4 w-4" />
                {place.roadAddress || place.address}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rc-red)] px-3 py-1 text-[11px] font-bold tracking-[0.03em] text-[var(--rc-red)]">
              <Award className="h-3.5 w-3.5" />
              MEITUAN OFFICIAL PARTNER
            </span>
            <a
              href={place.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--rc-line)] px-3 py-1.5 text-[13px] text-[var(--rc-txt2)] hover:text-[var(--rc-txt)]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              네이버에서 보기
            </a>
          </div>
        </div>
      </header>

      {/* 2. 분석 요약 */}
      <section className="mt-5 rounded-[18px] border border-[var(--rc-red)] bg-[linear-gradient(180deg,rgba(255,45,45,0.06),rgba(255,45,45,0.01))] p-7">
        <p className="flex items-center gap-2 text-[13px] font-medium text-[var(--rc-red)]">
          <Sparkles className="h-4 w-4" />
          분석 요약
        </p>
        <p className="mt-3 text-[21px] font-bold leading-[1.45]">
          {conclusion}
        </p>
      </section>

      {/* 3. 점수 2개 */}
      <section className="mt-5 grid gap-5 md:grid-cols-2">
        <ScoreCard
          icon="🏪"
          title="상권 종합"
          score={store.score}
          grade={store.grade}
          subtitle="위치 · 메뉴 조건"
        >
          <div className="mt-5 border-t border-[var(--rc-lineS)] pt-4">
            <div className="flex gap-10">
              <Metric
                icon="📍"
                label="지역"
                value={details.region.score}
                tone={
                  details.region.score >= 80
                    ? "green"
                    : details.region.score >= 60
                      ? "amber"
                      : "red"
                }
                foot={
                  details.region.match.matchedName
                    ? `${details.region.match.matchedName} (${details.region.match.tier})`
                    : details.region.match.tier
                }
              />
              <Metric
                icon="🍽"
                label="메뉴"
                value={details.menu.score ?? null}
                tone={
                  details.menu.score === null
                    ? "muted"
                    : details.menu.score >= 80
                      ? "green"
                      : details.menu.score >= 60
                        ? "amber"
                        : "red"
                }
                foot={`${details.menu.matchedCount}/${details.menu.matches.length} 매칭`}
              />
            </div>
          </div>
        </ScoreCard>

        <ScoreCard
          icon="📣"
          title="마케팅"
          score={marketing.score}
          grade={marketing.grade}
          subtitle="중국 인바운드 플랫폼"
          danger
        >
          <p className="mt-4 text-[13px] leading-[1.6] text-[var(--rc-txt2)]">
            {marketing.message}
          </p>
        </ScoreCard>
      </section>

      {/* 4. 진단 결과 + 격차 게이지 */}
      <section className="mt-5 flex flex-wrap items-center justify-between gap-7 rounded-[18px] border border-[var(--rc-amber)] bg-[linear-gradient(180deg,rgba(251,191,36,0.05),transparent)] p-7">
        <div className="flex-1 min-w-[260px]">
          <p className="text-[13px] font-medium text-[var(--rc-amber)]">
            진단 결과
          </p>
          <h3 className="mt-2 text-[18px] font-bold leading-[1.5]">
            {scenarioLine}
          </h3>
          {gap >= 30 && (
            <p className="mt-4 flex items-center gap-3 text-[22px] font-black">
              <span>{store.score}</span>
              <span className="text-[var(--rc-txt3)]">→</span>
              <span>{marketing.score}</span>
              <span className="text-[var(--rc-amber)]">−{gap}점</span>
            </p>
          )}
        </div>
        {gap >= 30 && <ScoreGauge score={gap} />}
      </section>

      {/* 5. 지역 인사이트 — region row 있을 때만 */}
      {region && (
        <>
          <h2 className="mt-12 font-heading text-[22px] font-black tracking-tight">
            {region.regionName} 권역 — 중국 관광·거주 데이터
          </h2>
          <p className="mt-2 text-[14px] text-[var(--rc-txt2)]">
            지역 점수 이면의 통계입니다. 출처: {region.sourceLabel || "한국관광공사"}
            {region.isEstimate && (
              <span className="text-[var(--rc-txt3)]"> · 일부 자체 추정</span>
            )}
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <DataCard
              big={
                region.inboundTotal
                  ? `${(region.inboundTotal / 10000).toLocaleString()}만 명`
                  : "—"
              }
              label="2025년 방한 중국 관광객"
              foot={region.inboundYoy ? `전년 대비 ${region.inboundYoy}` : ""}
              chip="한국관광공사"
            />
            <DataCard
              big={
                region.regionAnnualVisitors
                  ? `약 ${Math.round(region.regionAnnualVisitors / 10000)}만 명`
                  : "—"
              }
              label={`${region.regionName} 권역 연간 방문 추정`}
              foot="권역 내 검색·노출 여지 존재"
              chip={region.isEstimate ? "자체 추정" : undefined}
              tone="amber"
            />
          </div>

          {region.regionAnnualVisitors && (
            <div className="mt-4 rc-card-sm">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[14px] font-medium">
                    {region.regionName} 방문 중국인 — 월별 추이 (2025)
                  </p>
                  <p className="mt-1 text-[12px] text-[var(--rc-txt3)]">
                    방한 중국인 월별 입국 비중 × {region.regionName} 권역 연간 방문 추정 · 자체 추정
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[26px] font-black leading-none text-[var(--rc-red)]">
                    약{" "}
                    {Math.round(region.regionAnnualVisitors / 10000)}만 명
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--rc-txt3)]">
                    2025년 권역 연간 방문 추정
                  </p>
                </div>
              </div>
              <div className="mt-5 flex h-[150px] items-end gap-[7px]">
                {buildMonthlyTrend(region.regionAnnualVisitors).map((m) => (
                  <div
                    key={m.month}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className={`w-full rounded-t-[5px] ${
                          m.peak ? "rc-bar-peak" : "rc-bar"
                        }`}
                        style={{ height: `${m.value}%` }}
                        title={`${m.month}월 약 ${formatPersons(m.persons)}`}
                      />
                    </div>
                    <span
                      className={`text-[11px] ${
                        m.peak
                          ? "font-bold text-[var(--rc-amber)]"
                          : "text-[var(--rc-txt3)]"
                      }`}
                    >
                      {m.month}월
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[12px] leading-[1.6] text-[var(--rc-txt3)]">
                {region.peakNote ||
                  "성수기는 5월·8월·10월(국경절) 구간으로 관측됩니다. 6월 무비자 만료 시점 이전 등록을 마치면 하반기 8월·10월 피크 기간 노출에 도움이 될 수 있습니다."}
              </p>
            </div>
          )}
        </>
      )}

      {/* 6. 메뉴 분석 표 + 셀프 추가 폼 — 매칭 결과 있을 때만 */}
      {hasMenuRows && (
        <>
          <h2 className="mt-12 font-heading text-[22px] font-black tracking-tight">
            메뉴 분석 상세
          </h2>
          <p className="mt-2 text-[14px] text-[var(--rc-txt2)]">
            입력된 메뉴 {details.menu.matches.length}개를 우리 DB와 매칭한 결과입니다.
            {details.menu.unmatchedCount > 0 &&
              " 누락된 메뉴를 직접 입력하시면 점수 정확도가 올라갑니다."}
          </p>
          <MenuTable matches={details.menu.matches} initialVisible={10} />

          {details.menu.unmatchedCount > 0 && (
            <RefineForm
              analysisId={id}
              unmatchedCount={details.menu.unmatchedCount}
            />
          )}
        </>
      )}

      {/* 7. 무기 + 플랫폼 플레이북 — 미매칭 음료/디저트 있고 플랫폼 데이터 있을 때만 */}
      {viral.count > 0 && platforms.length > 0 && (
        <>
          <h2 className="mt-12 font-heading text-[22px] font-black tracking-tight">
            메뉴 자산 활용 여지가 있습니다
          </h2>
          <p className="mt-2 text-[14px] text-[var(--rc-txt2)]">
            DB에 등록되지 않은 메뉴 중 비주얼이 강한 음료·디저트는 점수에는 반영되지 않지만
            중국 플랫폼에서 자주 노출되는 카테고리입니다.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rc-card-purple">
              <p className="text-[13px] font-medium text-[var(--rc-txt2)]">
                음료·디저트 미매칭 메뉴
              </p>
              <p className="mt-2 text-[36px] font-black leading-none text-[var(--rc-purple)]">
                {viral.count}종
              </p>
              <p className="mt-2 text-[13px] text-[var(--rc-txt2)]">
                점수 산정에서 제외됨
              </p>
              <p className="mt-1 text-[15px] font-bold text-[var(--rc-purple)]">
                = 시각 콘텐츠로 노출 가능한 자산
              </p>
            </div>
            <div className="rc-card-sm">
              <p className="text-[13px] text-[var(--rc-txt2)]">
                중국 MZ가 SNS에 올리는 것은
              </p>
              <p className="mt-2 text-[16px] font-bold">
                메인 메뉴가 아니라
                <br />
                컬러풀한 음료·디저트 한 컷일 때가 많습니다
              </p>
              <p className="mt-2 text-[13px] text-[var(--rc-txt2)]">
                비주얼 콘텐츠가 자연 노출을 만드는 구조로 알려져 있습니다.
              </p>
            </div>
          </div>

          <div className="rc-play mt-5">
            <div className="flex items-center gap-2">
              <h4 className="text-[16px] font-bold">🎯 플랫폼별 활용 전략 맛보기</h4>
              <span className="rounded-full border border-[var(--rc-purple-line)] px-2.5 py-0.5 text-[11px] text-[var(--rc-purple)]">
                PURPLEPEPPER PLAYBOOK
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-[1.6] text-[var(--rc-txt2)]">
              같은 메뉴 자산도 플랫폼마다 활용 방식이 다릅니다. 대표적인 운영 채널 3종의 접근법 일부입니다.
            </p>

            {platforms.map((p) => (
              <div key={p.platformKey} className="rc-play-row">
                <div className={`rc-pf-icon rc-pf-${p.platformKey}`}>
                  {p.icon || "•"}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-bold">{p.nameKo}</span>
                    {p.nameCn && (
                      <span className="text-[12px] text-[var(--rc-txt3)]">
                        {p.nameCn}
                      </span>
                    )}
                    {p.roleTag && (
                      <span className="rounded bg-[rgba(251,191,36,0.1)] px-1.5 py-0.5 text-[11px] text-[var(--rc-amber)]">
                        {p.roleTag}
                      </span>
                    )}
                  </div>
                  {p.descTemplate && (
                    <p className="mt-2 text-[13px] leading-[1.6] text-[var(--rc-txt2)]">
                      {renderTemplate(
                        applyViralTemplate(p.descTemplate, viral),
                        viral,
                      )}
                    </p>
                  )}
                  {p.lockedTeaser && (
                    <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[var(--rc-txt3)]">
                      <Lock className="h-3 w-3 text-[var(--rc-red)]" />
                      {p.lockedTeaser}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div className="rc-play-foot">
              <p className="text-[13px] text-[var(--rc-txt2)]">
                이 매장 메뉴에 맞춘{" "}
                <span className="text-[var(--rc-txt)] font-bold">
                  플랫폼별 콘텐츠 전략
                </span>
                은 무료 보고서에서 확인하실 수 있습니다.
              </p>
              <Link href="#cta" className="rc-btn-red mt-3">
                <Lock className="h-4 w-4" />
                우리 가게 플랫폼 전략 받기
              </Link>
            </div>
          </div>
        </>
      )}

      {/* 8. 손실 게이팅 (비회원만 잠금) */}
      <h2 className="mt-12 font-heading text-[22px] font-black tracking-tight">
        잠재 손실액과 회복 시나리오
      </h2>
      <p className="mt-2 text-[14px] text-[var(--rc-txt2)]">
        상세 산출은 가입 후 전체 보고서에서 확인하실 수 있습니다.
      </p>

      <div className="relative mt-5 overflow-hidden rounded-[18px] border border-[var(--rc-lineS)]">
        <div
          className={`p-8 ${
            isMember ? "" : "pointer-events-none select-none opacity-50 blur-[6px]"
          }`}
          aria-hidden={!isMember}
        >
          <h4 className="text-[16px] font-bold">연간 잠재 매출 손실 추정</h4>
          <LossRow label="중국 플랫폼 미노출로 인한 월 추정 손실" />
          <LossRow label="음료·디저트 미매칭 바이럴 미활용 손실" />
          <LossRow label="연간 환산 누적 손실 (보수적 시나리오)" />
          <LossRow label="등록 후 90일 예상 회복 매출" positive />
        </div>

        {!isMember && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(20,20,22,0.7),rgba(10,10,11,0.95))] p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--rc-red)] bg-[rgba(255,45,45,0.12)]">
              <ShieldAlert className="h-5 w-5 text-[var(--rc-red)]" />
            </div>
            <h4 className="mt-4 text-[19px] font-bold">
              이 매장의 잠재 손실 추정과 회복 시나리오
            </h4>
            <p className="mt-2 max-w-[440px] text-[14px] leading-[1.6] text-[var(--rc-txt2)]">
              위치·메뉴·상권 데이터를 바탕으로 산출한{" "}
              <b>연간 잠재 손실액과 회복 시나리오</b>는 전체 보고서에 담겨 있습니다.
              지금 무료로 확인하실 수 있습니다.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["연간 손실액 추정", "90일 회복 시나리오", "단계별 액션 가이드"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--rc-line)] bg-[var(--rc-surface2)] px-3.5 py-1.5 text-[12px] text-[var(--rc-txt2)]"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
            <Link href="#cta" className="rc-btn-red mt-6">
              <Lock className="h-4 w-4" />
              무료로 전체 결과 보기
            </Link>
          </div>
        )}
      </div>

      {/* 9. 지금 시작해야 하는 이유 */}
      <div className="mt-5 rounded-[18px] border border-[var(--rc-lineS)] bg-[var(--rc-surface)] p-7">
        <p className="flex items-center gap-2 text-[13px] font-medium text-[var(--rc-amber)]">
          <Zap className="h-4 w-4" />
          지금 시작해야 하는 이유
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <WhyItem
            big="+15.4%"
            title="2025년 방한 중국인 증가율"
            foot="한국관광공사"
            tone="red"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <WhyItem
            title="무비자 확대"
            big=""
            foot="2026 단체 관광객 한시 무비자 / ~2026.06.30 만료"
            tone="amber"
            icon={<Users className="h-4 w-4" />}
          />
          <WhyItem
            big="14일"
            title="MEITUAN 인증 등록 속도"
            foot="자체 등록 8주+"
            tone="amber"
            icon={<Award className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* 10. CTA 후크 + PDF */}
      <section id="cta" className="mt-12 overflow-hidden rounded-[18px] border border-[var(--rc-red)]">
        <div className="bg-[radial-gradient(circle_at_50%_0%,rgba(255,45,45,0.12),transparent_70%)] p-10 text-center">
          <h2 className="text-[26px] font-black leading-[1.5]">
            2025년 방한 중국 관광객{" "}
            <span className="text-[var(--rc-red)]">553만 명</span>.
            <br />
            <span className="text-[var(--rc-red)]">{place.name}</span>은 그 중
            몇 명을 받고 계십니까?
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[14px] leading-[1.7] text-[var(--rc-txt2)]">
            <b className="text-[var(--rc-txt)]">{place.name}</b>의 연간 잠재 매출 손실 추정,
            <br />
            단계별 액션 가이드, 보수적 시나리오까지{" "}
            <b className="text-[var(--rc-txt)]">3페이지 PDF 보고서</b>에 담아드립니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[var(--rc-lineS)] bg-[var(--rc-surface)] p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-[54px] w-[46px] items-center justify-center rounded-md border border-[var(--rc-line)] bg-[var(--rc-surface2)]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-[16px] font-bold">상세 분석 보고서 PDF</h4>
              <p className="mt-1 text-[13px] leading-[1.5] text-[var(--rc-txt2)]">
                {place.name} 진단 결과를 한 장 보고서로 받아보실 수 있습니다.
                <br />
                직원·파트너 공유, 회의 자료로 활용하기 좋습니다.
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-[var(--rc-txt3)]">
                <span>· 연간 잠재 손실 금액 추정</span>
                <span>· 메뉴 매칭 상세표</span>
                <span>· 단계별 액션 가이드</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {isMember ? (
              <a href={`/api/analyze/${id}/pdf`} className="rc-btn-red">
                <Download className="h-4 w-4" />
                PDF 다운로드
              </a>
            ) : (
              <Link
                href={`/login?callbackUrl=/analyze/result/${id}`}
                className="rc-btn-red"
              >
                <Lock className="h-4 w-4" />
                3초 가입하고 PDF 받기
              </Link>
            )}
            <small className="text-[11px] text-[var(--rc-txt3)]">
              계정당 총 3회 · 메이투안 인증 보고서
            </small>
          </div>
        </div>
      </section>

      {/* 11. 전문가 상담 */}
      {consultation.recommended && (
        <section className="mt-5 rounded-[18px] border border-[var(--rc-red)] p-7">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-[var(--rc-amber)]" />
            <h4 className="text-[16px] font-bold">전문가 상담 권장</h4>
            <span className="rounded-full border border-[var(--rc-amber)] px-2.5 py-0.5 text-[11px] text-[var(--rc-amber)]">
              권장
            </span>
          </div>
          {consultation.reasons.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-[14px] text-[var(--rc-txt2)]">
              {consultation.reasons.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[var(--rc-red)]">·</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/contact" className="rc-btn-red">
              무료 상담 신청
            </Link>
            <Link href="/analyze" className="rc-btn-outline">
              다른 가게 분석
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

/* ============================
   Sub components (server)
   ============================ */

function ScoreCard({
  icon,
  title,
  score,
  grade,
  subtitle,
  danger,
  children,
}: {
  icon: string;
  title: string;
  score: number;
  grade: string;
  subtitle: string;
  danger?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`rc-card ${danger ? "border-[rgba(255,45,45,0.4)]" : ""}`}
    >
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[14px] font-medium text-[var(--rc-txt2)]">
          <span>{icon}</span>
          {title}
        </p>
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--rc-red)] text-[12px] font-bold text-[var(--rc-red)]">
          {grade}
        </span>
      </div>
      <p className="mt-4 text-[46px] font-black leading-none text-[var(--rc-red)]">
        {score}
        <span className="ml-1 text-[20px] font-medium text-[var(--rc-txt3)]">
          /100
        </span>
      </p>
      <p className="mt-1 text-[13px] text-[var(--rc-txt2)]">{subtitle}</p>
      {children}
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  tone,
  foot,
}: {
  icon: string;
  label: string;
  value: number | null;
  tone: "green" | "amber" | "red" | "muted";
  foot?: string;
}) {
  const color =
    tone === "green"
      ? "text-[var(--rc-green)]"
      : tone === "amber"
        ? "text-[var(--rc-amber)]"
        : tone === "red"
          ? "text-[var(--rc-red)]"
          : "text-[var(--rc-txt3)]";
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[12px] text-[var(--rc-txt2)]">
        <span>{icon}</span>
        {label}
      </p>
      <p className={`mt-1 text-[24px] font-black ${color}`}>
        {value === null ? "?" : value}
      </p>
      {foot && (
        <p className="mt-0.5 text-[11px] text-[var(--rc-txt3)]">{foot}</p>
      )}
    </div>
  );
}

function DataCard({
  big,
  label,
  foot,
  chip,
  tone,
}: {
  big: string;
  label: string;
  foot?: string;
  chip?: string;
  tone?: "amber";
}) {
  const numColor =
    tone === "amber" ? "text-[var(--rc-amber)]" : "text-[var(--rc-red)]";
  return (
    <div className="rc-card-sm">
      <p className={`text-[32px] font-black leading-[1.1] ${numColor}`}>
        {big}
      </p>
      <p className="mt-1.5 text-[14px] font-medium">{label}</p>
      {foot && (
        <p className="mt-1 text-[12px] text-[var(--rc-txt3)]">{foot}</p>
      )}
      {chip && (
        <span className="mt-2.5 inline-block rounded-full border border-[rgba(255,45,45,0.4)] px-2.5 py-0.5 text-[11px] text-[var(--rc-red)]">
          {chip}
        </span>
      )}
    </div>
  );
}

function LossRow({ label, positive }: { label: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--rc-lineS)] py-3 text-[14px] text-[var(--rc-txt2)] last:border-b-0">
      <span>{label}</span>
      <b
        className={`text-[18px] font-black ${
          positive ? "text-[var(--rc-green)]" : "text-[var(--rc-red)]"
        }`}
      >
        {positive ? "+ ₩ 0,000,000" : "₩ 0,000,000"}
      </b>
    </div>
  );
}

function WhyItem({
  icon,
  big,
  title,
  foot,
  tone,
}: {
  icon: React.ReactNode;
  big: string;
  title: string;
  foot?: string;
  tone: "red" | "amber";
}) {
  const color =
    tone === "amber" ? "text-[var(--rc-amber)]" : "text-[var(--rc-red)]";
  return (
    <div className="rounded-[12px] border border-[var(--rc-lineS)] bg-[var(--rc-surface2)] p-5">
      <span className={color}>{icon}</span>
      {big && (
        <p className={`mt-2 text-[22px] font-black ${color}`}>{big}</p>
      )}
      <p className="mt-1 text-[14px] font-medium">{title}</p>
      {foot && (
        <p className="mt-0.5 text-[11px] text-[var(--rc-txt3)]">{foot}</p>
      )}
    </div>
  );
}

function renderTemplate(text: string, viral: { injection: string }): React.ReactNode {
  if (!text.includes(viral.injection)) return text;
  const parts = text.split(viral.injection);
  return parts.flatMap((p, i) =>
    i === 0
      ? [p]
      : [
          <span key={i} className="font-bold text-[var(--rc-purple)]">
            {viral.injection}
          </span>,
          p,
        ],
  );
}
