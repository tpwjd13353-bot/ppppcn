import { fetchPlaceData, NaverParseError } from "@/lib/analyze/naver";
import { analyzeStore } from "@/lib/scoring";

const FALLBACK_PASSWORD = "ddj2026";

function checkAdmin(req: Request): boolean {
  const pw = req.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? FALLBACK_PASSWORD;
  return pw === expected;
}

// 관리자용 미리보기 — 크롤링 + 점수 계산까지 통째로 응답
export async function POST(req: Request) {
  if (!checkAdmin(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: {
    url?: string;
    manualAddress?: string;
    manualRoadAddress?: string;
    manualMenus?: string[];
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "잘못된 요청" }, { status: 400 });
  }

  const url = (body.url ?? "").trim();

  // 1) URL 크롤링 모드
  if (url) {
    try {
      const place = await fetchPlaceData(url);
      const result = analyzeStore(place.address, place.roadAddress, place.menus);
      return Response.json({ ok: true, place, result });
    } catch (e) {
      if (e instanceof NaverParseError) {
        return Response.json(
          { ok: false, error: e.message, hint: e.hint },
          { status: 422 },
        );
      }
      return Response.json(
        { ok: false, error: e instanceof Error ? e.message : "알 수 없는 오류" },
        { status: 500 },
      );
    }
  }

  // 2) 수동 입력 모드
  if (body.manualAddress !== undefined || body.manualMenus !== undefined) {
    const result = analyzeStore(
      body.manualAddress ?? "",
      body.manualRoadAddress ?? "",
      body.manualMenus ?? [],
    );
    return Response.json({ ok: true, place: null, result });
  }

  return Response.json(
    { ok: false, error: "url 또는 manualAddress+manualMenus 중 하나 필수" },
    { status: 400 },
  );
}
