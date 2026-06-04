// 방한 중국 관광객 월별 입국 비중 (표준 패턴)
// 한국관광공사 통상 패턴 기반 — 5/8/10월 피크 구조.
// 권역 연간 방문 추정값을 받아 월별 인원수 + 상대 막대 높이(0~100)로 분배.

interface MonthlyRatio {
  month: number;
  ratio: number;
  peak?: boolean;
}

const DEFAULT_MONTHLY_RATIO: MonthlyRatio[] = [
  { month: 1, ratio: 0.044 },
  { month: 2, ratio: 0.06 },
  { month: 3, ratio: 0.055 },
  { month: 4, ratio: 0.076 },
  { month: 5, ratio: 0.094, peak: true },
  { month: 6, ratio: 0.082 },
  { month: 7, ratio: 0.085 },
  { month: 8, ratio: 0.101, peak: true },
  { month: 9, ratio: 0.079 },
  { month: 10, ratio: 0.115, peak: true },
  { month: 11, ratio: 0.074 },
  { month: 12, ratio: 0.067 },
];

export interface MonthlyTrendPoint {
  month: number;
  value: number; // 0~100 (막대 높이)
  peak?: boolean;
  persons: number; // 실제 추정 인원수
}

/**
 * 권역 연간 방문 추정값 → 월별 추이 12개 자동 생성.
 * value: max 월을 100으로 정규화한 막대 높이.
 * persons: 실제 추정 인원수 (annual × ratio).
 */
export function buildMonthlyTrend(annualVisitors: number): MonthlyTrendPoint[] {
  const persons = DEFAULT_MONTHLY_RATIO.map((r) =>
    Math.round(annualVisitors * r.ratio),
  );
  const max = Math.max(...persons, 1);
  return DEFAULT_MONTHLY_RATIO.map((r, i) => ({
    month: r.month,
    value: Math.round((persons[i] / max) * 100),
    peak: r.peak ?? false,
    persons: persons[i],
  }));
}

/** 천 단위 콤마 + "명" — 인원수 짧은 표기 */
export function formatPersons(n: number): string {
  if (n >= 10000) {
    const man = n / 10000;
    if (man >= 10) return `${Math.round(man).toLocaleString()}만명`;
    return `${man.toFixed(1)}만명`;
  }
  return `${n.toLocaleString()}명`;
}
