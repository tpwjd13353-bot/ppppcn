// 1페이지 — 표지 / 핵심 요약 (개인화 + 데이터 풍부 + 시급성 + 배경 이미지)
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, colors, fontSize, spacing } from "./styles";
import { page1Conclusion, lossBoxHeading, type Scenario } from "./scenario";
import { BackgroundImage } from "./BackgroundImage";
import { Watermark } from "./Watermark";
import {
  formatLossKRW,
  type LossEstimate,
} from "@/lib/analyze/lossEstimate";
import type { AnalysisResult } from "@/lib/types/scoring";
import type { NaverPlaceData } from "@/lib/analyze/naver";

interface Props {
  place: NaverPlaceData;
  result: AnalysisResult;
  scenario: Scenario;
  loss: LossEstimate | null;
  analyzedAt: Date;
  reportId: string;
}

export function PdfPage1({
  place,
  result,
  scenario,
  loss,
  analyzedAt,
  reportId,
}: Props) {
  const { marketing, details } = result;
  const sigungu = loss?.sigungu ?? null;

  const conclusion = page1Conclusion(scenario, {
    placeName: place.name,
    sigungu,
    monthlyChinese: loss?.monthlyChineseVisitors ?? null,
    nationalRank: loss?.nationalRank ?? null,
  });

  const dateStr = `${analyzedAt.getFullYear()}.${String(analyzedAt.getMonth() + 1).padStart(2, "0")}.${String(analyzedAt.getDate()).padStart(2, "0")}`;
  const reportShortId = reportId.slice(-6);

  return (
    <Page size="A4" style={styles.page}>
      <BackgroundImage />
      <Watermark reportId={reportId} />
      <View style={styles.pageInner}>
      {/* ===== 상단 헤더 ===== */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View>
          <Text style={[styles.brand, { lineHeight: 1.2 }]}>PURPLEPEPPER</Text>
          <Text
            style={{
              fontSize: fontSize.lg,
              fontWeight: 700,
              marginTop: 4,
              lineHeight: 1.2,
            }}
          >
            상권 진단 보고서
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 999,
              borderWidth: 0.6,
              borderColor: colors.primary,
            }}
          >
            <Text
              style={{
                fontSize: 8,
                fontWeight: 700,
                color: colors.primary,
                letterSpacing: 1,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              ★  MEITUAN OFFICIAL PARTNER
            </Text>
          </View>
          <Text
            style={{
              fontSize: fontSize.xs,
              color: colors.textMuted,
              marginTop: 4,
              lineHeight: 1.2,
            }}
          >
            메이투안 본사 정식 인증 대행사
          </Text>
        </View>
      </View>

      {/* ===== 상호명 정보 ===== */}
      <View style={{ marginTop: spacing.lg }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: colors.text,
            letterSpacing: -0.5,
            lineHeight: 1.3,
          }}
        >
          {place.name}
        </Text>
        <Text
          style={{
            fontSize: fontSize.md,
            color: colors.textMuted,
            marginTop: spacing.xs,
            lineHeight: 1.4,
          }}
        >
          {[place.category, place.roadAddress || place.address]
            .filter(Boolean)
            .join("  ·  ")}
        </Text>
        <Text
          style={{
            fontSize: fontSize.xs,
            color: colors.textLight,
            marginTop: 2,
            lineHeight: 1.4,
          }}
        >
          {dateStr} 진단  ·  보고서 #{reportShortId}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* ===== 점수 박스 3개 (점수+등급 가로) ===== */}
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <ScoreBox3
          label="상권 분석"
          score={details.region.score}
          tone="primary"
          subtitle="지역 매칭 점수"
        />
        <ScoreBox3
          label="메뉴 분석"
          score={details.menu.score}
          tone="primary"
          subtitle={`${details.menu.matchedCount}/${details.menu.matches.length} 매칭`}
        />
        <ScoreBox3
          label="마케팅"
          score={marketing.score}
          tone="danger"
          subtitle="중국 채널 노출도"
        />
      </View>

      {/* ===== 분석 요약 박스 ===== */}
      <View
        style={[
          styles.card,
          styles.cardPrimary,
          { marginTop: spacing.md, padding: spacing.md },
        ]}
      >
        <Text
          style={{
            fontSize: fontSize.xs,
            fontWeight: 700,
            color: colors.primary,
            letterSpacing: 1.5,
            lineHeight: 1.2,
          }}
        >
          분석 요약
        </Text>
        <Text
          style={{
            fontSize: fontSize.md,
            fontWeight: 700,
            marginTop: 6,
            lineHeight: 1.45,
            color: colors.text,
          }}
        >
          {conclusion.headline}
        </Text>
        <Text
          style={{
            fontSize: fontSize.sm,
            color: colors.text,
            marginTop: 6,
            lineHeight: 1.65,
          }}
        >
          {conclusion.body}
        </Text>

        {conclusion.showLoss && loss && (
          <View
            style={{
              marginTop: spacing.md,
              paddingTop: spacing.sm,
              borderTopWidth: 0.6,
              borderTopColor: colors.primary,
            }}
          >
            <Text
              style={{
                fontSize: fontSize.xs,
                color: colors.textMuted,
                letterSpacing: 0.6,
                lineHeight: 1.2,
              }}
            >
              {lossBoxHeading(sigungu)}
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: colors.danger,
                marginTop: 4,
                lineHeight: 1.2,
              }}
            >
              {formatLossKRW(loss.annualLossKRWLow)} ~{" "}
              {formatLossKRW(loss.annualLossKRWHigh)}
            </Text>
          </View>
        )}
      </View>

      {/* ===== 시급성 박스 — 왜 지금 ===== */}
      <View
        style={[
          styles.card,
          styles.cardWarning,
          { marginTop: spacing.sm, padding: spacing.md },
        ]}
      >
        <Text
          style={{
            fontSize: fontSize.xs,
            fontWeight: 700,
            color: colors.warning,
            letterSpacing: 1.5,
            lineHeight: 1.2,
          }}
        >
          지금 시작해야 하는 이유
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: spacing.md,
            marginTop: spacing.sm,
          }}
        >
          <UrgencyItem
            big="+15.4%"
            text="2025년 방한 중국인 증가율"
            note="한국관광공사"
          />
          <UrgencyItem
            big="무비자 확대"
            text="2026 단체 관광객 한시 무비자"
            note="~2026.06.30"
          />
          <UrgencyItem
            big="14일"
            text="MEITUAN 인증 = 등록 속도"
            note="자체 등록 8주+"
          />
        </View>
      </View>

      {/* ===== 큰 카피 한 줄 ===== */}
      <View style={{ marginTop: spacing.md, alignItems: "center" }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: colors.text,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          2025년 방한 중국 관광객{" "}
          <Text style={{ color: colors.primary }}>509만 명</Text>.{"\n"}
          사장님은 그 중 몇 명을 받고 계십니까?
        </Text>
      </View>

      {/* ===== 데이터 카드 4개 ===== */}
      <View
        style={{
          flexDirection: "row",
          gap: spacing.xs,
          marginTop: spacing.sm,
        }}
      >
        <DataCard big="509만" small="2025년 방한 중국인" note="한국관광공사" />
        <DataCard
          big={
            loss?.annualChineseVisitors
              ? formatVisitorsMan(loss.annualChineseVisitors)
              : "—"
          }
          small={
            sigungu
              ? `${sigungu} 연 방문 중국 관광객`
              : "연 방문 중국 관광객"
          }
          note={sigungu ? `전국 ${loss?.nationalRank}위` : ""}
          highlight
        />
        <DataCard big="70%" small="디엔핑 사용률" note="외식 검색 1위" />
        <DataCard big="1,012" small="USD 1인 평균지출" note="한국관광공사 2025" />
      </View>
      </View>{/* /pageInner */}

      {/* ===== 푸터 ===== */}
      <View style={styles.footer}>
        <View>
          {loss && (
            <Text>
              {loss.sigungu}는 전국 외국인 방문 {loss.nationalRank}위 시군구입니다
            </Text>
          )}
          <Text style={{ marginTop: 2 }}>
            출처: 한국관광공사 2025  ·  디엔핑 사용률 70%  ·  퍼플페퍼 자체 분석
          </Text>
        </View>
        <Text>1 / 3</Text>
      </View>
    </Page>
  );
}

// ─────────────────────────────────────
// Sub components
// ─────────────────────────────────────

/** 점수 박스 — 점수와 등급을 한 줄(가로)로 배치 */
function ScoreBox3({
  label,
  score,
  tone,
  subtitle,
}: {
  label: string;
  score: number | null;
  tone: "primary" | "danger";
  subtitle: string;
}) {
  const accent = tone === "primary" ? colors.primary : colors.danger;
  const bg = tone === "primary" ? styles.cardPrimary : styles.cardDanger;
  const grade = getGradeFromScore(score);

  return (
    <View
      style={[
        styles.card,
        bg,
        { flex: 1, padding: spacing.md, alignItems: "center" },
      ]}
    >
      <Text
        style={{
          fontSize: fontSize.xs,
          fontWeight: 600,
          color: colors.textMuted,
          letterSpacing: 0.5,
          lineHeight: 1.2,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 8,
          marginTop: 10,
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: accent,
            lineHeight: 1.0,
            letterSpacing: -1.5,
          }}
        >
          {score === null ? "?" : score}
        </Text>
        <View
          style={{
            backgroundColor: accent,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
            marginBottom: 6,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.2,
            }}
          >
            {grade}
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontSize: fontSize.xs,
          color: colors.textMuted,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
}

function formatVisitorsMan(n: number): string {
  const man = n / 10000;
  if (man >= 100) return `${Math.round(man).toLocaleString()}만명`;
  if (man >= 10) return `${Math.round(man)}만명`;
  return `${man.toFixed(1)}만명`;
}

function getGradeFromScore(score: number | null): string {
  if (score === null) return "?";
  if (score >= 90) return "A";
  if (score >= 80) return "B+";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

/** 시급성 박스 안 한 줄 — 좌측 강조 라인 */
function UrgencyItem({
  big,
  text,
  note,
}: {
  big: string;
  text: string;
  note?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        paddingLeft: spacing.sm,
        borderLeftWidth: 2,
        borderLeftColor: colors.warning,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: colors.warning,
          lineHeight: 1.1,
          letterSpacing: -0.3,
        }}
      >
        {big}
      </Text>
      <Text
        style={{
          fontSize: fontSize.xs,
          color: colors.text,
          marginTop: 3,
          lineHeight: 1.4,
        }}
      >
        {text}
      </Text>
      {note && (
        <Text
          style={{
            fontSize: 7,
            color: colors.textLight,
            marginTop: 2,
            lineHeight: 1.2,
          }}
        >
          {note}
        </Text>
      )}
    </View>
  );
}

/** 1페이지 하단 통계 데이터 카드 — 좌측 강조 라인 + 카드 톤 */
function DataCard({
  big,
  small,
  note,
  highlight,
}: {
  big: string;
  small: string;
  note?: string;
  highlight?: boolean;
}) {
  return (
    <View
      style={[
        {
          flex: 1,
          padding: spacing.sm,
          borderRadius: 6,
          borderLeftWidth: 3,
          borderLeftColor: highlight ? colors.primary : colors.borderStrong,
          backgroundColor: highlight ? colors.primarySofter : colors.surface,
        },
      ]}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: highlight ? colors.primary : colors.text,
          lineHeight: 1.1,
          letterSpacing: -0.3,
        }}
      >
        {big}
      </Text>
      <Text
        style={{
          fontSize: fontSize.xs,
          color: colors.text,
          marginTop: 4,
          lineHeight: 1.3,
        }}
      >
        {small}
      </Text>
      {note && (
        <Text
          style={{
            fontSize: 7,
            color: colors.textLight,
            marginTop: 2,
            lineHeight: 1.2,
          }}
        >
          {note}
        </Text>
      )}
    </View>
  );
}
