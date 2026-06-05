// 마산게낙찜 제안서 2페이지 — 단계 전략 개요 + Phase 1 상세
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, colors, fontSize, spacing } from "../styles";
import { BackgroundImage } from "../BackgroundImage";

export function PdfMasanPage2() {
  return (
    <Page size="A4" style={styles.page}>
      <BackgroundImage />
      <View style={styles.pageInner}>
        {/* 섹션 2. 단계 전략 개요 */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionBar} />
          <Text style={styles.sectionTitle}>2. 단계 전략 개요</Text>
        </View>

        {/* 표 */}
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
            <Text
              style={[
                styles.tableCell,
                { flex: 1.2, fontWeight: 700, color: colors.primary },
              ]}
            >
              구분
            </Text>
            <Text
              style={[
                styles.tableCell,
                { flex: 2.5, fontWeight: 700, color: colors.primary },
              ]}
            >
              목표
            </Text>
            <Text
              style={[
                styles.tableCell,
                { flex: 2, fontWeight: 700, color: colors.primary },
              ]}
            >
              주요 채널
            </Text>
          </View>
          <TableRow
            label="Phase 1"
            sub="0–3개월"
            goal="중국 관광객의 매장 전환 (방문·구매)"
            channel="따종디엔핑 · 샤오홍슈 KOC"
            highlight
          />
          <TableRow
            label="Phase 2"
            sub="3–6개월"
            goal="샤오홍슈 브랜드 자산화"
            channel="샤오홍슈 SEO · 공식 콘텐츠"
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
          원칙: Phase 1의 매장 전환 지표가 검증된 후 Phase 2(자산화)로 이행합니다.
          순차 집행으로 예산 효율과 학습의 누적을 확보합니다.
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
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
          </View>
          <View style={{ marginTop: 6 }}>
            <Bullet text='타겟 키워드: "해운대 게장" · "부산 간장게장 맛집" · "해운대 해산물 맛집"' />
            <Bullet text="평점 · 리뷰 관리 집중 (경쟁 극심 지역 — 평점이 선택을 좌우)" />
            <Bullet text="메뉴 사진 · 위치 · 영업시간 · 길찾기 정비" />
            <Bullet text="디엔핑 쿠폰 혜택 설정으로 방문 동기 부여" />
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
            <Bullet text="예산 배분: KOC(마이크로) 90% · KOL(메가) 10%" />
            <Bullet text='타겟 키워드: "부산 해운대 맛집" · "해운대 가면 먹어야 할 게장" · "부산 자유여행 맛집"' />
            <Bullet text="콘텐츠 현지화: KOC에게 기본 가이드 전달 (메뉴 · 먹는 법 · 위치). 자율 콘텐츠 특성상 100% 반영 보장 X" />
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
            <Bullet text="따종디엔핑: 조회수 · 길찾기 클릭 · 쿠폰 사용 · 평점 변화" />
            <Bullet text="샤오홍슈: 저장 · 공유 · 좋아요율 (저장 · 공유 우선 지표)" />
            <Bullet
              text="최종 지표: 매장 방문 건수 · 중국 고객 매장 매출"
              accent
            />
          </View>
        </View>

        {/* Phase 1 액션 타임라인 */}
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
            <TimelineStep
              month="0–1개월"
              title="셋업"
              body="디엔핑 매장 등록 · 키워드 · 평점 베이스라인. KOC 시딩 풀 구성."
            />
            <TimelineStep
              month="1–2개월"
              title="집행"
              body="KOC 시딩 본격 집행. 디엔핑 쿠폰 · CPC 광고 · 리뷰 관리 동시 운영."
              highlight
            />
            <TimelineStep
              month="2–3개월"
              title="검증"
              body="평점 변화 · 매장 방문 데이터 점검. Phase 2 이행 여부 합의."
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>마산게낙찜·해마끼 간장게장 중국 마케팅 제안서  ·  PURPLEPEPPER co., Ltd.</Text>
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
      <Text
        style={{
          flex: 2.5,
          fontSize: fontSize.sm,
          paddingHorizontal: 8,
          color: colors.text,
          lineHeight: 1.4,
        }}
      >
        {goal}
      </Text>
      <Text
        style={{
          flex: 2,
          fontSize: fontSize.sm,
          paddingHorizontal: 8,
          color: colors.textMuted,
          lineHeight: 1.4,
        }}
      >
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
      <Text
        style={{
          fontSize: fontSize.md,
          fontWeight: 700,
          color: colors.text,
          marginTop: 4,
          lineHeight: 1.2,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: fontSize.xs,
          color: colors.textMuted,
          marginTop: 4,
          lineHeight: 1.5,
        }}
      >
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
