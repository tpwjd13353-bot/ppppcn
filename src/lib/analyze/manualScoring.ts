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
   · 화장품/뷰티/의료/웰니스: 강함
   · 음식점/카페: 위치·메뉴 의존도 높음
   · 패션/잡화/기타: 중간

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
