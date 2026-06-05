// 어드민 전용 — 매장 정보 + LLM → 제안서 JSON.

import { requireAdmin } from "@/lib/admin";
import { generateProposal } from "@/lib/proposal/generate";
import type { NaverPlaceData } from "@/lib/analyze/naver";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const ctx = await requireAdmin();
  if (!ctx) {
    return Response.json({ ok: false, error: "어드민 권한이 필요합니다." }, { status: 403 });
  }

  let body: { place?: NaverPlaceData; useWebSearch?: boolean };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (!body.place?.name) {
    return Response.json(
      { ok: false, error: "매장 정보가 없습니다. 먼저 URL로 정보를 수집하세요." },
      { status: 400 },
    );
  }

  try {
    const { data, webUsed } = await generateProposal({
      place: body.place,
      issuedAt: new Date(),
      useWebSearch: body.useWebSearch ?? true,
    });
    return Response.json({ ok: true, data, webUsed });
  } catch (e) {
    console.error("[proposal/generate] failed:", e);
    return Response.json(
      {
        ok: false,
        error: "제안서 생성에 실패했어요.",
        hint: e instanceof Error ? e.message : undefined,
      },
      { status: 500 },
    );
  }
}
