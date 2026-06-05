// 동적 제안서 2페이지 — 2. 단계 전략 + 3. Phase 1
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, colors, fontSize, spacing } from "../styles";
import { BackgroundImage } from "../BackgroundImage";
import type { ProposalData } from "@/lib/proposal/types";

export function PdfDynamicPage2({
  data,
  clientName,
}: {
  data: ProposalData;
  clientName: string;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <BackgroundImage />
      <View style={styles.pageInner}>
        {/* 섹션 2. 단계 전략 개요 */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionBar} />
          <Text style={styles.sectionTitle}>2. 단계 전략 개요</Text>
        </View>

        <View
          style={{
            marginTop: spacing.sm,
            borderWidth: 0.6,
            borderColor: colors.borderStrong,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 1.2, fontWeight: 700, color: colors.primary }]}>구분</Text>
            <Text style={[styles.tableCell, { flex: 2.5, fontWeight: 700, color: colors.primary }]}>목표</Text>
            <Text style={[styles.tableCell, { flex: 2, fontWeight: 700, color: colors.primary }]}>주요 채널</Text>
          </View>
          <TableRow
            label="Phase 1"
            sub="0–3개월"
            goal={data.phaseStrategy.phase1Goal}
            channel={data.phaseStrategy.phase1Channel}
            highlight
          />
          <TableRow
            label="Phase 2"
            sub="3–6개월"
            goal={data.phaseStrategy.phase2Goal}
            channel={data.phaseStrategy.phase2Channel}
          />
        </View>

        <Text
          style={{
            fontSize: fontSize.xs,
            color: colors.textMuted,
            marginTop: spacing.sm,
            lineHeight: 1.5,
          }}
        >
          {data.phaseStrategy.principle}
        </Text>

        <View style={styles.divider} />

        {/* 섹션 3. Phase 1 상세 */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionBar} />
          <Text style={styles.sectionTitle}>3. Phase 1 — 중국 관광객 매장 전환 (최우선)</Text>
        </View>

        {/* ① 따종디엔핑 */}
        <View
          style={[
            styles.card,
            styles.cardSurface,
            { marginTop: spacing.sm, padding: spacing.md },
          ]}
        >
          <Text
            style={{
              fontSize: fontSize.md,
              fontWeight: 700,
              color: colors.primary,
              lineHeight: 1.2,
            }}
          >
            ① 따종디엔핑 매장 최적화
          </Text>
          <View style={{ marginTop: 6 }}>
            {data.phase1.dianpingBullets.map((t, i) => (
              <Bullet key={i} text={t} />
            ))}
          </View>
        </View>

        {/* ② 샤오홍슈 KOC */}
        <View
          style={[
            styles.card,
            styles.cardSurface,
            { marginTop: spacing.sm, padding: spacing.md },
          ]}
        >
          <Text
            style={{
              fontSize: fontSize.md,
              fontWeight: 700,
              color: colors.primary,
              lineHeight: 1.2,
            }}
          >
            ② 샤오홍슈 KOC(마이크로 인플루언서) 시딩
          </Text>
          <View style={{ marginTop: 6 }}>
            {data.phase1.kocBullets.map((t, i) => (
              <Bullet key={i} text={t} />
            ))}
          </View>
        </View>

        {/* KPI 박스 */}
        <View
          style={[
            styles.card,
            styles.cardPrimary,
            { marginTop: spacing.sm, padding: spacing.md },
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
            Phase 1 KPI
          </Text>
          <View style={{ marginTop: 6 }}>
            {data.phase1.kpiBullets.map((t, i) => (
              <Bullet
                key={i}
                text={t}
                accent={i === data.phase1.kpiBullets.length - 1}
              />
            ))}
          </View>
        </View>

        {/* 타임라인 */}
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
            Phase 1 액션 타임라인
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: spacing.sm,
              marginTop: 6,
            }}
          >
            {data.phase1.timeline.slice(0, 3).map((t, i) => (
              <TimelineStep
                key={i}
                month={t.month}
                title={t.title}
                body={t.body}
                highlight={i === 1}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>{clientName} 중국 마케팅 제안서  ·  PURPLEPEPPER co., Ltd.</Text>
        <Text>2 / 4</Text>
      </View>
    </Page>
  );
}

function TableRow({
  label,
  sub,
  goal,
  channel,
  highlight,
}: {
  label: string;
  sub: string;
  goal: string;
  channel: string;
  highlight?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: highlight ? colors.primarySofter : colors.bg,
        paddingVertical: 10,
        paddingHorizontal: 0,
        borderBottomWidth: 0.6,
        borderBottomColor: colors.border,
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1.2, paddingHorizontal: 8 }}>
        <Text
          style={{
            fontSize: fontSize.md,
            fontWeight: 700,
            color: colors.primary,
            lineHeight: 1.2,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: fontSize.xs,
            color: colors.textMuted,
            marginTop: 2,
            lineHeight: 1.2,
          }}
        >
          {sub}
        </Text>
      </View>
      <Text style={{ flex: 2.5, fontSize: fontSize.sm, paddingHorizontal: 8, color: colors.text, lineHeight: 1.4 }}>
        {goal}
      </Text>
      <Text style={{ flex: 2, fontSize: fontSize.sm, paddingHorizontal: 8, color: colors.textMuted, lineHeight: 1.4 }}>
        {channel}
      </Text>
    </View>
  );
}

function TimelineStep({
  month,
  title,
  body,
  highlight,
}: {
  month: string;
  title: string;
  body: string;
  highlight?: boolean;
}) {
  const accent = highlight ? colors.primary : colors.borderStrong;
  const bg = highlight ? colors.primarySofter : colors.surface;
  return (
    <View
      style={{
        flex: 1,
        padding: spacing.md,
        borderTopWidth: 3,
        borderTopColor: accent,
        backgroundColor: bg,
        borderRadius: 4,
      }}
    >
      <Text
        style={{
          fontSize: fontSize.xs,
          fontWeight: 700,
          color: highlight ? colors.primary : colors.textMuted,
          letterSpacing: 0.6,
          lineHeight: 1.2,
        }}
      >
        {month}
      </Text>
      <Text style={{ fontSize: fontSize.md, fontWeight: 700, color: colors.text, marginTop: 4, lineHeight: 1.2 }}>
        {title}
      </Text>
      <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 4, lineHeight: 1.5 }}>
        {body}
      </Text>
    </View>
  );
}

function Bullet({ text, accent }: { text: string; accent?: boolean }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 4,
      }}
    >
      <Text
        style={{
          fontSize: fontSize.sm,
          color: accent ? colors.danger : colors.primary,
          marginRight: 6,
          fontWeight: 700,
          lineHeight: 1.55,
        }}
      >
        ·
      </Text>
      <Text
        style={{
          fontSize: fontSize.sm,
          color: accent ? colors.danger : colors.text,
          fontWeight: accent ? 700 : 400,
          flex: 1,
          lineHeight: 1.55,
        }}
      >
        {text}
      </Text>
    </View>
  );
}
