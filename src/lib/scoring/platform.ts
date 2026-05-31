// 마케팅 점수 (중국 인바운드 플랫폼 노출)
//
// 현재 정책: 고정 15점.
// 이유: 사장님 대부분 디엔핑/샤오홍슈에 매장 등록 없음 → 영업 메시지 명확화.
// 추후 실제 플랫폼 노출 여부 점검 로직 붙일 수 있음.

import type { MarketingScore } from "@/lib/types/scoring";
import { getGrade } from "./grade";

const FIXED_SCORE = 15;

export function getMarketingScore(): MarketingScore {
  return {
    score: FIXED_SCORE,
    grade: getGrade(FIXED_SCORE),
    message:
      "중국인이 실제 사용하는 마케팅 플랫폼에 매장이 노출되어 있지 않습니다. 이 부분이 가장 큰 손실 포인트입니다.",
  };
}
