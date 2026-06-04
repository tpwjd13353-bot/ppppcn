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
  cards: Array<{
    platformKey: string;
    desc: string;
    lockedTeaser: string;
  }>;
}

const SYSTEM_PROMPT = `당신은 한국에서 방한 중국 관광객을 매장으로 연결하는 마케팅 전문가입니다.
매장 분석 데이터를 보고 플랫폼별 활용 전략 카피를 한국어로 작성하세요.

원칙:
- 정중한 존댓말, 비즈니스 톤
- 단정형 금지 (보장/100%/무조건/절대 X). 추정형 사용 (관측됩니다, 가능성, 알려져 있습니다)
- 과장·위협 톤 금지
- 매장 메뉴·지역 데이터를 구체적으로 녹임 (개인화)
- 각 카드 본문 desc는 60~110자 내외, lockedTeaser는 30~60자
- 매장 정체성·미매칭 음료·지역 특성을 한 문장 안에 자연스럽게

출력은 반드시 JSON 한 덩어리:
{
  "weaponHeadline": "(50자 내) 무기 블록 상단 카피",
  "weaponSubline": "(80자 내) 그 아래 보조 한 줄",
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
  const matchedNames = result.details.menu.matches
    .filter((m) => m.matched)
    .slice(0, 8)
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

[메뉴 — 매칭]
${matchedNames || "(없음)"}

[메뉴 — 미매칭(시각 바이럴 자산 후보)]
${unmatchedNames || "(없음)"}
음료·디저트 자동 추출: ${viral.count}종 → 예시 "${viral.injection}"

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
