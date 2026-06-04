// 분석 결과(매장 주소)로 region_insight row 조회.
// region_code = "{sido}|{sigungu}" 형식.
// 주소 텍스트에서 시도·시군구 둘 다 발견되면 매칭.

import { db, schema } from "@/lib/db";
import type { NaverPlaceData } from "@/lib/analyze/naver";

export type RegionInsight = typeof schema.regionInsights.$inferSelect;

function shortenSido(sido: string): string {
  return sido.replace(/(특별자치도|특별자치시|특별시|광역시|도|특별시)$/g, "");
}

export async function lookupRegionInsight(
  place: NaverPlaceData,
): Promise<RegionInsight | null> {
  const addr = `${place.address ?? ""} ${place.roadAddress ?? ""}`;
  if (!addr.trim()) return null;

  const rows = await db.select().from(schema.regionInsights);
  for (const r of rows) {
    const parts = r.regionCode.split("|");
    if (parts.length !== 2) continue;
    const [sido, sigungu] = parts;
    const sidoShort = shortenSido(sido);
    if (
      addr.includes(sigungu) &&
      (addr.includes(sido) || (sidoShort && addr.includes(sidoShort)))
    ) {
      return r;
    }
  }
  return null;
}
