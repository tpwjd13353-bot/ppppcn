// 메인 분석 API
//
// 흐름:
// 1) 로그인 세션 + 쿠키/IP 기반 횟수 제한 체크
// 2) 네이버 플레이스 크롤링
// 3) 점수 계산 (analyzeStore — 상권 종합 + 마케팅 분리)
// 4) DB 저장
// 5) 사용 카운트 증가 (성공 시에만)

import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { fetchPlaceData, NaverParseError } from "@/lib/analyze/naver";
import { analyzeStore } from "@/lib/scoring";
import {
  checkRateLimit,
  recordUsage,
  FREE_LIMIT,
} from "@/lib/analyze/rate-limit";

export async function POST(req: Request) {
  // 1. 입력 파싱
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

  // 2. 세션 + 횟수 제한
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const limit = await checkRateLimit(req, userId);
  if (!limit.allowed) {
    return Response.json(
      {
        ok: false,
        error: "무료 분석 횟수를 모두 사용했어요.",
        hint: "로그인하시면 계속 이용할 수 있어요.",
        rateLimited: true,
        limit,
      },
      { status: 429 },
    );
  }

  // 3. 크롤링
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

  // 4. 점수 계산 (지번 + 도로명 각각 전달)
  const result = analyzeStore(place.address, place.roadAddress, place.menus);

  // 5. DB 저장 — totalScore는 상권 종합 점수 사용
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
      menu: result.details.menu.score,
    },
    totalScore: result.store.score,
    reportData: { place, result },
  });

  // 6. 사용 카운트 증가
  await recordUsage(req, userId);

  // 7. 응답
  const after = await checkRateLimit(req, userId);

  return Response.json({
    ok: true,
    id,
    place,
    result,
    limit: after,
  });
}

// 횟수 정보만 조회 (폼 진입 시 "X회 남음" 표시용)
export async function GET(req: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const limit = await checkRateLimit(req, userId);
  return Response.json({ ok: true, limit, free: FREE_LIMIT });
}
