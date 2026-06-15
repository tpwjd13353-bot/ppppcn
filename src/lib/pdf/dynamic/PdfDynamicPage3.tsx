// 동적 제안서 3페이지 — 4. Phase 2 + 5. 콘텐츠 방향성
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, colors, fontSize, spacing } from "../styles";
import { BackgroundImage } from "../BackgroundImage";
import type { ProposalData } from "@/lib/proposal/types";

export function PdfDynamicPage3({
  data,
  clientName,
}: {
  data: ProposalData;
  clientName: string;
}) {
  const axes = data.content.axes.slice(0, 4);
  const row1 = axes.slice(0, 2);
  const row2 = axes.slice(2, 4);
  return (
    <Page size="A4" style={styles.page} wrap={false}>
      <BackgroundImage />
      <View style={styles.pageInner}>
        {/* 섹션 4. Phase 2 */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionBar} />
          <Text style={styles.sectionTitle}>4. Phase 2 — 브랜드 자산화 (3–6개월)</Text>
        </View>

        <View
          style={[
            styles.card,
            styles.cardSurface,
            { marginTop: spacing.sm, padding: spacing.md },
          ]}
        >
          <Text style={{ fontSize: fontSize.sm, color: colors.text, lineHeight: 1.6 }}>
            {data.phase2.intro}
          </Text>
          <View style={{ marginTop: 8 }}>
            {data.phase2.bullets.map((t, i) => (
              <Bullet key={i} text={t} />
            ))}
          </View>
        </View>

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
            Phase 2 KPI
          </Text>
          <View style={{ marginTop: 6 }}>
            {data.phase2.kpiBullets.map((t, i) => (
              <Bullet key={i} text={t} />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* 섹션 5. 콘텐츠 방향성 */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionBar} />
          <Text style={styles.sectionTitle}>5. 콘텐츠 방향성</Text>
        </View>

        <Text
          style={{
            fontSize: fontSize.sm,
            color: colors.textMuted,
            marginTop: 4,
            marginBottom: spacing.sm,
            lineHeight: 1.55,
          }}
        >
          {data.content.intro}
        </Text>

        {/* 4축 그리드 */}
        <View
          style={{
            flexDirection: "row",
            gap: spacing.sm,
            marginTop: spacing.xs,
          }}
        >
          {row1.map((a, i) => (
            <ContentAxis key={i} pct={a.pct} label={a.label} body={a.body} />
          ))}
          {row1.length < 2 && <View style={{ flex: 1 }} />}
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: spacing.sm,
            marginTop: spacing.sm,
          }}
        >
          {row2.map((a, i) => (
            <ContentAxis key={i} pct={a.pct} label={a.label} body={a.body} />
          ))}
          {row2.length < 2 && <View style={{ flex: 1 }} />}
        </View>

        {/* 공통 가이드 */}
        <View
          style={[
            styles.card,
            styles.cardSurface,
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
            공통 가이드
          </Text>
          <View style={{ marginTop: 6 }}>
            {data.content.commonGuide.map((t, i) => (
              <Bullet key={i} text={t} />
            ))}
          </View>
        </View>

        {/* 차별화 비교 */}
        <View
          style={{
            marginTop: spacing.sm,
            flexDirection: "row",
            gap: spacing.sm,
          }}
        >
          <CompareBox label={data.content.compareLeftLabel} items={data.content.compareLeft} tone="muted" />
          <CompareBox label={data.content.compareRightLabel} items={data.content.compareRight} tone="primary" />
        </View>
      </View>

      <View style={styles.footer}>
        <Text>{clientName} 중국 마케팅 제안서  ·  PURPLEPEPPER co., Ltd.</Text>
        <Text>3 / 4</Text>
      </View>
    </Page>
  );
}

function ContentAxis({ pct, label, body }: { pct: string; label: string; body: string }) {
  return (
    <View
      style={{
        flex: 1,
        padding: spacing.md,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
        backgroundColor: colors.primarySofter,
        borderRadius: 4,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
        <Text style={{ fontSize: 18, fontWeight: 700, color: colors.primary, lineHeight: 1.1 }}>{pct}</Text>
        <Text style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.text, lineHeight: 1.3 }}>
          {label}
        </Text>
      </View>
      <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 6, lineHeight: 1.55 }}>
        {body}
      </Text>
    </View>
  );
}

function CompareBox({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "primary" | "muted";
}) {
  const accent = tone === "primary" ? colors.primary : colors.textMuted;
  const bg = tone === "primary" ? colors.primarySofter : colors.surface;
  return (
    <View
      style={{
        flex: 1,
        padding: spacing.md,
        borderLeftWidth: 3,
        borderLeftColor: accent,
        backgroundColor: bg,
        borderRadius: 4,
      }}
    >
      <Text
        style={{
          fontSize: fontSize.xs,
          fontWeight: 700,
          color: accent,
          letterSpacing: 0.6,
          lineHeight: 1.2,
        }}
      >
        {label}
      </Text>
      <View style={{ marginTop: 6 }}>
        {items.map((t, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginTop: 3,
            }}
          >
            <Text style={{ fontSize: fontSize.sm, color: accent, marginRight: 6, fontWeight: 700, lineHeight: 1.5 }}>
              ·
            </Text>
            <Text style={{ fontSize: fontSize.xs, color: colors.text, flex: 1, lineHeight: 1.5 }}>{t}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Bullet({ text, accent }: { text: string; accent?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 4 }}>
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
