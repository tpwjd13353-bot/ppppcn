// 1페이지 — 표지 / 핵심 요약
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, colors, fontSize, spacing } from "./styles";
import { page1Conclusion, type Scenario } from "./scenario";
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
  const { store, marketing, details } = result;
  const gap = store.score - marketing.score;
  const conclusion = page1Conclusion(scenario, gap);

  const dateStr = `${analyzedAt.getFullYear()}.${String(analyzedAt.getMonth() + 1).padStart(2, "0")}.${String(analyzedAt.getDate()).padStart(2, "0")}`;
  const reportShortId = reportId.slice(-6);

  return (
    <Page size="A4" style={styles.page}>
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
          <Text style={styles.badgeOutline}>★ MEITUAN OFFICIAL PARTNER</Text>
          <Text
            style={{
              fontSize: fontSize.xs,
              color: colors.textMuted,
              marginTop: 4,
            }}
          >
            메이투안 본사 정식 인증 대행사
          </Text>
        </View>
      </View>

      {/* ===== 상호명 정보 ===== */}
      <View style={{ marginTop: spacing.xl }}>
        <Text
          style={{
            fontSize: 24,
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
            marginTop: spacing.sm,
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
            marginTop: spacing.xs,
            lineHeight: 1.4,
          }}
        >
          {dateStr} 진단  ·  보고서 #{reportShortId}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* ===== 점수 박스 2개 ===== */}
      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <ScoreBox
          label="상권 종합"
          score={store.score}
          grade={store.grade}
          tone="primary"
          subtitle={`지역 ${details.region.score}점  ·  메뉴 ${details.menu.score ?? "?"}${details.menu.score !== null ? "점" : ""}`}
        />
        <ScoreBox
          label="마케팅"
          score={marketing.score}
          grade={marketing.grade}
          tone="danger"
          subtitle="중국 마케팅 플랫폼 미노출"
        />
      </View>

      {/* ===== 격차 막대 ===== */}
      <View style={{ marginTop: spacing.lg }}>
        <GapBars storeScore={store.score} marketingScore={marketing.score} />
      </View>

      {/* ===== 분석 요약 박스 ===== */}
      <View
        style={[
          styles.card,
          styles.cardPrimary,
          { marginTop: spacing.lg, padding: spacing.lg },
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
            marginTop: spacing.sm,
            lineHeight: 1.5,
            color: colors.text,
          }}
        >
          {conclusion.headline}
        </Text>
        <Text
          style={{
            fontSize: fontSize.base,
            color: colors.textMuted,
            marginTop: spacing.xs,
            lineHeight: 1.6,
          }}
        >
          {conclusion.body}
        </Text>

        {conclusion.showLoss && loss && (
          <View
            style={{
              marginTop: spacing.md,
              paddingTop: spacing.md,
              borderTopWidth: 0.6,
              borderTopColor: colors.primary,
            }}
          >
            <Text
              style={{
                fontSize: fontSize.xs,
                color: colors.textMuted,
                letterSpacing: 0.8,
                lineHeight: 1.2,
              }}
            >
              연 잠재 매출 손실  (보수적 추정)
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: colors.danger,
                marginTop: 6,
                lineHeight: 1.2,
              }}
            >
              {formatLossKRW(loss.annualLossKRWLow)} ~{" "}
              {formatLossKRW(loss.annualLossKRWHigh)}
            </Text>
          </View>
        )}
      </View>

      {/* ===== 푸터 ===== */}
      <View style={styles.footer}>
        <View>
          {loss && (
            <Text>
              {loss.sigungu}는 전국 외국인 방문 {loss.nationalRank}위 시군구입니다
            </Text>
          )}
          <Text style={{ marginTop: 2 }}>
            출처: 한국관광공사 2025  ·  디엔핑 사용률 70% 기반  ·  퍼플페퍼 자체 분석
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

function ScoreBox({
  label,
  score,
  grade,
  subtitle,
  tone,
}: {
  label: string;
  score: number;
  grade: string;
  subtitle: string;
  tone: "primary" | "danger";
}) {
  const accent = tone === "primary" ? colors.primary : colors.danger;
  const badgeBg = tone === "primary" ? colors.primarySoft : colors.dangerSoft;

  return (
    <View
      style={[
        styles.scoreBox,
        tone === "primary" ? styles.cardPrimary : styles.cardDanger,
      ]}
    >
      <View style={styles.scoreLabel}>
        <Text style={styles.scoreLabelText}>{label}</Text>
        <Text
          style={[styles.badge, { color: accent, backgroundColor: badgeBg }]}
        >
          {grade}
        </Text>
      </View>
      <Text style={[styles.scoreValue, { color: accent }]}>{score}</Text>
      <Text style={styles.scoreSubtitle}>{subtitle}</Text>
    </View>
  );
}

function GapBars({
  storeScore,
  marketingScore,
}: {
  storeScore: number;
  marketingScore: number;
}) {
  const gap = storeScore - marketingScore;
  return (
    <View>
      <Bar label="상권" value={storeScore} color={colors.primary} />
      <View style={{ height: 6 }} />
      <Bar label="마케팅" value={marketingScore} color={colors.danger} />
      <Text
        style={{
          marginTop: spacing.sm,
          fontSize: fontSize.sm,
          color: colors.textMuted,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        ← 격차 {gap}점 →
      </Text>
    </View>
  );
}

function Bar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text
        style={{
          width: 48,
          fontSize: fontSize.sm,
          color: colors.textMuted,
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flex: 1,
          height: 12,
          backgroundColor: colors.surface,
          borderRadius: 2,
        }}
      >
        <View
          style={{
            width: `${pct}%`,
            height: 12,
            backgroundColor: color,
            borderRadius: 2,
          }}
        />
      </View>
      <Text
        style={{
          width: 32,
          textAlign: "right",
          fontSize: fontSize.sm,
          fontWeight: 700,
          marginLeft: spacing.sm,
          lineHeight: 1.2,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
