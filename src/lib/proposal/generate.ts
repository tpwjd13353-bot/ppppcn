// 매장 정보 → LLM → 제안서 JSON 생성.
//
// OPENAI_API_KEY 환경변수 필수. 클라이언트로 절대 노출되지 않음.
// Responses API + web_search 도구로 부족한 정보(브랜드 서사·방송 출연·해외배송 등) 보강.

import OpenAI from "openai";
import type { NaverPlaceData } from "@/lib/analyze/naver";
import type { ProposalData } from "./types";

// 사용자 명시 — 그대로 시스템 프롬프트로 주입.
const SYSTEM_PROMPT = `당신은 중국 마케팅 전문 대행사의 시니어 기획자입니다. 입력된 매장 정보를 바탕으로 중국 마케팅 제안서를 작성하세요.

STEP 1 — 클라이언트 분석 (제안서 작성 전 반드시 먼저 수행)
입력된 매장 정보와 (필요 시) 상호명 웹 검색을 활용해 아래를 조사·정리하세요. 정보가 불확실하면 "확인 필요"로 표시하고 사실을 지어내지 마세요.
- 업종 자동 판별 (화장품/음식점/패션 등)
- 브랜드 분석: 포지셔닝, 카테고리, 핵심 강점, 콘텐츠 자산, 브랜드 서사
- 매장 분석: 오프라인 매장 위치, 관광객 동선 적합성, 입점/유통 현황
- 중국 시장 적합성: 해외배송 여부(본토 직판 가능성), 중국 소비자에게 통할 강점, 타겟(방한 관광객 vs 본토)
- 핵심 통증 진단: 풀어야 할 가장 큰 문제 1~2개

STEP 2 — 제안서 작성
STEP 1 분석을 근거로, 아래 구조·원칙에 맞춰 작성하세요.

작성 원칙
- 어조: 정중한 존댓말, 비즈니스 제안서 톤
- 간결·핵심 위주, 표 활용
- 분석 결과에 따라 전략·콘텐츠 축을 업종에 맞게 재설정할 것 (아래는 기본 골격)
- 과장 금지, "단기 매출 폭발" 약속 금지
- 해외배송 미운영 브랜드면 '방한 관광객 매장 전환'을 1순위로 설계

구성
1. 현황 진단 — 강점·현 상태·핵심 통증·경쟁사 한계 정리 후 "게시물 수가 아니라 관광객→매장 방문→구매 전환 설계가 필요"하다는 결론 도출.
2. 단계 전략 개요(표)
   - Phase 1 (0–3개월): 중국 관광객 매장 전환 / 채널: 따종디엔핑 + 샤오홍슈 KOC
   - Phase 2 (3–6개월): 샤오홍슈 브랜드 자산화 / 채널: 샤오홍슈 SEO·콘텐츠
   - 원칙: Phase 1 성과 검증 후 Phase 2 이행
3. Phase 1 — 중국 관광객 매장 전환 (최우선)
   - ① 따종디엔핑 매장 최적화: 매장 등록·키워드 최적화, 리뷰·평점 관리, 디엔핑 쿠폰 혜택 매장 설정으로 방문 동기 부여
   - ② 샤오홍슈 KOC 시딩: 예산 KOC 90% : KOL 10%, 매장 맞춤 타겟 키워드, 콘텐츠 현지화는 KOC에게 기본 가이드 전달 방식(100% 반영 안 될 수 있음 명시)
   - KPI: 디엔핑 조회수·길찾기 클릭·쿠폰 사용 건수 / 샤오홍슈 저장·공유·좋아요율(저장·공유 우선) / 매장 방문 건수·중국 고객 매장 매출(최종 지표)
4. Phase 2 — 브랜드 자산화 (3–6개월)
   - 샤오홍슈 공식 계정 운영(주 3회 이상, 버티컬 일관성), SEO(제목·앞 100자 키워드), 오리지널 콘텐츠 60% 이상
   - 콜드스타트 2~3개월·6개월 안정화의 정직한 타임라인 명시
   - KPI: 검색 유입 증가율, 팔로워·저장수
5. 콘텐츠 방향성 (업종 맞춤 4축, 비중 조정 가능)
   - ① 핵심 가치(성분/재료/신선도 등) 40%
   - ② 사용법·메뉴법 25%
   - ③ 여행·쇼핑 코스 연계 25% (매장 전환 직결)
   - ④ 브랜드 서사 10%
   - 공통 가이드: 제목·앞 100자 키워드, 커버 후크 명확화, 오리지널 60% 이상, KOC 자율성 한계 명시
6. 예산·운영 구조(표)
   - 따종디엔핑 매장등록·운영·광고: 11,200위안 (공식 단가, CPC 광고비 5,000위안 포함) / 청구 280만원
   - 샤오홍슈 KOC 시딩: 2만원 × 100팀 = 200만원 / 청구 220만원
   - 샤오홍슈 KOL 시딩: 인플루언서별 상이, 원고비 건별 전달·컨펌 후 집행 / 별도
   - 콘텐츠 현지화는 KOC 시딩에 포함(별도 제작비 없음) / 포함
7. 기대 효과 및 전제
   - 디엔핑 최적화·쿠폰 효과로 빠른 방문 반응 기대 가능하나, 샤오홍슈 자산화는 콜드스타트 2~3개월 필요.
   - KOC 콘텐츠는 가이드 전달 방식이라 결과물 편차 발생 가능.
   - 단기 매출 폭발은 약속 불가. 검증 가능한 단계 목표로 구성.

==========
[출력 형식 — 반드시 아래 스키마의 JSON 한 덩어리만 출력. 코드블록·설명·머리말 금지.]

{
  "cover": {
    "title": "(메인 타이틀. 줄바꿈 가능 — \\n 사용. 클라이언트 위치·강점을 반영한 한 줄 제안.)",
    "forLine": "FOR. (클라이언트 상호명 그대로)",
    "subline": "클라이언트: (상호) · 발행일: (YYYY.MM.DD) · PURPLEPEPPER co., Ltd."
  },
  "diagnosis": {
    "strength": "(강점 박스 본문 3~4줄, \\n 으로 줄바꿈)",
    "current": "(현 상태 박스 본문)",
    "pain": "(핵심 통증 박스 본문)",
    "competitor": "(경쟁사 한계 박스 본문)",
    "conclusionHeadline": "(한 줄 결론 — 게시물이 아니라 매장 방문·구매 전환 설계가 필요하다는 골조)",
    "conclusionBody": "(4~5줄 보조 설명)",
    "whyChannel": [
      { "big": "(굵은 수치/단어)", "label": "(라벨)", "note": "(짧은 부연)" },
      { "big": "(굵은 수치)", "label": "(라벨)", "note": "(부연)" },
      { "big": "(굵은 수치)", "label": "(라벨)", "note": "(부연)" }
    ]
  },
  "phaseStrategy": {
    "phase1Goal": "중국 관광객의 매장 전환 (방문·구매)",
    "phase1Channel": "따종디엔핑 · 샤오홍슈 KOC",
    "phase2Goal": "샤오홍슈 브랜드 자산화",
    "phase2Channel": "샤오홍슈 SEO · 공식 콘텐츠",
    "principle": "원칙: Phase 1의 매장 전환 지표가 검증된 후 Phase 2(자산화)로 이행합니다. 순차 집행으로 예산 효율과 학습의 누적을 확보합니다."
  },
  "phase1": {
    "dianpingBullets": ["(따종디엔핑 최적화 항목 3~4개. 매장에 맞는 타겟 키워드 포함)"],
    "kocBullets": ["(샤오홍슈 KOC 시딩 항목 3개. 예산 배분·타겟 키워드·현지화 가이드)"],
    "kpiBullets": ["(KPI 3개. 마지막은 매장 방문·매출 같은 최종 지표)"],
    "timeline": [
      { "month": "0–1개월", "title": "셋업", "body": "(매장 셋업 활동)" },
      { "month": "1–2개월", "title": "집행", "body": "(본격 집행)" },
      { "month": "2–3개월", "title": "검증", "body": "(데이터 점검·Phase 2 이행 합의)" }
    ]
  },
  "phase2": {
    "intro": "(샤오홍슈 공식 계정 운영 원칙 3~4줄)",
    "bullets": ["콜드스타트: 2~3개월", "안정화: 6개월 시점", "단기 폭발 성장 약속 불가 — 정직한 타임라인 명시"],
    "kpiBullets": ["(Phase 2 KPI 3개)"]
  },
  "content": {
    "intro": "(콘텐츠 4축 설계 의도를 한 줄로)",
    "axes": [
      { "pct": "40%", "label": "① (핵심 가치)", "body": "(3줄)" },
      { "pct": "25%", "label": "② (사용법/메뉴법)", "body": "(3줄)" },
      { "pct": "25%", "label": "③ (여행·쇼핑 코스 연계)", "body": "(3줄)" },
      { "pct": "10%", "label": "④ (브랜드 서사)", "body": "(3줄)" }
    ],
    "commonGuide": [
      "제목 · 앞 100자에 타겟 키워드 노출",
      "커버 이미지 후크 명확화 (한 줄 카피로 클릭 유도)",
      "오리지널 콘텐츠 60% 이상 유지",
      "KOC 자율성 한계 명시 — 가이드 100% 반영 보장 X"
    ],
    "compareLeftLabel": "기존 체험단",
    "compareLeft": ["획일적 후기", "(매장 강점 어필 X)", "낮은 저장률"],
    "compareRightLabel": "(클라이언트명) 차별화",
    "compareRight": ["(차별점 3개)"]
  },
  "budget": {
    "rows": [
      { "label": "따종디엔핑 매장등록 · 운영 · 광고", "sub": "CPC 광고비 5,000위안 포함 (공식 단가)", "unit": "11,200위안", "amount": "280만원" },
      { "label": "샤오홍슈 KOC(마이크로 인플루언서) 시딩", "sub": "2만원 × 100팀", "unit": "200만원", "amount": "220만원" },
      { "label": "샤오홍슈 KOL(메가 인플루언서) 시딩", "sub": "인플루언서별 상이", "unit": "원고비 건별 전달 · 컨펌 후 집행", "amount": "별도" },
      { "label": "콘텐츠 현지화", "sub": "KOC 시딩에 포함", "unit": "—", "amount": "포함" }
    ],
    "note": "※ 1위안 = 약 200원 기준 (변동 가능). VAT 포함 청구액 기준, 정산 환율은 집행 시점 재확인."
  },
  "expectation": {
    "canExpect": "(빠른 방문 반응 기대 가능 영역 — 디엔핑·쿠폰 효과 위주, 단기 매출 폭발 약속 금지)",
    "premise": "(전제 — 콜드스타트 2~3개월, KOC 편차, 단기 매출 폭발 약속 불가 명시)"
  },
  "meta": {
    "clientName": "(클라이언트 상호명)",
    "issuedAtIso": "(오늘 날짜 YYYY-MM-DD)"
  }
}

[작성 시 주의]
- 모든 필드는 한국어 존댓말. JSON 값에 큰따옴표가 필요하면 \\" 로 이스케이프.
- 줄바꿈은 \\n 으로 표기.
- "확인 필요"는 정직하게 표시할 것 — 추측 금지.
- 클라이언트 카테고리(화장품/음식점 등)에 맞춰 콘텐츠 4축과 차별화 포인트를 재설정할 것.
`;

function buildUserPrompt(place: NaverPlaceData, issuedAt: Date): string {
  const dateStr = `${issuedAt.getFullYear()}.${String(issuedAt.getMonth() + 1).padStart(2, "0")}.${String(issuedAt.getDate()).padStart(2, "0")}`;
  const isoStr = issuedAt.toISOString().slice(0, 10);

  return [
    "[수집된 매장 정보 — 네이버 플레이스 기반]",
    `- 상호: ${place.name}`,
    `- 카테고리: ${place.category || "(미확인)"}`,
    `- 주소(지번): ${place.address || "(미확인)"}`,
    `- 주소(도로명): ${place.roadAddress || "(미확인)"}`,
    `- 메뉴/상품 (상위 ${Math.min(place.menus.length, 20)}개): ${place.menus.slice(0, 20).join(", ") || "(미확인)"}`,
    `- 네이버 출처 URL: ${place.sourceUrl}`,
    "",
    "[발행]",
    `- 표지 일자 표기: ${dateStr}`,
    `- meta.issuedAtIso: ${isoStr}`,
    "",
    "위 정보가 부족한 경우 상호명으로 웹 검색을 수행해 브랜드 서사·방송 출연 이력·해외배송 여부·온라인 입점 채널 등을 보강한 뒤,",
    "STEP 1 분석 → STEP 2 제안서 작성 순서로 진행하고, 시스템 프롬프트에 명시된 JSON 스키마만 출력하세요.",
  ].join("\n");
}

function tryParseJson(text: string): ProposalData {
  // 1. 그대로 시도
  try {
    return JSON.parse(text) as ProposalData;
  } catch {
    /* fall through */
  }
  // 2. 코드블록 추출 시도
  const fence = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
  if (fence) {
    try {
      return JSON.parse(fence[1]) as ProposalData;
    } catch {
      /* fall through */
    }
  }
  // 3. 첫 { ~ 마지막 } 추출
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last > first) {
    return JSON.parse(text.slice(first, last + 1)) as ProposalData;
  }
  throw new Error("LLM 응답에서 JSON을 추출하지 못했습니다.");
}

export interface GenerateProposalParams {
  place: NaverPlaceData;
  issuedAt: Date;
  useWebSearch: boolean; // 웹 검색 도구 사용 여부
}

export async function generateProposal(
  params: GenerateProposalParams,
): Promise<{ data: ProposalData; webUsed: boolean }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY 환경변수가 설정되지 않았습니다.");
  }
  const client = new OpenAI({ apiKey });
  const userPrompt = buildUserPrompt(params.place, params.issuedAt);

  // 웹 검색을 쓰는 경우 Responses API, 아니면 Chat Completions JSON mode.
  if (params.useWebSearch) {
    try {
      const res = await client.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search" }],
        input: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      });
      const text = res.output_text ?? "";
      const data = tryParseJson(text);
      return { data, webUsed: true };
    } catch (e) {
      // 웹 검색 실패 시 폴백
      console.warn("[proposal] web_search 실패, JSON mode 폴백:", e);
    }
  }

  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    temperature: 0.5,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });
  const content = completion.choices[0]?.message?.content ?? "{}";
  const data = tryParseJson(content);
  return { data, webUsed: false };
}
