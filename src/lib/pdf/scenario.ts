// 점수 결과 → 시나리오 분기 (1·3페이지 카피용)

import type { AnalysisResult } from "@/lib/types/scoring";

export type Scenario = "gapBig" | "normal" | "weak" | "menuFail" | "fallback";

export function pickScenario(result: AnalysisResult): Scenario {
  const { store, marketing, details } = result;
  const { region, menu } = details;

  if (region.match.tier === "폴백") return "fallback";
  if (menu.matches.length > 0 && menu.matchedCount === 0) return "menuFail";
  if (store.score >= 80 && marketing.score <= 30) return "gapBig";
  if (store.score >= 60) return "normal";
  return "weak";
}

// ===================
// 1페이지 결론 박스 (개인화 변수 적용)
// ===================

export interface Page1Conclusion {
  headline: string;
  body: string;
  showLoss: boolean;
}

interface Page1Context {
  placeName: string;
  sigungu: string | null;
}

export function page1Conclusion(
  scenario: Scenario,
  ctx: Page1Context,
): Page1Conclusion {
  const place = ctx.placeName || "사장님의 매장";
  const channelLine =
    "다만 중국인 관광객에게 노출할 채널이 부족합니다\n(따종디엔핑 · 샤오홍슈 · 도우인 등 중국 핵심 플랫폼)";

  switch (scenario) {
    case "gapBig":
      return {
        headline: `${place}, 입지와 메뉴는 잘 갖춰져 있습니다.`,
        body: `${channelLine}\n이 격차가 매월 잠재 매출 손실로 이어지고 있습니다.`,
        showLoss: true,
      };
    case "normal":
      return {
        headline: `${place}, 기본 조건은 갖춰져 있습니다.`,
        body: `${channelLine}\n채널만 정비해도 매출 전환률을 크게 개선할 수 있는 단계입니다.`,
        showLoss: true,
      };
    case "weak":
      return {
        headline: `${place}, 입지·메뉴 조건이 다소 약한 편입니다.`,
        body: `${channelLine}\n타깃 세분화와 핫스팟 진입으로 경쟁 가게보다 빠르게 격차를 좁힐 수 있습니다.`,
        showLoss: true,
      };
    case "menuFail":
      return {
        headline: `${place}의 메뉴가 일반 DB에 없는 특수 메뉴로 분류됩니다.`,
        body: "정확한 진단을 위해 메뉴를 직접 입력하시거나\n전문가 분석을 받으시기를 권장드립니다.",
        showLoss: false,
      };
    case "fallback":
      return {
        headline: `${place}의 주소 인식이 어려워 정밀 분석이 필요합니다.`,
        body: "정확한 상권 분석을 위해\n무료 컨설팅을 권장드립니다.",
        showLoss: false,
      };
  }
}

/** 손실 박스 헤딩 — 시군구 개인화 */
export function lossBoxHeading(sigungu: string | null): string {
  if (sigungu) {
    return `${sigungu}에서 매년 놓치고 있는 매출  (보수적 추정)`;
  }
  return "연 잠재 매출 손실  (보수적 추정)";
}

// ===================
// 2페이지 한 줄 결론 (격차 막대 아래)
// ===================

export function page2GapLine(scenario: Scenario): string {
  switch (scenario) {
    case "gapBig":
      return '입지와 메뉴는 충분합니다. 다만 중국인이 이 매장을 "찾을 방법"이 없을 뿐입니다.';
    case "normal":
      return "진입 기반은 형성돼 있습니다. 마케팅 점수만 끌어올리면 매출 전환이 가속됩니다.";
    case "weak":
      return "입지·메뉴 조건 개선과 중국 마케팅 동시 전개로 격차를 단계적으로 좁힐 수 있습니다.";
    case "menuFail":
      return "메뉴 분석이 보강되면 정확한 격차 진단이 가능합니다.";
    case "fallback":
      return "정밀 상권 진단으로 격차의 실체를 파악하실 수 있습니다.";
  }
}

// ===================
// 3페이지 단계 진단 박스
// ===================

export interface Page3Stage {
  label: string;
  body: string;
}

export function page3Stage(scenario: Scenario): Page3Stage {
  switch (scenario) {
    case "gapBig":
      return {
        label: "노출 부재 단계",
        body: '입지와 메뉴는 갖춰져 있습니다.\n다만 중국 관광객이 사장님의 매장을 "발견할 경로"가 비어 있는 상태입니다.\n\n디엔핑·샤오홍슈 미등록 = 사용률 70% 시장에서 사실상 존재하지 않는 매장입니다.',
      };
    case "normal":
      return {
        label: "노출·변환 모두 부재 단계",
        body: "기본 조건은 갖춰져 있으나, 노출 채널과 메뉴 매력도 양쪽에서 보완이 필요한 상태입니다.\n\n채널 등록만으로는 부족하고, 등록 + 메뉴 어필 + 콘텐츠를 함께 진행하는 단계적 접근이 효과적입니다.",
      };
    case "weak":
      return {
        label: "기반 정비 필요 단계",
        body: "입지·메뉴 조건이 다소 약한 편이라 무작정 광고를 집행하면 ROI가 떨어질 수 있습니다.\n\n타깃 명확화 + 차별화 포인트 발굴 + 단계적 광고로 효율을 높이는 전략을 권장드립니다.",
      };
    case "menuFail":
      return {
        label: "메뉴 분석 보강 필요",
        body: "사장님 매장 메뉴가 일반 DB에 없는 특수 메뉴입니다.\n전문가 컨설팅을 통해 정확한 메뉴별 점수와 전략을 받아보시는 것을 권장드립니다.",
      };
    case "fallback":
      return {
        label: "상권 정밀 분석 필요",
        body: "주소 자동 인식이 어려워 디지털 분석 한계가 있습니다.\n무료 컨설팅으로 사장님 매장 정확한 상권 진단을 받아보세요.",
      };
  }
}
