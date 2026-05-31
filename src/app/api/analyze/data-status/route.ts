import { getScoreData, reloadScoreData } from "@/lib/analyze/scoreData";

const FALLBACK_PASSWORD = "ddj2026";

function checkAdmin(req: Request): boolean {
  const pw = req.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? FALLBACK_PASSWORD;
  return pw === expected;
}

export async function GET(req: Request) {
  if (!checkAdmin(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const reload = url.searchParams.get("reload") === "1";
  const data = reload ? reloadScoreData() : getScoreData();

  // 키워드 평균 길이 등 간단 통계
  const totalKeywords = data.sanggwons.reduce(
    (sum, s) =>
      sum + s.dongKeywords.length + s.roadKeywords.length + s.auxKeywords.length,
    0,
  );

  return Response.json({
    ok: true,
    loadedAt: data.loadedAt,
    counts: {
      menus: data.menus.length,
      sidos: data.sidos.length,
      sigungus: data.sigungus.length,
      sanggwons: data.sanggwons.length,
      sanggwonKeywordsTotal: totalKeywords,
    },
    samples: {
      firstMenu: data.menus[0] ?? null,
      lastMenu: data.menus[data.menus.length - 1] ?? null,
      firstSido: data.sidos[0] ?? null,
      firstSigungu: data.sigungus[0] ?? null,
      firstSanggwon: data.sanggwons[0] ?? null,
    },
    indexCheck: {
      hasMenu_치킨: data.menuByName.has("치킨"),
      hasSido_서울특별시: data.sidoByName.has("서울특별시"),
      hasSanggwon_명동: data.sanggwonByName.has("명동"),
    },
  });
}
