// 통합 분석 함수
//
// 사용:
//   import { analyzeStore } from "@/lib/scoring";
//   const result = analyzeStore(address, roadAddress, menus);

import { getRegionScore } from "./region";
import { getMenuScore } from "./menu";
import { getMarketingScore } from "./platform";
import { getStoreScore } from "./store";
import { generateConclusion } from "./conclusion";
import { getConsultationInfo } from "./matching-issues";
import type { AnalysisResult } from "@/lib/types/scoring";

export function analyzeStore(
  address: string,
  roadAddress: string,
  menus: string[],
): AnalysisResult {
  const region = getRegionScore(address, roadAddress);
  const menu = getMenuScore(menus);
  const marketing = getMarketingScore();
  const store = getStoreScore(region, menu);
  const conclusion = generateConclusion(store, marketing, { region, menu });
  const consultation = getConsultationInfo(region, menu, store, marketing);

  return {
    store,
    marketing,
    details: { region, menu },
    conclusion,
    consultation,
  };
}

// 개별 함수도 그대로 노출 (커스텀 조합용)
export { getRegionScore } from "./region";
export { getMenuScore } from "./menu";
export { getMarketingScore } from "./platform";
export { getStoreScore } from "./store";
export { getGrade } from "./grade";
export { generateConclusion } from "./conclusion";
export { getConsultationInfo } from "./matching-issues";
