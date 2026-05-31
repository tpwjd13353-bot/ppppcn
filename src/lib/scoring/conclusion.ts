// 결론 메시지 자동 생성
//
// 우선순위 순서로 시나리오 매칭:
//   1) 폴백 (주소 인식 실패)
//   2) 메뉴 전부 매칭 실패
//   3) 정상 + 격차 큼 (영업 핵심)
//   4) 정상 + 보통
//   5) 약한 케이스

import type {
  RegionScore,
  MenuScore,
  StoreScore,
  MarketingScore,
} from "@/lib/types/scoring";

export function generateConclusion(
  store: StoreScore,
  marketing: MarketingScore,
  details: { region: RegionScore; menu: MenuScore },
): string {
  // 1) 폴백 케이스
  if (details.region.match.tier === "폴백") {
    return "주소 인식에 어려움이 있어 정밀 분석을 위해 전문가 상담을 권장드립니다";
  }

  // 2) 메뉴 전부 매칭 실패
  if (
    details.menu.matches.length > 0 &&
    details.menu.unmatchedCount === details.menu.matches.length
  ) {
    return "입력하신 메뉴가 일반 DB에 없는 특수 메뉴입니다. 정확한 분석을 위해 전문가 상담을 권장드립니다";
  }

  // 3) 정상 - 격차 큰 경우 (영업 핵심)
  if (store.score >= 80 && marketing.score <= 30) {
    const gap = store.score - marketing.score;
    return `좋은 입지와 메뉴를 갖추셨는데 중국 마케팅이 비어있는 상태입니다. ${gap}점의 격차가 손실로 이어지고 있습니다`;
  }

  // 4) 정상 - 보통
  if (store.score >= 60) {
    return "기본 조건은 갖춰져 있는데 마케팅 부분에서 큰 손실이 발생하고 있습니다";
  }

  // 5) 약한 케이스
  return "입지나 메뉴 조건이 다소 약한데, 중국 마케팅 전략으로 보완 가능합니다";
}
