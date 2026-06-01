// 메인 분석 API
//
// 흐름:
// 1) 세션 + 분석 횟수 제한 체크 (비회원 3 / 회원 5 / 어드민 ∞)
// 2) 네이버 플레이스 크롤링
// 3) 점수 계산
// 4) DB 저장
// 5) 사용 카운트 증가

import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { fetchPlaceData, NaverParseError } from "@/lib/analyze/naver";
import { analyzeStore } from "@/lib/scoring";
import {
  checkRateLimit,
  recordUsage,
  LIMITS,
} from "@/lib/analyze/rate-limit";

export async function POST(req: Request) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { ok: false, error: "잘못된 요청입니다." },
      { status: 400 },
    );
  }

  const url = (body.url ?? "").trim();
  if (!url) {
    return Response.json(
      { ok: false, error: "네이버 플레이스 URL을 입력해주세요." },
      { status: 400 },
    );
  }

  // 횟수 제한
  const limit = await checkRateLimit(req, "analyze");
  if (!limit.allowed) {
    return Response.json(
      {
        ok: false,
        error:
          limit.tier === "guest"
            ? "무료 분석 횟수를 모두 사용했어요."
            : "오늘 분석 한도를 모두 사용했어요. 내일 다시 시도해주세요.",
        hint:
          limit.tier === "guest"
            ? "회원가입하시면 하루 5회까지 이용할 수 있어요."
            : undefined,
        rateLimited: true,
        limit,
      },
      { status: 429 },
    );
  }

  // 크롤링
  let place;
  try {
    place = await fetchPlaceData(url);
  } catch (e) {
    if (e instanceof NaverParseError) {
      return Response.json(
        { ok: false, error: e.message, hint: e.hint },
        { status: 422 },
      );
    }
    return Response.json(
      {
        ok: false,
        error: "분석에 실패했어요. 잠시 후 다시 시도해주세요.",
        hint: e instanceof Error ? e.message : undefined,
      },
      { status: 500 },
    );
  }

  // 점수 계산
  const result = analyzeStore(place.address, place.roadAddress, place.menus);

  // DB 저장
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const id = `anl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await db.insert(schema.analyses).values({
    id,
    userId,
    naverUrl: url,
    placeName: place.name,
    menu: place.menus,
    scores: {
      store: result.store.score,
      marketing: result.marketing.score,
      region: result.details.region.score,
      menu: result.details.menu.score ?? -1,
    },
    totalScore: result.store.score,
    reportData: { place, result },
  });

  await recordUsage(req, "analyze");
  const after = await checkRateLimit(req, "analyze");

  return Response.json({ ok: true, id, place, result, limit: after });
}

// 남은 횟수 조회
export async function GET(req: Request) {
  const [analyze, pdf] = await Promise.all([
    checkRateLimit(req, "analyze"),
    checkRateLimit(req, "pdf"),
  ]);
  return Response.json({
    ok: true,
    limit: analyze,
    pdf,
    limits: LIMITS,
  });
}
