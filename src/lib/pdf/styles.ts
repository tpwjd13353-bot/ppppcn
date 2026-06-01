// PDF 공용 스타일 — 인쇄 친화 (밝은 배경, 절제된 컬러)

import { StyleSheet } from "@react-pdf/renderer";

export const colors = {
  bg: "#FFFFFF",
  surface: "#F7F7F8",
  surfaceMuted: "#FAFAFA",
  text: "#1A1A1F",
  textMuted: "#6B6B72",
  textLight: "#9BA0A6",
  primary: "#6B5BFF", // 퍼플페퍼 보라
  primarySoft: "#EFECFF",
  danger: "#E5484D", // 마케팅·위험
  dangerSoft: "#FCEEEE",
  warning: "#E08E1D",
  warningSoft: "#FBF4E5",
  success: "#3E9B4F",
  border: "#E5E5EA",
  borderStrong: "#D1D1D7",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
};

export const fontSize = {
  xs: 8,
  sm: 9,
  base: 10,
  md: 11,
  lg: 13,
  xl: 16,
  "2xl": 22,
  "3xl": 32,
  "4xl": 44,
};

export const styles = StyleSheet.create({
  // 페이지
  page: {
    fontFamily: "Pretendard",
    fontSize: fontSize.base,
    color: colors.text,
    backgroundColor: colors.bg,
    padding: 36,
    lineHeight: 1.5,
  },
  pageInner: {
    flex: 1,
  },

  // 타이포
  brand: {
    fontSize: fontSize.xs,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: colors.primary,
  },
  pageTitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: 600,
  },
  headline: {
    fontSize: fontSize.xl,
    fontWeight: 700,
    color: colors.text,
  },
  body: {
    fontSize: fontSize.base,
    color: colors.text,
  },
  bodyMuted: {
    fontSize: fontSize.base,
    color: colors.textMuted,
  },
  caption: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },

  // 배지
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    fontSize: fontSize.xs,
    fontWeight: 700,
    color: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  badgeDanger: {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  badgeOutline: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: 1,
    color: colors.primary,
    borderWidth: 0.6,
    borderColor: colors.primary,
  },

  // 박스
  card: {
    borderWidth: 0.6,
    borderColor: colors.border,
    borderRadius: 6,
    padding: spacing.lg,
  },
  cardSurface: {
    backgroundColor: colors.surface,
  },
  cardPrimary: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  cardDanger: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
  },
  cardWarning: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
  },

  // 점수 박스
  scoreBox: {
    flexDirection: "column",
    borderWidth: 0.6,
    borderColor: colors.border,
    borderRadius: 6,
    padding: spacing.lg,
    flex: 1,
  },
  scoreLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreLabelText: {
    fontSize: fontSize.base,
    fontWeight: 600,
    color: colors.textMuted,
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: 700,
    color: colors.text,
    lineHeight: 1.1,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  scoreSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },

  // 섹션 헤더 (좌측 컬러바 + 제목)
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionBar: {
    width: 3,
    height: 14,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 700,
    lineHeight: 1.2,
  },

  // 표
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.4,
    borderBottomColor: colors.border,
    paddingVertical: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 0.6,
    borderBottomColor: colors.borderStrong,
  },
  tableCell: {
    fontSize: fontSize.sm,
    paddingHorizontal: 8,
  },

  // 구분선
  divider: {
    height: 0.6,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },

  // 푸터
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: fontSize.xs,
    color: colors.textLight,
    borderTopWidth: 0.4,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
});

// 점수에 따른 색상
export function gradeColor(score: number): string {
  if (score >= 80) return colors.success;
  if (score >= 60) return colors.primary;
  if (score >= 40) return colors.warning;
  return colors.danger;
}

// 등급 → 색상
export function gradeBadgeColor(grade: string): string {
  if (grade === "A" || grade === "B+") return colors.success;
  if (grade === "B" || grade === "C") return colors.primary;
  if (grade === "D") return colors.warning;
  return colors.danger; // F
}
