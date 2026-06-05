// 동적 제안서 4페이지 — 6. 예산 + 7. 기대효과 + 운영 프로세스(고정) + 담당자
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, colors, fontSize, spacing } from "../styles";
import { BackgroundImage } from "../BackgroundImage";
import type { ProposalData } from "@/lib/proposal/types";

interface ContactInfo {
  name?: string;
  title?: string;
  phone?: string;
  email?: string;
}

export function PdfDynamicPage4({
  data,
  clientName,
  contact,
}: {
  data: ProposalData;
  clientName: string;
  contact: ContactInfo;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <BackgroundImage />
      <View style={styles.pageInner}>
        {/* 섹션 6. 예산 · 운영 구조 */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionBar} />
          <Text style={styles.sectionTitle}>6. 예산 · 운영 구조</Text>
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
            <Text style={[styles.tableCell, { flex: 2.5, fontWeight: 700, color: colors.primary }]}>항목</Text>
            <Text style={[styles.tableCell, { flex: 2, fontWeight: 700, color: colors.primary }]}>단가 / 구성</Text>
            <Text
              style={[
                styles.tableCell,
                { flex: 1.4, fontWeight: 700, color: colors.primary, textAlign: "right" },
              ]}
            >
              청구 금액 (VAT 포함)
            </Text>
          </View>

          {data.budget.rows.map((r, i) => (
            <BudgetRow key={i} label={r.label} sub={r.sub} unit={r.unit} amount={r.amount} />
          ))}
        </View>

        <Text
          style={{
            fontSize: fontSize.xs,
            color: colors.textMuted,
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          {data.budget.note}
        </Text>

        <View style={{ height: 1, backgroundColor: colors.borderStrong, marginVertical: spacing.md }} />

        {/* 섹션 7. 기대 효과 및 전제 */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionBar} />
          <Text style={styles.sectionTitle}>7. 기대 효과 및 전제</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: spacing.sm,
            marginTop: spacing.sm,
          }}
        >
          <ExpectBox label="기대 가능" body={data.expectation.canExpect} tone="primary" />
          <ExpectBox label="전제 조건" body={data.expectation.premise} tone="warning" />
        </View>

        {/* 운영 프로세스 (고정) */}
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
            운영 프로세스
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: spacing.sm,
              marginTop: 6,
            }}
          >
            <ProcessStep n="01" title="킥오프" body="목표·KPI·일정 합의" />
            <ProcessStep n="02" title="주간 운영" body="채널 집행·콘텐츠 관리" />
            <ProcessStep n="03" title="월간 리포트" body="지표 분석·인사이트 공유" />
            <ProcessStep n="04" title="분기 회고" body="단계 이행 합의" />
          </View>
        </View>

        {/* 담당자 */}
        <View
          style={[
            styles.card,
            styles.cardSurface,
            { marginTop: spacing.md, padding: spacing.md },
          ]}
        >
          <Text
            style={{
              fontSize: fontSize.xs,
              fontWeight: 700,
              color: colors.textMuted,
              letterSpacing: 1.5,
              lineHeight: 1.2,
            }}
          >
            담당자
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: 700,
                  color: colors.text,
                  lineHeight: 1.2,
                }}
              >
                {contact.name ?? "김세정 본부장"}
              </Text>
              <Text
                style={{
                  fontSize: fontSize.sm,
                  color: colors.textMuted,
                  marginTop: 2,
                  lineHeight: 1.2,
                }}
              >
                {contact.title ?? "퍼플페퍼 (PURPLEPEPPER co., Ltd.)"}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              {contact.phone && (
                <Text
                  style={{
                    fontSize: fontSize.md,
                    fontWeight: 700,
                    color: colors.primary,
                    lineHeight: 1.3,
                  }}
                >
                  {contact.phone}
                </Text>
              )}
              {contact.email && (
                <Text
                  style={{
                    fontSize: fontSize.sm,
                    color: colors.textMuted,
                    marginTop: 2,
                    lineHeight: 1.3,
                  }}
                >
                  {contact.email}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>{clientName} 중국 마케팅 제안서  ·  PURPLEPEPPER co., Ltd.</Text>
        <Text>4 / 4</Text>
      </View>
    </Page>
  );
}

function BudgetRow({
  label,
  sub,
  unit,
  amount,
}: {
  label: string;
  sub: string;
  unit: string;
  amount: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 0.6,
        borderBottomColor: colors.border,
        backgroundColor: colors.bg,
        alignItems: "flex-start",
      }}
    >
      <View style={{ flex: 2.5, paddingHorizontal: 8 }}>
        <Text style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.text, lineHeight: 1.3 }}>
          {label}
        </Text>
        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2, lineHeight: 1.3 }}>
          {sub}
        </Text>
      </View>
      <Text style={{ flex: 2, fontSize: fontSize.sm, paddingHorizontal: 8, color: colors.text, lineHeight: 1.4 }}>
        {unit}
      </Text>
      <Text
        style={{
          flex: 1.4,
          fontSize: fontSize.sm,
          paddingHorizontal: 8,
          color: colors.primary,
          fontWeight: 700,
          textAlign: "right",
          lineHeight: 1.4,
        }}
      >
        {amount}
      </Text>
    </View>
  );
}

function ExpectBox({
  label,
  body,
  tone,
}: {
  label: string;
  body: string;
  tone: "primary" | "warning";
}) {
  const accent = tone === "primary" ? colors.primary : colors.warning;
  const bg = tone === "primary" ? colors.primarySofter : colors.warningSoft;
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

function ProcessStep({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: 4,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
        <Text
          style={{
            fontSize: fontSize.xs,
            fontWeight: 700,
            color: colors.primary,
            letterSpacing: 0.6,
            lineHeight: 1.2,
          }}
        >
          {n}
        </Text>
        <Text style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.text, lineHeight: 1.2 }}>
          {title}
        </Text>
      </View>
      <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2, lineHeight: 1.3 }}>
        {body}
      </Text>
    </View>
  );
}
