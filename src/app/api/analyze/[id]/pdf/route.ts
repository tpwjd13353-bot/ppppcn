// PDF 다운로드 API
//
// 회원만 가능 (어드민은 무제한).
// 비회원: 401 + 로그인 유도
// 회원: 24h 3회까지
// 어드민: 무제한
//
// 흐름:
//   1) 인증 + 횟수 제한
//   2) 분석 데이터 조회
//   3) PDF 렌더링
//   4) 사용 카운트 +1
//   5) PDF 응답

import { eq } from "drizzle-orm";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import {
  checkRateLimit,
  recordUsage,
} from "@/lib/analyze/rate-limit";
import { estimateLoss } from "@/lib/analyze/lossEstimate";
import { PdfReport } from "@/lib/pdf/PdfReport";
import { registerPdfFonts } from "@/lib/pdf/registerFonts";
import type { NaverPlaceData } from "@/lib/analyze/naver";
import type { AnalysisResult } from "@/lib/types/scoring";

// 폰트 모듈 로드 시점에 1회 등록
registerPdfFonts();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // 1. 인증 — 비회원이면 거부
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      {
        ok: false,
        error: "PDF 다운로드는 회원만 가능해요.",
        hint: "카카오 로그인 후 다시 시도해주세요.",
      },
      { status: 401 },
    );
  }

  // 2. 횟수 제한 (회원 24h 3회)
  const limit = await checkRateLimit(req, "pdf");
  if (!limit.allowed) {
    return Response.json(
      {
        ok: false,
        error: "오늘 PDF 다운로드 한도를 모두 사용했어요.",
        hint: "24시간 후 자동으로 초기화됩니다.",
        rateLimited: true,
        limit,
      },
      { status: 429 },
    );
  }

  // 3. 분석 데이터 조회
  const { id } = await params;
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

  const report = row.reportData as {
    place: NaverPlaceData;
    result: AnalysisResult;
  } | null;
  if (!report?.place || !report?.result) {
    return Response.json(
      { ok: false, error: "보고서 데이터가 손상됐어요." },
      { status: 500 },
    );
  }

  // 4. 손실 추정 — 분석 결과의 매칭 정보로 시군구 추출 후 조회
  const lossLookup = await lookupLossFromReport(report);

  // 5. PDF 렌더링
  let buffer: Buffer;
  try {
    const doc = PdfReport({
      place: report.place,
      result: report.result,
      loss: lossLookup,
      analyzedAt: new Date(row.createdAt),
      reportId: row.id,
      contactKakao: process.env.CONTACT_KAKAO_URL,
      contactPhone: process.env.CONTACT_PHONE,
    });
    buffer = await renderToBuffer(doc);
  } catch (e) {
    return Response.json(
      {
        ok: false,
        error: "PDF 생성에 실패했어요.",
        hint: e instanceof Error ? e.message : undefined,
      },
      { status: 500 },
    );
  }

  // 6. 사용 카운트 증가
  await recordUsage(req, "pdf");

  // 7. PDF 다운로드 응답
  const filename = `${sanitizeFilename(report.place.name || "보고서")}_퍼플페퍼.pdf`;
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "private, no-store",
    },
  });
}

// 분석 결과에서 시도/시군구 추출 + 손실 추정 조회
async function lookupLossFromReport(report: {
  place: NaverPlaceData;
  result: AnalysisResult;
}) {
  const { region } = report.result.details;
  const tier = region.match.tier;

  const { getScoreData } = await import("@/lib/analyze/scoreData");
  const data = getScoreData();

  // 1) 주소 텍스트에서 직접 시도+시군구 매칭
  const addr = `${report.place.address ?? ""} ${report.place.roadAddress ?? ""}`;
  for (const stat of data.regionStats) {
    if (addr.includes(stat.sigungu) && addr.includes(stat.sido.slice(0, 2))) {
      return estimateLoss(stat.sido, stat.sigungu);
    }
  }

  // 2) 상권 매칭이면 상권 → 시군구 변환
  if (tier === "상권" && region.match.matchedName) {
    const sg = data.sanggwons.find((s) => s.name === region.match.matchedName);
    if (sg) return estimateLoss(sg.sido, sg.sigungu);
  }

  return null;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, "_").slice(0, 60);
}
