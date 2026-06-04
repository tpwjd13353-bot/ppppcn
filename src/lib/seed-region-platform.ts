// 부팅 시 region_insight + platform_playbook 기본 데이터 seed.
// 환경변수 SEED_REGION_PLATFORM=true 일 때만 실행. 멱등 (upsert).
//
// 새 지역·플랫폼 추가는 이 파일을 수정하거나 별도 INSERT 명령으로.

import { eq } from "drizzle-orm";

export async function seedRegionPlatform(): Promise<void> {
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  if (process.env.SEED_REGION_PLATFORM !== "true") return;

  const { db, schema } = await import("./db");

  // ===== platform_playbook =====
  const platforms = [
    {
      platformKey: "xhs",
      nameKo: "샤오홍슈",
      nameCn: "小红书",
      roleTag: "발견·바이럴",
      icon: "📕",
      descTemplate:
        "{{top_menus}}은(는) 샤오홍슈 음식 탭에서 검색량이 높은 카테고리로 관측됩니다. 비주얼 노트(조리 과정 + 동작 컷 + 완성품)가 자주 노출되는 구조로 알려져 있으며, '중국어 음식 키워드 + 지역명' 해시태그 조합이 검색 노출에 영향을 줍니다.",
      lockedTeaser:
        "매장 맞춤 노트 키워드와 업로드 주기는 전체 보고서에서 확인하실 수 있습니다.",
      sortOrder: 1,
    },
    {
      platformKey: "dzdp",
      nameKo: "따종디엔핑",
      nameCn: "大众点评",
      roleTag: "전환·방문",
      icon: "⭐",
      descTemplate:
        "{{top_menus}}은(는) 따종디엔핑에서 검색 가능성이 높은 인기 메뉴군으로 분류됩니다. 대표 이미지 3장(메뉴 정면샷·단체석 풀샷·세트 구성)과 별점 응대가 검색 노출 순위에 영향을 주는 구조로 관측됩니다.",
      lockedTeaser:
        "메뉴 노출 우선순위와 세트 설계안은 전체 보고서에서 확인하실 수 있습니다.",
      sortOrder: 2,
    },
    {
      platformKey: "douyin",
      nameKo: "도우인",
      nameCn: "抖音",
      roleTag: "확산·도달",
      icon: "🎬",
      descTemplate:
        "{{top_menus}}은(는) 도우인 음식 카테고리에서 영상 후킹이 강한 메뉴로 알려져 있습니다. 조리 과정의 시각·청각 요소가 강한 15초 영상이 추천 알고리즘에 잡히기 좋은 구조로 관측되며, 첫 1초 자막 노출이 영향을 줍니다.",
      lockedTeaser:
        "영상 후킹 스크립트와 게시 타이밍은 전체 보고서에서 확인하실 수 있습니다.",
      sortOrder: 3,
    },
  ];

  for (const p of platforms) {
    const existing = await db
      .select({ k: schema.platformPlaybook.platformKey })
      .from(schema.platformPlaybook)
      .where(eq(schema.platformPlaybook.platformKey, p.platformKey))
      .limit(1);
    if (existing.length > 0) {
      await db
        .update(schema.platformPlaybook)
        .set(p)
        .where(eq(schema.platformPlaybook.platformKey, p.platformKey));
    } else {
      await db.insert(schema.platformPlaybook).values(p);
    }
  }
  console.log(`[seed] platform_playbook: ${platforms.length} rows upserted`);

  // ===== region_insight: 안산 단원구 =====
  // 거주/상권/월별추이는 UI에서 제거 또는 자동 계산. 식별 + 권역 연간 방문 추정만 핵심.
  const ansan = {
    regionCode: "경기도|안산시 단원구",
    regionName: "안산 단원구",
    inboundTotal: 5_530_000,
    inboundYoy: "+15.4%",
    regionAnnualVisitors: 410_000,
    isEstimate: true,
    sourceLabel: "한국관광공사 · 권역 분배는 자체 추정",
    peakNote:
      "성수기는 5월·8월·10월(국경절) 구간으로 관측됩니다. 6월 무비자 만료 시점 이전 등록을 마치면 하반기 8월·10월 피크 기간 노출에 도움이 될 수 있습니다.",
  };

  const existingRegion = await db
    .select({ k: schema.regionInsights.regionCode })
    .from(schema.regionInsights)
    .where(eq(schema.regionInsights.regionCode, ansan.regionCode))
    .limit(1);
  if (existingRegion.length > 0) {
    await db
      .update(schema.regionInsights)
      .set({ ...ansan, updatedAt: new Date() })
      .where(eq(schema.regionInsights.regionCode, ansan.regionCode));
  } else {
    await db.insert(schema.regionInsights).values(ansan);
  }
  console.log(`[seed] region_insight: ${ansan.regionName} upserted`);
}
