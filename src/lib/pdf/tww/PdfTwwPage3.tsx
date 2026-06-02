// TWW 제안서 3페이지 — Phase 2 + 콘텐츠 방향성
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, colors, fontSize, spacing } from "../styles";
import { BackgroundImage } from "../BackgroundImage";

export function PdfTwwPage3() {
  return (
    <Page size="A4" style={styles.page}>
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
            샤오홍슈 공식 계정 운영을 통해 브랜드 자산을 누적합니다. 주 3회 이상 업로드,
            뷰티 버티컬 일관성, SEO 친화적 작성(제목·앞 100자 키워드), 오리지널 콘텐츠
            비중 60% 이상을 원칙으로 합니다.
          </Text>
          <View style={{ marginTop: 8 }}>
            <Bullet text="콜드스타트: 2~3개월 (안정 진입 전 노출 변동성 존재)" />
            <Bullet text="안정화: 6개월 시점 검색 유입 · 저장 누적 안정화 목표" />
            <Bullet text="단기 폭발적 성장 약속 불가 — 정직한 타임라인 명시" />
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
            <Bullet text="검색 유입 증가율 (자연 유입 비중)" />
            <Bullet text="팔로워 수 · 저장수 누적" />
            <Bullet text="공식 콘텐츠의 평균 저장률 · 재방문 지표" />
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
          성분 기반 진정성 콘텐츠로 체험단 양산물과 차별화합니다. 아래 4축을 기준으로
          KOC(마이크로 인플루언서) 가이드와 공식 콘텐츠를 운용합니다.
        </Text>

        {/* 4축 그리드 */}
        <View
          style={{
            flexDirection: "row",
            gap: spacing.sm,
            marginTop: spacing.xs,
          }}
        >
          <ContentAxis
            pct="40%"
            label="① 성분 · 효능"
            body={`성분표 분석\n고농축 vs 저가 원료 비교\nTWW 천연 원료의 근거 제시`}
          />
          <ContentAxis
            pct="25%"
            label="② 루틴 · 사용법"
            body={`TWW 파격 루틴 튜토리얼\n카드뉴스 형태로 저장 유도\n사용 순서 · 분량 가이드`}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: spacing.sm,
            marginTop: spacing.sm,
          }}
        >
          <ContentAxis
            pct="25%"
            label="③ 방한 쇼핑 · 매장 방문"
            body={`"서울 가면 살 화장품" 리스트\n강남 매장 방문 브이로그\n쇼핑 동선 · 위치 안내`}
          />
          <ContentAxis
            pct="10%"
            label="④ 브랜드 서사"
            body={`창업자 스토리 활용\nCare Magazine 자산 연결\n빈도는 낮게 (서브 축)`}
          />
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
            <Bullet text="제목 · 앞 100자에 타겟 키워드 노출" />
            <Bullet text="커버 이미지 후크 명확화 (한 줄 카피로 클릭 유도)" />
            <Bullet text="오리지널 콘텐츠 60% 이상 유지" />
            <Bullet text="KOC 자율성 한계 명시 — 가이드 100% 반영 보장 X" />
          </View>
        </View>

        {/* 차별화 비교 — 체험단 vs TWW (한 줄 요약) */}
        <View
          style={{
            marginTop: spacing.sm,
            flexDirection: "row",
            gap: spacing.sm,
          }}
        >
          <CompareBox
            label="기존 체험단"
            items={["획일적 후기", "성분 설명 부재", "낮은 저장률"]}
            tone="muted"
          />
          <CompareBox
            label="TWW 차별화"
            items={["성분 근거 제시", "루틴 카드뉴스", "저장·공유 우선"]}
            tone="primary"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text>TWW 중국 마케팅 제안서  ·  PURPLEPEPPER co., Ltd.</Text>
        <Text>3 / 4</Text>
      </View>
    </Page>
  );
}

function ContentAxis({
  pct,
  label,
  body,
}: {
  pct: string;
  label: string;
  body: string;
}) {
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
        <Text
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: colors.primary,
            lineHeight: 1.1,
          }}
        >
          {pct}
        </Text>
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
      </View>
      <Text
        style={{
          fontSize: fontSize.xs,
          color: colors.textMuted,
          marginTop: 6,
          lineHeight: 1.55,
        }}
      >
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
            <Text
              style={{
                fontSize: fontSize.sm,
                color: accent,
                marginRight: 6,
                fontWeight: 700,
                lineHeight: 1.5,
              }}
            >
              ·
            </Text>
            <Text
              style={{
                fontSize: fontSize.xs,
                color: colors.text,
                flex: 1,
                lineHeight: 1.5,
              }}
            >
              {t}
            </Text>
          </View>
        ))}
      </View>
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
