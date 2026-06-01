// 시군구 통계 기반 잠재 매출 손실 추정 (보수적 추정)
//
// ────────────────────────────────────────────────────────
// 공식
//   연간 잠재 매출 손실 ≈
//     연간 중국인 방문객 × 1회 식음료 객단가(6만원) × 가게 점유율
//
// 변수 근거
//   - 1회 식음료 객단가 6만원
//       · 한국 외식업 평균 1인 객단가 1.5~2만원 × 단체/일행 평균 인원(2~3명)
//       · 음료/주류 포함 1회 식사 결제 평균
//
//   - 가게 점유율 (시군구 규모별 차등) ← 사장님 입장에서 보수적
//       전국 방문 1~10위 (식당 多): 0.5% ~ 2.0%
//       전국 방문 11~25위:        1.0% ~ 3.0%
//       전국 방문 26위 이하 (식당 少): 2.0% ~ 5.0%
//
// 보수성 명시
//   - 시장점유율은 시군구 내 전체 중국인 시장에서 가게 한 곳이 차지할 수 있는
//     "최소~보수 적극 범위". 실제 잘 운영되는 가게는 이 범위를 상회할 수 있음.
//   - 객단가는 단체·가족 일행 평균. 1인 결제 기준이 아닌 1회 방문 결제 평균.
//   - 결과는 항상 범위(최소~최대)로 반환. "확정 숫자" 가 아님을 명시.
// ────────────────────────────────────────────────────────

import { getScoreData } from "./scoreData";

const PRICE_PER_VISIT_KRW = 60_000; // 1회 식음료 객단가 (한국 평균 식사 + 음료/주류)

function getMarketShareRange(nationalRank: number): [number, number] {
  if (nationalRank <= 10) return [0.005, 0.02]; // 0.5% ~ 2.0%
  if (nationalRank <= 25) return [0.01, 0.03]; // 1.0% ~ 3.0%
  return [0.02, 0.05]; // 2.0% ~ 5.0%
}

export interface LossEstimate {
  sido: string;
  sigungu: string;
  monthlyChineseVisitors: number;
  annualChineseVisitors: number;

  // 연간 잠재 매출 손실 추정 (원)
  annualLossKRWLow: number;
  annualLossKRWHigh: number;

  // 메타
  nationalRank: number;
  cardSpendShareInSido: number;
  marketSharePctLow: number;  // 적용된 점유율(%)
  marketSharePctHigh: number;
  pricePerVisitKRW: number;
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

  const [shareLow, shareHigh] = getMarketShareRange(stats.nationalRank);
  const annual = stats.annualChineseVisitors;

  const lowKRW = annual * PRICE_PER_VISIT_KRW * shareLow;
  const highKRW = annual * PRICE_PER_VISIT_KRW * shareHigh;

  return {
    sido: stats.sido,
    sigungu: stats.sigungu,
    monthlyChineseVisitors: stats.monthlyChineseVisitors,
    annualChineseVisitors: stats.annualChineseVisitors,
    annualLossKRWLow: Math.round(lowKRW),
    annualLossKRWHigh: Math.round(highKRW),
    nationalRank: stats.nationalRank,
    cardSpendShareInSido: stats.cardSpendShareInSido,
    marketSharePctLow: shareLow * 100,
    marketSharePctHigh: shareHigh * 100,
    pricePerVisitKRW: PRICE_PER_VISIT_KRW,
    note: stats.note,
  };
}

/**
 * 손실 금액을 한국어 단위로 포매팅.
 * 0.1억 단위로 반올림했을 때 1억 이상이면 "X.X억원", 그 미만은 만원 단위.
 *   예) 99,900,000 → "1.0억원" (X "9,990만원")
 *       12,300,000,000 → "123억원"
 */
export function formatLossKRW(amount: number): string {
  const eokFloat = amount / 100_000_000;
  const eokRounded = Math.round(eokFloat * 10) / 10;

  if (eokRounded >= 1.0) {
    return eokRounded >= 10
      ? `${Math.round(eokRounded)}억원`
      : `${eokRounded.toFixed(1)}억원`;
  }
  const manwon = Math.round(amount / 10_000);
  return `${manwon.toLocaleString()}만원`;
}

/** "연 X ~ Y" 형태 텍스트 */
export function formatLossRange(est: LossEstimate): string {
  return `연 ${formatLossKRW(est.annualLossKRWLow)} ~ ${formatLossKRW(est.annualLossKRWHigh)}`;
}

/**
 * 보고서·UI에서 사용할 "보수적 추정" 안내 문구.
 * 사장님에게 신뢰감 + 영업 효과 동시 확보.
 */
export const LOSS_DISCLAIMER =
  "본 손실 추정은 보수적으로 산정한 범위입니다. " +
  "한국관광공사 2025 외래관광객 통계를 기반으로 " +
  "1회 식음료 객단가와 시군구 규모별 가게 점유율을 적용했습니다. " +
  "실제 잠재 매출은 가게 노출도·메뉴 경쟁력에 따라 본 범위를 상회할 수 있습니다.";
