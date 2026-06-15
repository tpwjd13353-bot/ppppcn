// 동적 제안서 1페이지 — 표지 + 1. 현황 진단
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, colors, fontSize, spacing } from "../styles";
import { BackgroundImage } from "../BackgroundImage";
import type { ProposalData } from "@/lib/proposal/types";

export function PdfDynamicPage1({
  data,
  clientName,
}: {
  data: ProposalData;
  clientName: string;
}) {
  return (
    <Page size="A4" style={styles.page} wrap={false}>
      <BackgroundImage />
      <View style={styles.pageInner}>
        {/* 상단 헤더 */}
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
              중국 마케팅 제안서
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.badgeOutline}>★ MEITUAN OFFICIAL PARTNER</Text>
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

        {/* 타이틀 */}
        <View style={{ marginTop: spacing.xl }}>
          <Text style={{ fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 1.2 }}>
            {data.cover.forLine}
          </Text>
          <Text
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: colors.text,
              letterSpacing: -0.5,
              lineHeight: 1.25,
              marginTop: 6,
            }}
          >
            {data.cover.title}
          </Text>
          <Text
            style={{
              fontSize: fontSize.sm,
              color: colors.textMuted,
              marginTop: spacing.sm,
              lineHeight: 1.4,
            }}
          >
            {data.cover.subline}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* 섹션 1. 현황 진단 */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionBar} />
          <Text style={styles.sectionTitle}>1. 현황 진단</Text>
        </View>

        {/* 4박스 진단 그리드 */}
        <View
          style={{
            flexDirection: "row",
            gap: spacing.sm,
            marginTop: spacing.sm,
          }}
        >
          <DiagBox label="강점" body={data.diagnosis.strength} tone="primary" />
          <DiagBox label="현 상태" body={data.diagnosis.current} tone="neutral" />
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: spacing.sm,
            marginTop: spacing.sm,
          }}
        >
          <DiagBox label="핵심 통증" body={data.diagnosis.pain} tone="danger" />
          <DiagBox label="경쟁사 한계" body={data.diagnosis.competitor} tone="warning" />
        </View>

        {/* 결론 박스 */}
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
            진단 결론
          </Text>
          <Text
            style={{
              fontSize: fontSize.md,
              fontWeight: 700,
              marginTop: 6,
              lineHeight: 1.5,
              color: colors.text,
            }}
          >
            {data.diagnosis.conclusionHeadline}
          </Text>
          <Text
            style={{
              fontSize: fontSize.sm,
              color: colors.textMuted,
              marginTop: 6,
              lineHeight: 1.6,
            }}
          >
            {data.diagnosis.conclusionBody}
          </Text>
        </View>

        {/* 시장 데이터 카드 */}
        <View style={{ marginTop: spacing.md }}>
          <Text
            style={{
              fontSize: fontSize.xs,
              fontWeight: 700,
              color: colors.textMuted,
              letterSpacing: 1.5,
              lineHeight: 1.2,
            }}
          >
            왜 이 채널인가
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: spacing.sm,
              marginTop: 6,
            }}
          >
            {data.diagnosis.whyChannel.slice(0, 3).map((c, i) => (
              <DataCard
                key={i}
                big={c.big}
                label={c.label}
                note={c.note}
                highlight={i === 1}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>{clientName} 중국 마케팅 제안서  ·  PURPLEPEPPER co., Ltd.</Text>
        <Text>1 / 4</Text>
      </View>
    </Page>
  );
}

function DataCard({
  big,
  label,
  note,
  highlight,
}: {
  big: string;
  label: string;
  note?: string;
  highlight?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        padding: spacing.md,
        borderLeftWidth: 3,
        borderLeftColor: highlight ? colors.primary : colors.borderStrong,
        backgroundColor: highlight ? colors.primarySofter : colors.surface,
        borderRadius: 4,
      }}
    >
      <Text
        style={{
          fontSize: 20,
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
          fontSize: fontSize.sm,
          color: colors.text,
          marginTop: 4,
          lineHeight: 1.3,
        }}
      >
        {label}
      </Text>
      {note && (
        <Text
          style={{
            fontSize: fontSize.xs,
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

function DiagBox({
  label,
  body,
  tone,
}: {
  label: string;
  body: string;
  tone: "primary" | "neutral" | "danger" | "warning";
}) {
  const accent =
    tone === "primary"
      ? colors.primary
      : tone === "danger"
        ? colors.danger
        : tone === "warning"
          ? colors.warning
          : colors.textMuted;
  const bg =
    tone === "primary"
      ? colors.primarySofter
      : tone === "danger"
        ? colors.dangerSoft
        : tone === "warning"
          ? colors.warningSoft
          : colors.surface;

  return (
    <View
      style={{
        flex: 1,
        padding: spacing.md,
        borderLeftWidth: 3,
        borderLeftColor: accent,
        borderRadius: 4,
        backgroundColor: bg,
      }}
    >
      <Text
        style={{
          fontSize: fontSize.xs,
          fontWeight: 700,
          color: accent,
          letterSpacing: 1,
          lineHeight: 1.2,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: fontSize.sm,
          color: colors.text,
          marginTop: 6,
          lineHeight: 1.55,
        }}
      >
        {body}
      </Text>
    </View>
  );
}
