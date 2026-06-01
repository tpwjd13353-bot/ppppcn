// 분석 정확도 보강 — 사용자가 직접 입력한 메뉴를 추가해 재계산
// 같은 분석 ID를 갱신 (새 분석 생성 X, 횟수 차감 X)

import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { analyzeStore } from "@/lib/scoring";
import type { NaverPlaceData } from "@/lib/analyze/naver";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: { additionalMenus?: string[] };
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { ok: false, error: "잘못된 요청입니다." },
      { status: 400 },
    );
  }

  const additional = (body.additionalMenus ?? [])
    .map((m) => (m ?? "").trim())
    .filter(Boolean);
  if (additional.length === 0) {
    return Response.json(
      { ok: false, error: "최소 한 개 이상의 메뉴를 입력해주세요." },
      { status: 400 },
    );
  }

  const rows = await db
    .select()
    .from(schema.analyses)
    .where(eq(schema.analyses.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) {
    return Response.json(
      { ok: false, error: "해당 분석을 찾을 수 없어요." },
      { status: 404 },
    );
  }

  const prevReport = row.reportData as {
    place: NaverPlaceData;
    result: unknown;
  } | null;
  const place = prevReport?.place;
  if (!place) {
    return Response.json(
      { ok: false, error: "원본 분석 데이터를 읽지 못했어요." },
      { status: 500 },
    );
  }

  // 기존 메뉴 + 새로 입력된 메뉴 합치기 (중복 제거)
  const existingMenus = row.menu ?? place.menus ?? [];
  const mergedMenus = [...existingMenus];
  for (const m of additional) {
    if (!mergedMenus.includes(m)) mergedMenus.push(m);
  }

  const result = analyzeStore(place.address, place.roadAddress, mergedMenus);

  await db
    .update(schema.analyses)
    .set({
      menu: mergedMenus,
      scores: {
        store: result.store.score,
        marketing: result.marketing.score,
        region: result.details.region.score,
        menu: result.details.menu.score ?? -1,
      },
      totalScore: result.store.score,
      reportData: { place: { ...place, menus: mergedMenus }, result },
    })
    .where(eq(schema.analyses.id, id));

  return Response.json({ ok: true, id, result });
}
