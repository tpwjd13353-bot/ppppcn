// 3페이지 — 처방 / 액션 가이드
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, colors, fontSize, spacing } from "./styles";
import { page3Stage, type Scenario } from "./scenario";
import type { NaverPlaceData } from "@/lib/analyze/naver";

interface Props {
  place: NaverPlaceData;
  scenario: Scenario;
  contactKakao?: string;
  contactPhone?: string;
}

export function PdfPage3({
  place,
  scenario,
  contactKakao = "http://pf.kakao.com/_xxx",
  contactPhone = "010-XXXX-XXXX",
}: Props) {
  const stage = page3Stage(scenario);

  return (
    <Page size="A4" style={styles.page}>
      {/* 상단 */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Text
          style={{
            fontSize: fontSize.md,
            fontWeight: 700,
          }}
        >
          {place.name}
        </Text>
        <Text style={styles.pageTitle}>03 처방 / 액션 가이드</Text>
      </View>
      <View style={styles.divider} />

      {/* ===== A. 현재 단계 ===== */}
      <SectionHeader icon="🎯" title="현재 단계 진단" />
      <View
        style={[
          styles.card,
          styles.cardPrimary,
          { marginTop: spacing.md, padding: spacing.lg },
        ]}
      >
        <Text
          style={{
            fontSize: fontSize.xs,
            color: colors.primary,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          [ {stage.label} ]
        </Text>
        <Text
          style={{
            fontSize: fontSize.md,
            marginTop: spacing.sm,
            lineHeight: 1.6,
          }}
        >
          {stage.body}
        </Text>
      </View>

      <View style={{ height: spacing.lg }} />

      {/* ===== B. 우선순위 채널 ===== */}
      <SectionHeader icon="🚦" title="우선순위 채널" />
      <View
        style={{
          flexDirection: "row",
          gap: spacing.sm,
          marginTop: spacing.md,
        }}
      >
        <ChannelCard
          rank="1순위"
          name="따종디엔핑"
          badge="★ MEITUAN 본사 인증"
          bullets={[
            "사용률 70% (외식 검색 1위)",
            "본사 인증 파트너 보유",
            "등록 → 노출 14일",
            "자체 등록: 8주+",
          ]}
          tone="primary"
        />
        <ChannelCard
          rank="2순위"
          name="샤오홍슈"
          badge="MAU 3억명"
          bullets={[
            "한국 정보 탐색 1순위 SNS",
            "콘텐츠 기반 소비 70%",
            "재방문·바이럴 핵심",
          ]}
        />
        <ChannelCard
          rank="3순위"
          name="도우인 (Douyin)"
          badge="영상 콘텐츠"
          bullets={[
            "메뉴 시각 어필 핵심",
            "영상 1개당 4,000회+ 노출",
            "CPM 단가 가장 낮음",
          ]}
        />
      </View>

      <View style={{ height: spacing.lg }} />

      {/* ===== C. 첫 30일 액션 플랜 ===== */}
      <SectionHeader icon="📅" title="첫 30일 액션 플랜" />
      <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
        <WeekRow
          week="Week 1"
          title="매장 정보 등록"
          body="사진 5장 (음식·인테리어·외관)  ·  메뉴 중국어 번역  ·  영업시간·결제수단 표기"
        />
        <WeekRow
          week="Week 2"
          title="첫 콘텐츠 발행"
          body="디엔핑 매장 페이지 활성화  ·  샤오홍슈 첫 게시물  ·  후기 5건 확보"
        />
        <WeekRow
          week="Week 3"
          title="첫 캠페인 시작"
          body="디엔핑 키워드 광고  ·  월 예산 50만원~ 점진적 확대  ·  핵심 KPI: 검색 노출·진입"
        />
        <WeekRow
          week="Week 4"
          title="성과 측정 / 개선"
          body="리뷰 점수·노출·전환 분석  ·  미흡 채널 정비  ·  다음 달 예산 재조정"
        />
      </View>

      <View style={{ height: spacing.lg }} />

      {/* ===== D. 무료 상담 CTA ===== */}
      <View
        style={[
          styles.card,
          styles.cardPrimary,
          { padding: spacing.lg },
        ]}
      >
        <Text
          style={{
            fontSize: fontSize.lg,
            fontWeight: 700,
            color: colors.primary,
          }}
        >
          💬 무료 상담
        </Text>
        <Text
          style={{
            fontSize: fontSize.md,
            marginTop: spacing.sm,
            color: colors.text,
            lineHeight: 1.5,
          }}
        >
          15분이면 충분합니다. 사장님 매장에 맞는 채널·예산·시작 단계까지
          구체적으로 알려드립니다.
        </Text>

        <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
          <CTAButton
            primary
            icon="💬"
            label="카톡으로 상담 신청"
            sub="(가장 빠른 응답 · 부담 없음)"
            href={contactKakao}
          />
          <CTAButton
            icon="☎"
            label={`전화 상담  ${contactPhone}`}
            sub="(즉시 응답 · 평일 10~19시)"
            href={`tel:${contactPhone.replace(/[^0-9]/g, "")}`}
          />
        </View>

        <Text
          style={{
            fontSize: fontSize.xs,
            color: colors.textMuted,
            marginTop: spacing.md,
            paddingTop: spacing.sm,
            borderTopWidth: 0.4,
            borderTopColor: colors.primary,
            lineHeight: 1.5,
          }}
        >
          ★ 메이투안 본사 정식 인증 대행사  ·  12,400개 매장의 따종디엔핑 광고 운영 중
        </Text>
      </View>

      <View style={styles.footer}>
        <Text>퍼플페퍼 · 중국 인바운드 마케팅 공식 대행사</Text>
        <Text>3 / 3</Text>
      </View>
    </Page>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}
    >
      <Text style={{ fontSize: fontSize.md }}>{icon}</Text>
      <Text style={{ fontSize: fontSize.lg, fontWeight: 700 }}>{title}</Text>
    </View>
  );
}

function ChannelCard({
  rank,
  name,
  badge,
  bullets,
  tone,
}: {
  rank: string;
  name: string;
  badge: string;
  bullets: string[];
  tone?: "primary";
}) {
  const isPrimary = tone === "primary";
  return (
    <View
      style={[
        styles.card,
        isPrimary ? styles.cardPrimary : styles.cardSurface,
        { flex: 1, padding: spacing.md },
      ]}
    >
      <Text
        style={{
          fontSize: fontSize.xs,
          color: isPrimary ? colors.primary : colors.textMuted,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        {rank}
      </Text>
      <Text
        style={{
          fontSize: fontSize.md,
          fontWeight: 700,
          marginTop: 2,
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          fontSize: fontSize.xs,
          color: isPrimary ? colors.primary : colors.textMuted,
          marginTop: 2,
          fontWeight: 600,
        }}
      >
        {badge}
      </Text>
      <View style={{ marginTop: spacing.sm, gap: 3 }}>
        {bullets.map((b, i) => (
          <Text
            key={i}
            style={{
              fontSize: fontSize.xs,
              color: colors.text,
              lineHeight: 1.5,
            }}
          >
            ▪ {b}
          </Text>
        ))}
      </View>
    </View>
  );
}

function WeekRow({
  week,
  title,
  body,
}: {
  week: string;
  title: string;
  body: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: spacing.md,
        alignItems: "flex-start",
      }}
    >
      <Text
        style={{
          width: 60,
          fontSize: fontSize.sm,
          fontWeight: 700,
          color: colors.primary,
        }}
      >
        {week} ▶
      </Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: fontSize.md, fontWeight: 600 }}>{title}</Text>
        <Text
          style={{
            fontSize: fontSize.xs,
            color: colors.textMuted,
            marginTop: 2,
            lineHeight: 1.5,
          }}
        >
          {body}
        </Text>
      </View>
    </View>
  );
}

function CTAButton({
  icon,
  label,
  sub,
  href,
  primary,
}: {
  icon: string;
  label: string;
  sub: string;
  href: string;
  primary?: boolean;
}) {
  return (
    <View
      style={[
        styles.card,
        primary
          ? { backgroundColor: colors.primary, borderColor: colors.primary }
          : styles.cardSurface,
        { padding: spacing.md },
      ]}
    >
      <Text
        style={{
          fontSize: fontSize.md,
          fontWeight: 700,
          color: primary ? "#FFFFFF" : colors.text,
        }}
      >
        {icon}  {label}
      </Text>
      <Text
        style={{
          fontSize: fontSize.xs,
          color: primary ? "#E5DEFF" : colors.textMuted,
          marginTop: 2,
        }}
      >
        {sub}  →  {href}
      </Text>
    </View>
  );
}
