// 매칭 실패 + 점수 격차로부터 상담 우선순위 도출
//
// 우선순위 결정:
//   - 지역 매칭 실패: high
//   - 메뉴 매칭 부족: medium (지역이 high가 아니면)
//   - 격차 큼 (>=60): medium (모두 low 일때만)
//
// recommended:
//   - 위 사유가 1개라도 있거나
//   - 마케팅 < 30 (= 항상 true, 현재 고정 15)

import type {
  RegionScore,
  MenuScore,
  StoreScore,
  MarketingScore,
  ConsultationInfo,
  ConsultationPriority,
} from "@/lib/types/scoring";

export function getConsultationInfo(
  region: RegionScore,
  menu: MenuScore,
  store: StoreScore,
  marketing: MarketingScore,
): ConsultationInfo {
  const reasons: string[] = [];
  let priority: ConsultationPriority = "low";

  if (region.needsConsultation && region.consultationReason) {
    reasons.push(region.consultationReason);
    priority = "high";
  }

  if (menu.needsConsultation && menu.consultationReason) {
    reasons.push(menu.consultationReason);
    if (priority !== "high") priority = "medium";
  }

  // 격차 크면 (영업 핵심 메시지)
  const gap = store.score - marketing.score;
  if (gap >= 60) {
    reasons.push(
      `상권 점수와 마케팅 점수의 격차가 ${gap}점입니다. 정밀 컨설팅을 권장드립니다`,
    );
    if (priority === "low") priority = "medium";
  }

  const recommended = reasons.length > 0 || marketing.score < 30;

  return { recommended, reasons, priority };
}
