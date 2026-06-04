// 2페이지 — 상세 진단
import { Page, View, Text } from "@react-pdf/renderer";
import { styles, colors, fontSize, spacing, gradeColor } from "./styles";
import { page2GapLine, lossBoxHeading, type Scenario } from "./scenario";
import { BackgroundImage } from "./BackgroundImage";
import { Watermark } from "./Watermark";
import {
  formatLossKRW,
  type LossEstimate,
} from "@/lib/analyze/lossEstimate";
import type { AnalysisResult, MenuMatch } from "@/lib/types/scoring";
import type { NaverPlaceData } from "@/lib/analyze/naver";

interface Props {
  place: NaverPlaceData;
  result: AnalysisResult;
  scenario: Scenario;
  loss: LossEstimate | null;
}

const CATEGORY_ORDER: { key: string; label: string; score: number }[] = [
  { key: "절대선호", label: "절대선호", score: 100 },
  { key: "매우선호", label: "매우선호", score: 90 },
  { key: "선호", label: "선호", score: 80 },
  { key: "약간선호", label: "약간선호", score: 70 },
  { key: "보통(긍정)", label: "보통(긍정)", score: 60 },
  { key: "보통(중립)", label: "보통(중립)", score: 50 },
  { key: "약간비선호", label: "약간비선호", score: 40 },
  { key: "비선호", label: "비선호", score: 30 },
  { key: "매우비선호", label: "매우비선호", score: 20 },
  { key: "절대비선호", label: "절대비선호", score: 10 },
];

const TABLE_LIMIT = 6;

export function PdfPage2({ place, result, scenario, loss }: Props) {
  const { marketing, details } = result;
  const { region, menu } = details;

  const categoryCounts = new Map<string, number>();
  for (const m of menu.matches) {
    if (m.matched && m.분류) {
      categoryCounts.set(m.분류, (categoryCounts.get(m.분류) ?? 0) + 1);
    }
  }
  const maxCount = Math.max(
    1,
    ...Array.from(categoryCounts.values()),
    menu.unmatchedCount,
  );

  const tableRows = [...menu.matches]
    .sort((a, b) => {
      if (a.matched && !b.matched) return -1;
      if (!a.matched && b.matched) return 1;
      return (b.score ?? 0) - (a.score ?? 0);
    })
    .slice(0, TABLE_LIMIT);

  return (
    <Page size="A4" style={styles.page}>
      <BackgroundImage />
      <Watermark />
      <View style={styles.pageInner}>
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
            lineHeight: 1.2,
          }}
        >
          {place.name}
        </Text>
        <Text style={[styles.pageTitle, { lineHeight: 1.2 }]}>02 상세 진단</Text>
      </View>
      <View style={styles.divider} />

      {/* ===== A. 지역 분석 ===== */}
      <SectionHeader title="지역 분석" />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: spacing.xs,
        }}
      >
        <Text style={{ fontSize: fontSize.md, fontWeight: 600, lineHeight: 1.2 }}>
          {region.match.matchedName
            ? `${region.match.matchedName} (${region.match.tier})`
            : "매칭 정보 없음"}
        </Text>
        <Text
          style={{
            fontSize: fontSize.xl,
            fontWeight: 700,
            color: gradeColor(region.score),
            lineHeight: 1.2,
          }}
        >
          {region.score}점
        </Text>
      </View>

      {loss && (
        <View style={{ marginTop: spacing.sm, gap: 4 }}>
          <Bullet
            text={`전국 외국인 방문 시군구 ${loss.nationalRank}위`}
            sub="한국관광공사 2025 통계"
          />
          <Bullet
            text={`디엔핑 노출 핫스팟 ${loss.nationalRank}위`}
            sub="외국인 방문 통계 + 디엔핑 사용률 70% 기반"
          />
          <Bullet
            text={`월 중국인 방문객 ${loss.monthlyChineseVisitors.toLocaleString()}명  ·  연 ${loss.annualChineseVisitors.toLocaleString()}명`}
            sub="한국관광공사 2025"
          />
        </View>
      )}

      <View style={styles.divider} />

      {/* ===== B. 메뉴 분석 ===== */}
      <SectionHeader title="메뉴 분석" />
      <Text
        style={{
          fontSize: fontSize.sm,
          color: colors.textMuted,
          marginTop: 2,
          lineHeight: 1.4,
        }}
      >
        입력 메뉴 {menu.matches.length}개  ·  DB 매칭 {menu.matchedCount}개
        {menu.unmatchedCount > 0 && `  ·  정보부족 ${menu.unmatchedCount}개`}
      </Text>

      {/* 분류 분포 */}
      <View style={{ marginTop: spacing.sm, gap: 3 }}>
        {CATEGORY_ORDER.map(({ key, label, score }) => {
          const count = categoryCounts.get(key) ?? 0;
          if (count === 0) return null;
          return (
            <DistroBar
              key={key}
              label={label}
              count={count}
              max={maxCount}
              score={score}
              color={gradeColor(score)}
            />
          );
        })}
        {menu.unmatchedCount > 0 && (
          <DistroBar
            label="정보부족"
            count={menu.unmatchedCount}
            max={maxCount}
            color={colors.warning}
            badge="분석 보강 필요"
          />
        )}
      </View>

      {/* 매칭 표 */}
      <View style={{ marginTop: spacing.md }}>
        <View style={styles.tableHeader}>
          <Text
            style={[
              styles.tableCell,
              { flex: 2, fontWeight: 600, color: colors.textMuted },
            ]}
          >
            네이버 메뉴
          </Text>
          <Text
            style={[
              styles.tableCell,
              { flex: 2, fontWeight: 600, color: colors.textMuted },
            ]}
          >
            DB 매칭
          </Text>
          <Text
            style={[
              styles.tableCell,
              {
                flex: 0.7,
                fontWeight: 600,
                color: colors.textMuted,
                textAlign: "right",
              },
            ]}
          >
            점수
          </Text>
          <Text
            style={[
              styles.tableCell,
              { flex: 1.3, fontWeight: 600, color: colors.textMuted },
            ]}
          >
            분류
          </Text>
        </View>
        {tableRows.map((m, i) => (
          <MenuTableRow key={i} m={m} />
        ))}
        {menu.matches.length > TABLE_LIMIT && (
          <Text
            style={{
              fontSize: fontSize.xs,
              color: colors.textLight,
              textAlign: "right",
              marginTop: 4,
              lineHeight: 1.2,
            }}
          >
            ... 외 {menu.matches.length - TABLE_LIMIT}개
          </Text>
        )}
      </View>

      <View style={styles.divider} />

      {/* ===== C. 손실 격차 ===== */}
      <SectionHeader title="손실 격차" />
      <View style={{ marginTop: spacing.sm }}>
        <Bar label="상권" value={region.score} color={colors.primary} />
        <View style={{ height: 4 }} />
        <Bar label="메뉴" value={menu.score ?? 0} color={colors.primary} />
        <View style={{ height: 4 }} />
        <Bar label="마케팅" value={marketing.score} color={colors.danger} />
      </View>
      <Text
        style={{
          marginTop: spacing.sm,
          fontSize: fontSize.sm,
          color: colors.text,
          fontWeight: 600,
          lineHeight: 1.55,
        }}
      >
        ▶ {page2GapLine(scenario)}
      </Text>

      {loss && (
        <View
          style={[
            styles.card,
            styles.cardWarning,
            { marginTop: spacing.sm, padding: spacing.md },
          ]}
        >
          <Text
            style={{
              fontSize: fontSize.xs,
              color: colors.textMuted,
              letterSpacing: 0.8,
              lineHeight: 1.2,
            }}
          >
            {lossBoxHeading(loss.sigungu)}
          </Text>
          <Text
            style={{
              fontSize: fontSize.lg,
              fontWeight: 700,
              color: colors.danger,
              marginTop: 4,
              lineHeight: 1.2,
            }}
          >
            {formatLossKRW(loss.annualLossKRWLow)} ~{" "}
            {formatLossKRW(loss.annualLossKRWHigh)}
          </Text>
        </View>
      )}
      </View>{/* /pageInner */}

      <View style={styles.footer}>
        <Text>
          {place.name}  ·  상권 {region.score} / 메뉴 {menu.score ?? "?"} / 마케팅{" "}
          {marketing.score}
        </Text>
        <Text>2 / 3</Text>
      </View>
    </Page>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionBar} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function Bullet({ text, sub }: { text: string; sub?: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 6 }}>
      <Text
        style={{
          color: colors.primary,
          fontWeight: 700,
          lineHeight: 1.4,
        }}
      >
        ▪
      </Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontSize: fontSize.sm, color: colors.text, lineHeight: 1.4 }}
        >
          {text}
        </Text>
        {sub && (
          <Text
            style={{
              fontSize: fontSize.xs,
              color: colors.textLight,
              marginTop: 1,
              lineHeight: 1.3,
            }}
          >
            ↑ {sub}
          </Text>
        )}
      </View>
    </View>
  );
}

function DistroBar({
  label,
  count,
  max,
  color,
  score,
  badge,
}: {
  label: string;
  count: number;
  max: number;
  color: string;
  score?: number;
  badge?: string;
}) {
  const pct = (count / max) * 100;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Text
        style={{
          width: 62,
          fontSize: fontSize.xs,
          color: colors.textMuted,
          lineHeight: 1.2,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flex: 1,
          height: 9,
          backgroundColor: colors.surface,
          borderRadius: 1,
        }}
      >
        <View
          style={{
            width: `${pct}%`,
            height: 9,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      </View>
      <Text
        style={{
          width: 26,
          fontSize: fontSize.xs,
          fontWeight: 700,
          textAlign: "right",
          lineHeight: 1.2,
        }}
      >
        {count}개
      </Text>
      <Text
        style={{
          width: 32,
          fontSize: fontSize.xs,
          color: colors.textLight,
          textAlign: "right",
          lineHeight: 1.2,
        }}
      >
        {score !== undefined ? `${score}점` : ""}
      </Text>
      {badge && (
        <Text
          style={{
            fontSize: 7,
            color: colors.warning,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {badge}
        </Text>
      )}
    </View>
  );
}

function MenuTableRow({ m }: { m: MenuMatch }) {
  return (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 2, lineHeight: 1.3 }]}>
        {m.input}
      </Text>
      <Text
        style={[
          styles.tableCell,
          {
            flex: 2,
            color: m.matched ? colors.text : colors.textLight,
            lineHeight: 1.3,
          },
        ]}
      >
        {m.matched ? m.menuName : "—"}
      </Text>
      <Text
        style={[
          styles.tableCell,
          {
            flex: 0.7,
            textAlign: "right",
            fontWeight: 700,
            color: m.matched ? gradeColor(m.score ?? 0) : colors.warning,
            lineHeight: 1.3,
          },
        ]}
      >
        {m.matched ? m.score : "?"}
      </Text>
      <Text
        style={[
          styles.tableCell,
          {
            flex: 1.3,
            fontSize: fontSize.xs,
            color: m.matched ? colors.textMuted : colors.warning,
            lineHeight: 1.3,
          },
        ]}
      >
        {m.matched ? m.분류 : "정보 부족"}
      </Text>
    </View>
  );
}

function Bar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text
        style={{
          width: 48,
          fontSize: fontSize.sm,
          color: colors.textMuted,
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flex: 1,
          height: 11,
          backgroundColor: colors.surface,
          borderRadius: 2,
        }}
      >
        <View
          style={{
            width: `${pct}%`,
            height: 11,
            backgroundColor: color,
            borderRadius: 2,
          }}
        />
      </View>
      <Text
        style={{
          width: 32,
          textAlign: "right",
          fontSize: fontSize.sm,
          fontWeight: 700,
          marginLeft: spacing.sm,
          lineHeight: 1.2,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
