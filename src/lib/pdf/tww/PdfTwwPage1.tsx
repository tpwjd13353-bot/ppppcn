// TWW 제안서 1페이지 — 표지 + 현황 진단
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, colors, fontSize, spacing } from "../styles";
import { BackgroundImage } from "../BackgroundImage";

export function PdfTwwPage1({ issuedAt }: { issuedAt: Date }) {
  const dateStr = `${issuedAt.getFullYear()}.${String(issuedAt.getMonth() + 1).padStart(2, "0")}.${String(issuedAt.getDate()).padStart(2, "0")}`;

  return (
    <Page size="A4" style={styles.page}>
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
            FOR. TWW · (주)나리온
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
            관광객 유입을 매장 방문·구매로{"\n"}연결하기 위한 중국 마케팅 설계
          </Text>
          <Text
            style={{
              fontSize: fontSize.sm,
              color: colors.textMuted,
              marginTop: spacing.sm,
              lineHeight: 1.4,
            }}
          >
            클라이언트: TWW (대표 이도연)  ·  발행일: {dateStr}  ·  PURPLEPEPPER co., Ltd.
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
          <DiagBox
            label="강점"
            body={`고농축 천연원료 기반 스킨케어\n성분 스토리·창업자 서사\nCare Magazine 등 콘텐츠 자산 보유`}
            tone="primary"
          />
          <DiagBox
            label="현 상태"
            body={`강남 논현 플래그십스토어 운영\n해외배송 미운영\n중국 본토 직판 통로 없음`}
            tone="neutral"
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: spacing.sm,
            marginTop: spacing.sm,
          }}
        >
          <DiagBox
            label="핵심 통증"
            body={`관광객 유입은 많지만\n플래그십스토어 방문으로\n이어지지 않음`}
            tone="danger"
          />
          <DiagBox
            label="경쟁사 한계"
            body={`체험단 양산형 콘텐츠 중심\n진정성·차별화 부재\n저장·재방문률 낮음`}
            tone="warning"
          />
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
            게시물 수가 아닌, 관광객 → 매장 방문 → 구매 전환 설계가 필요합니다.
          </Text>
          <Text
            style={{
              fontSize: fontSize.sm,
              color: colors.textMuted,
              marginTop: 6,
              lineHeight: 1.6,
            }}
          >
            TWW의 자산은 콘텐츠와 매장에 집중되어 있으며, 중국 관광객의 의사결정 경로
            (디엔핑·샤오홍슈)에서 노출과 매장 진입 동기 부여가 부족한 상태입니다.
            본 제안서는 이 격차를 단계적으로 해소하는 구조를 제시합니다.
          </Text>
        </View>

        {/* 시장 데이터 카드 — 왜 디엔핑/샤오홍슈인가 */}
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
            <DataCard
              big="509만"
              label="2025 방한 중국 관광객"
              note="한국관광공사"
            />
            <DataCard
              big="70%"
              label="디엔핑 사용률"
              note="중국 관광객 의사결정"
              highlight
            />
            <DataCard
              big="3억+"
              label="샤오홍슈 월 활성 이용자"
              note="뷰티 검색 1위 플랫폼"
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>TWW 중국 마케팅 제안서  ·  PURPLEPEPPER co., Ltd.</Text>
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
