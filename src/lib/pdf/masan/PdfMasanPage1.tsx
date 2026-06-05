// 마산게낙찜·해마끼 간장게장 제안서 1페이지 — 표지 + 현황 진단
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, colors, fontSize, spacing } from "../styles";
import { BackgroundImage } from "../BackgroundImage";

export function PdfMasanPage1({ issuedAt }: { issuedAt: Date }) {
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
            FOR. 마산게낙찜·해마끼 간장게장
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
            해운대 게장 명가의 위치 우위를{"\n"}디엔핑·샤오홍슈 검색 우위로 전환하는 설계
          </Text>
          <Text
            style={{
              fontSize: fontSize.sm,
              color: colors.textMuted,
              marginTop: spacing.sm,
              lineHeight: 1.4,
            }}
          >
            클라이언트: 마산게낙찜·해마끼 간장게장  ·  발행일: {dateStr}  ·  PURPLEPEPPER co., Ltd.
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
            body={`해운대 핵심 동선 (해수욕장·엘시티)\n연평도 꽃게·짜지 않은 간장 양념\nKNN 방송 출연·명가 서사`}
            tone="primary"
          />
          <DiagBox
            label="현 상태"
            body={`해운대 중동 팔레드시즈 2층 운영\n간장게장·게낙찜·꽃게탕 등 전문\n택배 운영 (본토 직배송은 비현실)`}
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
            body={`해운대 게장 경쟁 극심\n디엔핑·샤오홍슈 검색 시\n경쟁 매장 대비 선택률 확보 필요`}
            tone="danger"
          />
          <DiagBox
            label="경쟁사 한계"
            body={`평점·리뷰 관리 부족 시 묻힘\n명가 서사·익힌 메뉴 미노출\n생식 거부 관광객 대응 부재`}
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
            위치 우위는 확보되어 있습니다. 핵심은 디엔핑·샤오홍슈 검색에서의 노출·평점 우위입니다.
          </Text>
          <Text
            style={{
              fontSize: fontSize.sm,
              color: colors.textMuted,
              marginTop: 6,
              lineHeight: 1.6,
            }}
          >
            해운대 핵심 동선이라는 위치 자산은 이미 보유하고 있으나, 중국 관광객이
            디엔핑·샤오홍슈로 매장을 검색하는 시점에 경쟁 게장집 대비 노출·평점 우위가 필요합니다.
            연평도 꽃게·방송 출연·명가 서사라는 차별화 자산을 진정성 콘텐츠로 풀어
            경쟁 환경에서 선택받는 구조를 제시합니다.
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
              big="해운대"
              label="부산 관광 핵심 동선"
              note="해수욕장·엘시티·호텔 밀집"
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
              note="음식·여행 검색 핵심 채널"
            />

          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>마산게낙찜·해마끼 간장게장 중국 마케팅 제안서  ·  PURPLEPEPPER co., Ltd.</Text>
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
