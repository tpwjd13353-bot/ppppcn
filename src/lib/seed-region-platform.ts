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
        '중국 MZ의 라이프스타일 검색 채널입니다. {{viral_menus}}처럼 색이 강한 음료·디저트는 샤오홍슈에서 시각 콘텐츠로 자주 노출되는 카테고리로 관측됩니다. 지역+비주얼 해시태그 조합으로 검색 노출을 만들어 갑니다.',
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
        "사진을 본 후 매장 방문 결심으로 이어지는 단계입니다. 절대선호 메뉴를 대표 이미지로 노출하고, 단체석·세트 구성으로 객단가를 운영합니다. 별점·리뷰가 검색 노출 순위에 영향을 주는 구조로 알려져 있습니다.",
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
        "짧은 영상의 도달이 크게 작동하는 채널입니다. {{viral_menus}}의 제조 과정·색 변화를 15초 안팎의 클립으로 구성하면 매장 인지도 형성에 도움이 됩니다. 거주 중국인의 지인 공유 흐름까지 고려해 콘텐츠를 설계합니다.",
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
