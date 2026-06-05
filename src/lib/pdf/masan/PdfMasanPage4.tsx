// 마산게낙찜 제안서 4페이지 — 예산·운영 + 기대효과 + 연락처
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, colors, fontSize, spacing } from "../styles";
import { BackgroundImage } from "../BackgroundImage";

interface Props {
  contactName?: string;
  contactTitle?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export function PdfMasanPage4({
  contactName,
  contactTitle,
  contactPhone,
  contactEmail,
}: Props) {
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
            <Text style={[styles.tableCell, { flex: 2.5, fontWeight: 700, color: colors.primary }]}>
              항목
            </Text>
            <Text style={[styles.tableCell, { flex: 2, fontWeight: 700, color: colors.primary }]}>
              단가 / 구성
            </Text>
            <Text
              style={[
                styles.tableCell,
                { flex: 1.4, fontWeight: 700, color: colors.primary, textAlign: "right" },
              ]}
            >
              청구 금액 (VAT 포함)
            </Text>
          </View>

          <BudgetRow
            label="따종디엔핑 매장등록 · 운영 · 광고"
            sub="CPC 광고비 5,000위안 포함 (공식 단가)"
            unit="11,200위안"
            amount="280만원"
          />
          <BudgetRow
            label="샤오홍슈 KOC(마이크로 인플루언서) 시딩"
            sub="2만원 × 100팀"
            unit="200만원"
            amount="220만원"
          />
          <BudgetRow
            label="샤오홍슈 KOL(메가 인플루언서) 시딩"
            sub="인플루언서별 상이"
            unit="원고비 건별 전달 · 컨펌 후 집행"
            amount="별도"
          />
          <BudgetRow
            label="콘텐츠 현지화"
            sub="KOC 시딩에 포함"
            unit="—"
            amount="포함"
          />
        </View>

        <Text
          style={{
            fontSize: fontSize.xs,
            color: colors.textMuted,
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          ※ 1위안 = 약 200원 기준 (변동 가능). VAT 포함 청구액 기준, 정산 환율은 집행 시점 재확인.
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
          <ExpectBox
            label="기대 가능"
            body="위치 우위 + 디엔핑 평점·쿠폰 최적화로 경쟁 게장집 대비 노출·선택률 개선 기대. 길찾기·쿠폰 사용 선행 지표 확보."
            tone="primary"
          />
          <ExpectBox
            label="전제 조건"
            body="해운대 경쟁 극심 — 평점·리뷰 관리 지속 필요. 샤오홍슈 콜드스타트 2~3개월. KOC 편차 발생 가능. 단기 매출 폭발은 약속하지 않습니다."
            tone="warning"
          />
        </View>

        {/* 운영 프로세스 */}
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

        {/* 담당자 / 연락처 */}
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
                {contactName ?? "김세정 본부장"}
              </Text>
              <Text
                style={{
                  fontSize: fontSize.sm,
                  color: colors.textMuted,
                  marginTop: 2,
                  lineHeight: 1.2,
                }}
              >
                {contactTitle ?? "퍼플페퍼 (PURPLEPEPPER co., Ltd.)"}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              {contactPhone && (
                <Text
                  style={{
                    fontSize: fontSize.md,
                    fontWeight: 700,
                    color: colors.primary,
                    lineHeight: 1.3,
                  }}
                >
                  {contactPhone}
                </Text>
              )}
              {contactEmail && (
                <Text
                  style={{
                    fontSize: fontSize.sm,
                    color: colors.textMuted,
                    marginTop: 2,
                    lineHeight: 1.3,
                  }}
                >
                  {contactEmail}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>마산게낙찜·해마끼 간장게장 중국 마케팅 제안서  ·  PURPLEPEPPER co., Ltd.</Text>
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
        <Text
          style={{
            fontSize: fontSize.sm,
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.3,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: fontSize.xs,
            color: colors.textMuted,
            marginTop: 2,
            lineHeight: 1.3,
          }}
        >
          {sub}
        </Text>
      </View>
      <Text
        style={{
          flex: 2,
          fontSize: fontSize.sm,
          paddingHorizontal: 8,
          color: colors.text,
          lineHeight: 1.4,
        }}
      >
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

function ProcessStep({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
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
        <Text
          style={{
            fontSize: fontSize.sm,
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.2,
          }}
        >
          {title}
        </Text>
      </View>
      <Text
        style={{
          fontSize: fontSize.xs,
          color: colors.textMuted,
          marginTop: 2,
          lineHeight: 1.3,
        }}
      >
        {body}
      </Text>
    </View>
  );
}
