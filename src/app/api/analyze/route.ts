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
import { generateAiPlaybook } from "@/lib/analyze/aiPlaybook";
import { lookupRegionInsight } from "@/lib/analyze/regionInsightLookup";
import { lookupLossFromReport } from "@/lib/analyze/lossLookup";
import { extractViralMenus } from "@/lib/analyze/viralMenus";
import {
  generateManualMenuScore,
  MANUAL_CATEGORY_LABEL,
  type ManualCategory,
} from "@/lib/analyze/manualScoring";
import type { NaverPlaceData } from "@/lib/analyze/naver";

interface ManualBody {
  mode: "manual";
  placeName?: string;
  address: string;
  category: ManualCategory;
  services?: string;
}

interface UrlBody {
  mode?: "url";
  url: string;
}

type AnalyzeBody = ManualBody | UrlBody;

export async function POST(req: Request) {
  let body: Partial<AnalyzeBody>;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { ok: false, error: "잘못된 요청입니다." },
      { status: 400 },
    );
  }

  const mode = body.mode === "manual" ? "manual" : "url";

  if (mode === "url") {
    const url = ((body as UrlBody).url ?? "").trim();
    if (!url) {
      return Response.json(
        { ok: false, error: "네이버 플레이스 URL을 입력해주세요." },
        { status: 400 },
      );
    }
  } else {
    const m = body as ManualBody;
    if (!m.address?.trim() || !m.category) {
      return Response.json(
        { ok: false, error: "주소와 카테고리는 필수입니다." },
        { status: 400 },
      );
    }
    if (!MANUAL_CATEGORY_LABEL[m.category]) {
      return Response.json(
        { ok: false, error: "지원하지 않는 카테고리입니다." },
        { status: 400 },
      );
    }
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

  // 플레이스 데이터 — URL이면 크롤링, manual이면 합성
  let place: NaverPlaceData;
  let manualScoreNote: string | null = null;

  if (mode === "url") {
    const url = (body as UrlBody).url.trim();
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
  } else {
    const m = body as ManualBody;
    const servicesText = m.services?.trim() || "";
    const servicesList = servicesText
      ? servicesText
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];
    const ai = await generateManualMenuScore({
      placeName: m.placeName?.trim() || undefined,
      address: m.address.trim(),
      category: m.category,
      services: servicesText || undefined,
    });
    manualScoreNote = ai.reason;
    place = {
      placeId: `manual-${Date.now()}`,
      name: m.placeName?.trim() || "수기 입력 매장",
      address: m.address.trim(),
      roadAddress: m.address.trim(),
      category: MANUAL_CATEGORY_LABEL[m.category],
      menus: [],
      sourceUrl: "",
      partial: true,
      notes: [
        "수기 입력 — 네이버 플레이스 URL 없이 주소·카테고리·서비스/상품으로 분석.",
        `AI 종합 적합성 점수: ${ai.score} (${ai.model})`,
        ai.reason,
        ...(servicesList.length > 0 ? [`입력 서비스/상품 ${servicesList.length}건: ${servicesList.join(" / ")}`] : []),
      ],
    };
    // 합성 데이터에 AI 점수·서비스 일단 저장 (아래 result 갱신·플레이북에서 사용)
    (place as NaverPlaceData & { _aiScore?: number; _services?: string[] })._aiScore = ai.score;
    (place as NaverPlaceData & { _aiScore?: number; _services?: string[] })._services = servicesList;
  }

  // 기본 점수 계산
  const result = analyzeStore(place.address, place.roadAddress, place.menus);

  // manual 모드면 메뉴 점수 자리에 AI 점수 주입
  if (mode === "manual") {
    const aiScore = (place as NaverPlaceData & { _aiScore?: number })._aiScore ?? 60;
    result.details.menu = {
      ...result.details.menu,
      score: aiScore,
      needsConsultation: false,
      consultationReason: manualScoreNote ?? undefined,
    };
    const regionScore = result.details.region.score;
    const combined = Math.round((regionScore + aiScore) / 2);
    result.store = { ...result.store, score: combined };
  }

  // DB 저장
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const id = `anl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const naverUrlField =
    mode === "url" ? (body as UrlBody).url.trim() : `manual:${(body as ManualBody).category}`;
  const manualMeta =
    mode === "manual"
      ? {
          isManual: true as const,
          category: (body as ManualBody).category,
          categoryLabel: MANUAL_CATEGORY_LABEL[(body as ManualBody).category],
          aiScoreReason: manualScoreNote,
          services:
            (place as NaverPlaceData & { _services?: string[] })._services ?? [],
        }
      : { isManual: false as const };

  await db.insert(schema.analyses).values({
    id,
    userId,
    naverUrl: naverUrlField,
    placeName: place.name,
    menu: place.menus,
    scores: {
      store: result.store.score,
      marketing: result.marketing.score,
      region: result.details.region.score,
      menu: result.details.menu.score ?? -1,
    },
    totalScore: result.store.score,
    reportData: { place, result, manual: manualMeta },
  });

  await recordUsage(req, "analyze");
  const after = await checkRateLimit(req, "analyze");

  // AI 플레이북 생성 — 응답 차단해서 첫 결과 페이지 도착 시 AI 결과 노출.
  // 최대 25초 timeout. 실패해도 정적 fallback으로 결과 페이지는 정상 노출.
  try {
    const reportData = { place, result };
    const [regionRow, loss] = await Promise.all([
      lookupRegionInsight(place),
      lookupLossFromReport(reportData),
    ]);
    const region = regionRow
      ? {
          regionName: regionRow.regionName,
          regionAnnualVisitors: regionRow.regionAnnualVisitors,
        }
      : loss
        ? {
            regionName: loss.sigungu,
            regionAnnualVisitors: loss.annualChineseVisitors,
          }
        : null;
    const viral = extractViralMenus(result.details.menu.matches);
    const manualServices =
      mode === "manual"
        ? (place as NaverPlaceData & { _services?: string[] })._services ?? []
        : [];
    await Promise.race([
      generateAiPlaybook({
        analysisId: id,
        place,
        result,
        region,
        viral,
        manualServices,
      }),
      new Promise<void>((resolve) => setTimeout(resolve, 25_000)),
    ]);
  } catch (e) {
    console.error("[analyze] aiPlaybook trigger failed:", e);
  }

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
