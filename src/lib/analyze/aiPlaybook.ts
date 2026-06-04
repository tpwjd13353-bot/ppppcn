// GPT-4o로 매장별 맞춤 플랫폼 플레이북 생성.
// /api/analyze 끝부분에서 fire-and-forget으로 호출 → DB 저장 → 결과 페이지가 그 다음 방문 시 사용.

import OpenAI from "openai";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import type { NaverPlaceData } from "@/lib/analyze/naver";
import type { AnalysisResult } from "@/lib/types/scoring";
import type { ViralExtract } from "./viralMenus";

interface PlatformSeed {
  platformKey: string;
  nameKo: string;
  nameCn: string | null;
  roleTag: string | null;
}

interface PlaybookOutput {
  weaponHeadline: string;
  weaponSubline: string;
  weaponHotMenu?: {
    label?: string;
    menuName?: string;
    score?: number;
    tagline?: string;
  };
  weaponMz?: {
    label?: string;
    lineA?: string;
    lineB?: string;
    tagline?: string;
  };
  cards: Array<{
    platformKey: string;
    desc: string;
    lockedTeaser: string;
  }>;
}

const SYSTEM_PROMPT = `당신은 한국 매장 사장님을 위한 중국 SNS 마케팅 컨설턴트입니다.
사장님이 직접 콘텐츠를 만들 때 참고할 수 있는 "콘텐츠 제작 가이드"를 작성하세요.

**중요 원칙**:
- **매장 홍보 문구가 아니라 "이렇게 만드세요" 가이드 톤**
- 광고 카피(예: "맛있는 OO를 즐겨보세요") 절대 금지
- 각 desc는 **3단 구조** 권장:
  ① 이 메뉴(카테고리)는 ~한 특성을 가지므로
  ② 이 채널에서는 ~한 식으로 노출되는 경향이 있어
  ③ ~한 콘텐츠 구성이 권장됩니다
- 채널별 특성 반영:
  · xhs(샤오홍슈): 발견·검색 채널. 비주얼 노트·해시태그 검색이 핵심. → 사진 컷 구성 2~3개 + 해시태그 조합 예시
  · dzdp(따종디엔핑): 전환·방문 결정 채널. 별점·대표사진·세트가 핵심. → 대표 이미지 구성·세트 설계·리뷰 관리
  · douyin(도우인): 짧은 영상 확산 채널. 후크와 리듬이 핵심. → 15초 영상 시간대별 흐름 + 후킹 요소
- 정중한 존댓말, 단정형 금지 (관측됩니다, 자주 노출되는 구조, 권장됩니다)
- 각 desc는 120~200자, lockedTeaser는 30~60자

**나쁜 예시 (절대 이렇게 쓰지 마세요)**:
- "OO매장의 시그니처 삼겹살은 육즙이 가득해 감동을 줍니다" ← 매장 홍보 문구 X
- "삼겹살 조리 장면을 담은 영상으로 매장의 매력을 느껴보세요" ← 사장님 가이드 아님 X
- "맛있는 순간을 공유합니다" ← 정보 없음 X

**좋은 예시 (삼겹살 매장 - 분석·근거형 B 톤)**:
- xhs desc: "「삼겹살」은 샤오홍슈 음식 탭에서 '韩式烤肉' 키워드로 검색량이 높은 카테고리로 관측됩니다. 비주얼 노트(굽는 장면 + 자르는 컷 + 한 점 집는 손)가 자주 노출되는 구조로 알려져 있으며, 중국어+지역+메뉴 3종 해시태그 조합이 노출에 영향을 줍니다."
- dzdp desc: "「삼겹살」은 디엔핑에서 '한국 정통 BBQ'로 분류되는 인기 메뉴군입니다. 대표 이미지 3장(1인분 정면샷·단체석 풀샷·세트 구성)과 별점 응대가 검색 노출에 영향을 줍니다."
- douyin desc: "「삼겹살」은 도우인 음식 카테고리에서 영상 후킹이 강한 메뉴입니다. 굽는 연기·자르는 슬로우 컷 15초 영상이 추천 알고리즘에 잡히기 좋은 구조로 알려져 있습니다."

**중요 - desc 작성 원칙 (B 톤)**:
- 메뉴명을 첫 단어로 시작 ("「삼겹살」은...")
- "관측됩니다 / 알려져 있습니다 / 영향을 줍니다" 같은 분석·추정 어미
- 채널의 검색·노출 구조 설명을 포함
- 매장 홍보 광고문구 절대 금지

**무기 블록(weaponHotMenu, weaponMz)** 가이드:
- weaponHotMenu: 매장 최고점 매칭 메뉴(절대선호 등 최상위)를 강조하는 좌측 카드
  · label: "중국인 관광객 상대로 터지는 메뉴" 같은 라벨 (수정 가능)
  · menuName: DB 매칭명 (예: "삼겹살")
  · score: 그 메뉴 점수 (정수)
  · tagline: "= 샤오홍슈에서 사진 터지는 메뉴" 같은 한 줄 (매장 카테고리에 맞게)
- weaponMz: 중국 MZ가 어떤 콘텐츠를 좋아하는지 우측 카드
  · label: "중국 MZ가 원하는 건"
  · lineA: 작은 글씨 한 줄 (예: "삼겹살의")
  · lineB: 큰 글씨 핵심 카피 (예: "노릇하게 구워지는 그 장면이 조회수가 가장 높습니다")
  · tagline: "비주얼 = 무료 바이럴 광고" 같은 한 줄

출력은 반드시 JSON 한 덩어리:
{
  "weaponHeadline": "(50자 내) 매장 카테고리에 맞는 무기 블록 헤더 (예: '삼겹살 매장이 SNS에서 가진 무기')",
  "weaponSubline": "(80자 내) 보조 한 줄",
  "weaponHotMenu": {
    "label": "중국인 관광객 상대로 터지는 메뉴",
    "menuName": "삼겹살",
    "score": 100,
    "tagline": "= 도우인·샤오홍슈에서 영상 조회수가 폭발하는 메뉴"
  },
  "weaponMz": {
    "label": "중국 MZ가 원하는 건",
    "lineA": "삼겹살 그 자체가 아니라",
    "lineB": "기름이 튀고 노릇하게 구워지는 그 장면입니다",
    "tagline": "비주얼 = 무료 바이럴 광고"
  },
  "cards": [
    { "platformKey": "xhs", "desc": "...", "lockedTeaser": "..." },
    { "platformKey": "dzdp", "desc": "...", "lockedTeaser": "..." },
    { "platformKey": "douyin", "desc": "...", "lockedTeaser": "..." }
  ]
}
`;

function buildUserPrompt(
  place: NaverPlaceData,
  result: AnalysisResult,
  region: { regionName: string; regionAnnualVisitors: number | null } | null,
  viral: ViralExtract,
  platforms: PlatformSeed[],
): string {
  // 매칭된 메뉴를 DB 매칭명 기준으로 집계 (사용자 원본 메뉴명은 너무 구체적이라 일반화 어려움).
  // 분류 정보(절대선호/매우선호 등)와 함께 모델에게 전달.
  const matchedAggregated = (() => {
    type Agg = { count: number; tier?: unknown; category?: unknown };
    const map = new Map<string, Agg>();
    for (const m of result.details.menu.matches) {
      if (!m.matched) continue;
      const key = m.menuName ?? m.input;
      const prev: Agg = map.get(key) ?? { count: 0 };
      map.set(key, {
        count: prev.count + 1,
        tier: m.단계 ?? prev.tier,
        category: m.분류 ?? prev.category,
      });
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8)
      .map(([name, v]) => {
        const cat = v.category != null ? String(v.category) : "";
        const countStr = v.count > 1 ? `, ${v.count}건 매칭` : "";
        return `${name}(${cat}${countStr})`;
      })
      .join(", ");
  })();
  const matchedNames = matchedAggregated || "(없음)";
  const originalSample = result.details.menu.matches
    .filter((m) => m.matched)
    .slice(0, 5)
    .map((m) => m.input)
    .join(", ");
  const unmatchedNames = result.details.menu.matches
    .filter((m) => !m.matched)
    .slice(0, 8)
    .map((m) => m.input)
    .join(", ");
  const platformList = platforms
    .map(
      (p) =>
        `- ${p.platformKey}: ${p.nameKo}${p.nameCn ? ` (${p.nameCn})` : ""}, 역할=${p.roleTag ?? ""}`,
    )
    .join("\n");

  return `
[매장 데이터]
- 이름: ${place.name}
- 카테고리: ${place.category ?? "(미분류)"}
- 주소: ${place.roadAddress || place.address || "(주소 정보 없음)"}

[점수]
- 상권 종합: ${result.store.score} / 마케팅: ${result.marketing.score}
- 지역: ${result.details.region.score} (${result.details.region.match.matchedName ?? result.details.region.match.tier})
- 메뉴: ${result.details.menu.score ?? "—"} (매칭 ${result.details.menu.matchedCount}/${result.details.menu.matches.length})

[지역]
${region ? `- 권역명: ${region.regionName}\n- 권역 연간 방문 추정: ${region.regionAnnualVisitors?.toLocaleString() ?? "—"}명` : "- 권역 데이터 없음"}

[메뉴 — 매칭 (DB 카테고리 일반화 — 카피에 이 이름을 사용)]
${matchedNames}

[원본 메뉴명 (참고 — 카피에는 일반화된 위 카테고리 사용 권장)]
${originalSample || "(없음)"}

[메뉴 — 미매칭(시각 바이럴 자산 후보)]
${unmatchedNames || "(없음)"}
음료·디저트 자동 추출: ${viral.count}종 → 예시 "${viral.injection}"

[카피 작성 시 유의]
- 메뉴 이름은 일반화된 카테고리명(예: "삼겹살", "치킨", "짬뽕")을 사용하세요.
- 사용자 입력 원본명(예: "생고기 한접시(삼겹살&목살)700g")은 그대로 노출하지 마세요.
- 매장 카테고리·분위기를 파악해 자연스러운 마케팅 멘트로 작성하세요.

[플랫폼 카드 3종 — 각각 desc + lockedTeaser 작성]
${platformList}

위 데이터로 weaponHeadline, weaponSubline, cards 3개를 JSON으로 출력하세요.
`.trim();
}

export async function generateAiPlaybook(params: {
  analysisId: string;
  place: NaverPlaceData;
  result: AnalysisResult;
  region: { regionName: string; regionAnnualVisitors: number | null } | null;
  viral: ViralExtract;
}): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("[ai-playbook] OPENAI_API_KEY 미설정 — skip");
    return;
  }
  const platforms = await db
    .select({
      platformKey: schema.platformPlaybook.platformKey,
      nameKo: schema.platformPlaybook.nameKo,
      nameCn: schema.platformPlaybook.nameCn,
      roleTag: schema.platformPlaybook.roleTag,
    })
    .from(schema.platformPlaybook)
    .where(eq(schema.platformPlaybook.enabled, true));
  if (platforms.length === 0) return;

  const client = new OpenAI({ apiKey });

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: buildUserPrompt(
            params.place,
            params.result,
            params.region,
            params.viral,
            platforms,
          ),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return;

    const parsed = JSON.parse(content) as PlaybookOutput;
    if (!parsed.cards || !Array.isArray(parsed.cards)) return;

    await db
      .update(schema.analyses)
      .set({
        aiPlaybook: parsed,
        aiPlaybookAt: new Date(),
      })
      .where(eq(schema.analyses.id, params.analysisId));

    console.log(
      `[ai-playbook] generated for ${params.analysisId} (${params.place.name})`,
    );
  } catch (e) {
    console.error("[ai-playbook] generation failed:", e);
  }
}
