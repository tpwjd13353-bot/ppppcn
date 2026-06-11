// 수동 입력(주소·카테고리) 기반 AI 종합 점수.
//
// 네이버 플레이스 URL이 없는 오픈예정 매장용. 카테고리·주소만으로 GPT가
// "중국 관광객 시장 적합성" 점수를 0~100으로 산출하고 한 줄 이유를 함께 리턴.

import OpenAI from "openai";

export type ManualCategory =
  | "food"
  | "cafe"
  | "beauty"
  | "cosmetics"
  | "fashion"
  | "goods"
  | "wellness"
  | "pharmacy"
  | "spa"
  | "photo"
  | "eyewear"
  | "retail"
  | "experience"
  | "medical"
  | "other";

export const MANUAL_CATEGORY_LABEL: Record<ManualCategory, string> = {
  food: "음식점",
  cafe: "카페 · 디저트",
  beauty: "미용 · 헤어 · 네일",
  cosmetics: "화장품 · 뷰티",
  fashion: "패션 (의류 · 신발 · 가방)",
  goods: "잡화 · 라이프스타일",
  wellness: "건강 · 웰니스",
  pharmacy: "약국",
  spa: "마사지 · 스파",
  photo: "사진관 · 인생네컷",
  eyewear: "안경 · 아이웨어",
  retail: "편의점 · 소매",
  experience: "체험 · 액티비티",
  medical: "의료 · 성형",
  other: "기타",
};

export interface ManualScoreResult {
  /** 0~100. AI가 산출한 카테고리 적합성 점수. */
  score: number;
  /** 점수 산출 근거 (1~2줄). */
  reason: string;
  /** 산출에 사용된 모델 (감사용). */
  model: string;
}

const SYSTEM = `당신은 한국 매장의 "방한 중국 관광객 매출 적합성"을 평가하는 중국 마케팅 시니어 분석가입니다.
입력은 (1) 카테고리, (2) 주소, (3) 서비스/상품 목록(선택), (4) 상호명(선택)입니다.

평가 기준 (가중치 합 100):
- 입력된 서비스/상품의 중국 관광객 수요 적합성 (45)
   · 서비스/상품이 입력된 경우 → 이 항목이 평가의 핵심. 각 아이템이 중국 관광객/유학생/거주민 수요와 얼마나 맞는지 판단
   · 웰니스/스파/마사지/한방 → 중국 MZ의 "양생(养生)" 트렌드와 강하게 결합. 비주얼·체험형 상품일수록 높음
   · K-뷰티/한방 화장품/시술 → 본토 직판·면세 수요 강함
   · 비주얼 친화 음식/디저트/음료 → SNS 노출 강함
   · 단가가 너무 낮거나 일상 잡화 위주면 보수적으로
   · 서비스/상품이 비어있으면 카테고리만으로 보수적 추정 (60~70 사이)
- 주소 권역의 중국 관광객 집중도 (35)
   · 명동·홍대·강남·성수·해운대·제주 → 높음
   · 그 외 서울 → 중상, 광역시 핵심 상권 → 중, 그 외 → 낮음
- 카테고리 자체의 수요 강도 (20)
   · 화장품/의료/성형: 매우 강함 — 본토 직판·면세·의료관광 수요 모두 강함. 샤오홍슈 검색 상위 카테고리
   · 약국: 매우 강함 — 한국 의약품(소화제·진통제·습윤밴드·한방약 등)이 중국에서 "한국 약 꿀템"으로 SNS 확산. 면세·관광객 직매 강세
   · 사진관·인생네컷·셀프스튜디오: 매우 강함 — 샤오홍슈/도우인 폭발 카테고리. "韩国证件照·人生四宫格" 검색량 폭발
   · 마사지·스파·발마사지·찜질방: 강함 — 中 MZ "양생(养生)" 트렌드, 방한 관광 필수 코스로 자리잡음
   · 미용·헤어·네일: 강함 — K-스타일 네일·메이크업·헤어 시술 관광 수요
   · 안경·아이웨어: 강~중상 — 한국 안경 디자인·가격 경쟁력으로 본토에서 평판 좋음. 명동·홍대 매장 SNS 인기
   · 건강·웰니스(건강기능식품·영양제): 강~중상 — 中 MZ 양생 트렌드 + 면세 직판 가능, 다만 본토 인증·통관 이슈 인지
   · 카페·디저트: 강~중상 — 비주얼·SNS 친화 카테고리. 시그니처 음료/디저트가 핵심
   · 음식점: 위치·메뉴 의존도 높음 — 한식 정통/K-푸드 트렌드 메뉴면 상, 일반 식당이면 중
   · 체험·액티비티(한복·클래스): 강 — 韩服体验·K-팝 댄스·만들기 클래스가 샤오홍슈 단골 콘텐츠
   · 편의점·소매·다이소형: 중상 — 한국 라면·과자·생활용품 "쇼핑 챌린지" 트렌드. 다이소·CU·올리브영 검색 강세
   · 패션(의류·신발·가방): 중상 — K-패션 관광 수요, 단 가격대·디자인 차별성 필요
   · 잡화·라이프스타일: 중간 — K-디자인·캐릭터·문구 등 SNS 매력 있으면 강, 일상 잡화면 보수적
   · 기타: 보수적으로 평균

[중요 — 서비스/상품과 카테고리의 정합성]
- 사용자가 입력한 서비스/상품이 선택한 카테고리와 어울리지 않아도(예: 잡화 카테고리에 건강기능식품) "카테고리 불일치"로 감점하지 마세요. 사용자는 가장 가까운 카테고리를 골랐을 뿐이며, 진짜 평가 기준은 ① 서비스/상품 적합성입니다.
- 카테고리는 보조 신호로만 사용하고, ① 서비스/상품 항목에서 그 아이템의 실제 수요 강도를 우선 판단하세요.

점수 출력 가이드:
- 정보가 풍부(서비스/상품 입력O)할수록 30~95 사이 분포 가능
- 정보가 적으면(서비스/상품 입력X) 55~80 사이 보수적 분포
- "확인 필요" 표현은 사용하지 않음 (점수는 반드시 산출)

출력은 반드시 JSON: {"score": 정수 0~100, "reason": "2~4줄 한국어 존댓말 설명. 입력된 서비스/상품을 어떻게 평가했는지 구체적으로 언급"}.`;

export async function generateManualMenuScore(params: {
  placeName?: string;
  address: string;
  category: ManualCategory;
  services?: string;
}): Promise<ManualScoreResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // 키 없으면 보수적 폴백
    return {
      score: 60,
      reason: "AI 미연결 — 카테고리·권역 기반 보수적 추정치입니다.",
      model: "fallback",
    };
  }

  const client = new OpenAI({ apiKey });
  const trimmedServices = params.services?.trim();
  const userMsg = [
    `- 카테고리: ${MANUAL_CATEGORY_LABEL[params.category]}`,
    `- 주소: ${params.address}`,
    params.placeName ? `- 상호: ${params.placeName}` : "- 상호: (오픈예정 — 미정)",
    trimmedServices
      ? `- 서비스/상품:\n${trimmedServices.split(/\r?\n/).map((s) => `   · ${s.trim()}`).filter((s) => s.length > 3).join("\n")}`
      : "- 서비스/상품: (입력 없음)",
  ].join("\n");

  const model = "gpt-4o-mini";
  try {
    const completion = await client.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userMsg },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as { score?: number; reason?: string };
    const score = Math.min(100, Math.max(0, Math.round(Number(parsed.score) || 0)));
    const reason = String(parsed.reason ?? "").trim() || "AI 산출 근거 미응답";
    return { score, reason, model };
  } catch (e) {
    console.error("[manualScoring] failed:", e);
    return {
      score: 60,
      reason: "AI 호출 실패 — 보수적 평균값입니다.",
      model: `${model}/failed`,
    };
  }
}
