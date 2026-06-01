// 시군구 통계 기반 손실 추정
//
// 핵심 공식 (연간 추정 잠재 매출 손실):
//
//   연간 잠재 손실 ≈
//     월간 중국인 방문 × 12 × 식음료 1인 지출 × 시장 점유 가능치
//
// 변수 의미:
//   - 월간 중국인 방문: region_stats.csv 의 시군구별 추정
//   - 식음료 1인 지출: 한국관광공사 2024 외래관광객 1인 평균 지출 1,622 USD
//     중 식음료 비중 25% ≈ 약 60만 원
//   - 시장 점유 가능치: 0.05% (보수적). 사장님 가게 한 곳이 시군구 전체 중국인의
//     0.05%만 잡을 수 있다고 가정. 가게 규모·노출도에 따라 더 클 수 있음.
//
// 출력은 일부러 범위로 (최소~최대) 제공. 사장님께 "정확한 숫자"라고 주장하지 않기 위함.

import { getScoreData } from "./scoreData";

const FOODSERVICE_SPENDING_PER_VISITOR_KRW = 600_000; // 식음료 1인 평균 지출 (보수)
const MARKET_SHARE_LOW = 0.0003;  // 0.03% (낮은 추정)
const MARKET_SHARE_HIGH = 0.0008; // 0.08% (높은 추정)

export interface LossEstimate {
  sido: string;
  sigungu: string;
  monthlyChineseVisitors: number;
  annualChineseVisitors: number;
  // 연간 잠재 매출 손실 추정 (원)
  annualLossKRWLow: number;
  annualLossKRWHigh: number;
  // 표시용 — 만원 단위로 라운드
  annualLossManwonLow: number;
  annualLossManwonHigh: number;
  // 메타
  nationalRank: number;
  cardSpendShareInSido: number;
  note: string;
}

/** 시도+시군구로 손실 추정 반환. 데이터 없으면 null. */
export function estimateLoss(
  sido: string,
  sigungu: string,
): LossEstimate | null {
  const data = getScoreData();
  const stats = data.regionStatsByKey.get(`${sido}|${sigungu}`);
  if (!stats) return null;

  const annual = stats.annualChineseVisitors;
  const lowKRW =
    annual * FOODSERVICE_SPENDING_PER_VISITOR_KRW * MARKET_SHARE_LOW;
  const highKRW =
    annual * FOODSERVICE_SPENDING_PER_VISITOR_KRW * MARKET_SHARE_HIGH;

  return {
    sido: stats.sido,
    sigungu: stats.sigungu,
    monthlyChineseVisitors: stats.monthlyChineseVisitors,
    annualChineseVisitors: stats.annualChineseVisitors,
    annualLossKRWLow: Math.round(lowKRW),
    annualLossKRWHigh: Math.round(highKRW),
    annualLossManwonLow: Math.round(lowKRW / 10000),
    annualLossManwonHigh: Math.round(highKRW / 10000),
    nationalRank: stats.nationalRank,
    cardSpendShareInSido: stats.cardSpendShareInSido,
    note: stats.note,
  };
}

/** 손실 금액을 "X천만원" / "X백만원" / "X만원" 형태로 포매팅 */
export function formatLossKRW(amount: number): string {
  if (amount >= 100_000_000) {
    const eok = amount / 100_000_000;
    return `${eok.toFixed(1)}억원`;
  }
  if (amount >= 10_000_000) {
    const cheonman = Math.round(amount / 10_000_000);
    return `${cheonman}천만원`;
  }
  if (amount >= 1_000_000) {
    const baekman = Math.round(amount / 1_000_000);
    return `${baekman}백만원`;
  }
  const manwon = Math.round(amount / 10_000);
  return `${manwon.toLocaleString()}만원`;
}

/** 손실 범위 텍스트 — 보고서 카피용 */
export function formatLossRange(est: LossEstimate): string {
  return `연 ${formatLossKRW(est.annualLossKRWLow)} ~ ${formatLossKRW(est.annualLossKRWHigh)}`;
}
