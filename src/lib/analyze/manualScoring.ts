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
  | "medical"
  | "other";

export const MANUAL_CATEGORY_LABEL: Record<ManualCategory, string> = {
  food: "음식점",
  cafe: "카페 · 디저트",
  beauty: "미용 · 헤어",
  cosmetics: "화장품 · 뷰티",
  fashion: "패션 · 잡화",
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
입력은 (1) 카테고리, (2) 주소, (3) 선택: 상호명 뿐입니다.

평가 기준 (가중치 합 100):
- 카테고리 자체의 중국 관광객 수요 강도 (40)
   · 화장품/뷰티/성형: 본토 직판 가능성 + 면세·관광 수요 모두 강함
   · 음식점: 위치·메뉴 의존도 높음 (정보 부족 시 중간값)
   · 카페/디저트: 비주얼·SNS 친화도에 좌우. 평균 중상
   · 패션/잡화: K-패션 관광 수요 일부, 본토 직판은 약함
   · 의료·미용: 의료관광 수요 강함
   · 기타: 보수적으로 평균
- 주소 권역의 중국 관광객 집중도 (35)
   · 명동·홍대·강남·성수·해운대·제주 → 높음
   · 그 외 서울 → 중상, 광역시 핵심 상권 → 중, 그 외 → 낮음
- 오픈예정 단계의 검증 불확실성 (25)
   · 정보가 적으므로 과도한 점수(>90) 또는 과도한 저점(<30) 회피
   · 60~80 사이 분포가 일반적

출력은 반드시 JSON: {"score": 정수 0~100, "reason": "1~2줄 한국어 존댓말 설명"}.
점수는 정수, 추측 금지, "확인 필요" 표현은 사용하지 않음 (점수는 반드시 산출).`;

export async function generateManualMenuScore(params: {
  placeName?: string;
  address: string;
  category: ManualCategory;
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
  const userMsg = [
    `- 카테고리: ${MANUAL_CATEGORY_LABEL[params.category]}`,
    `- 주소: ${params.address}`,
    params.placeName ? `- 상호: ${params.placeName}` : "- 상호: (오픈예정 — 미정)",
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
