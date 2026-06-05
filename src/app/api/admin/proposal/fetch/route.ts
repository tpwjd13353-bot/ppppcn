// 어드민 전용 — 네이버 플레이스 URL → 매장 정보 수집.
// 기존 fetchPlaceData() 재사용.

import { requireAdmin } from "@/lib/admin";
import { fetchPlaceData, NaverParseError } from "@/lib/analyze/naver";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ctx = await requireAdmin();
  if (!ctx) {
    return Response.json({ ok: false, error: "어드민 권한이 필요합니다." }, { status: 403 });
  }

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });
  }

  const url = (body.url ?? "").trim();
  if (!url) {
    return Response.json(
      { ok: false, error: "네이버 플레이스 URL을 입력해주세요." },
      { status: 400 },
    );
  }

  try {
    const place = await fetchPlaceData(url);
    return Response.json({ ok: true, place });
  } catch (e) {
    if (e instanceof NaverParseError) {
      return Response.json({ ok: false, error: e.message, hint: e.hint }, { status: 422 });
    }
    return Response.json(
      {
        ok: false,
        error: "수집에 실패했어요.",
        hint: e instanceof Error ? e.message : undefined,
      },
      { status: 500 },
    );
  }
}
