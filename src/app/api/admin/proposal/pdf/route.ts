// 어드민 전용 — 제안서 JSON → PDF 다운로드.
// 한글 폰트(Pretendard) 임베드, 서버사이드 렌더.

import { requireAdmin } from "@/lib/admin";
import { renderToBuffer } from "@react-pdf/renderer";
import { PdfDynamicReport } from "@/lib/pdf/dynamic/PdfDynamicReport";
import { registerPdfFonts } from "@/lib/pdf/registerFonts";
import { sanitizeProposal } from "@/lib/proposal/sanitize";
import type { ProposalData } from "@/lib/proposal/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface ReqBody {
  data?: ProposalData;
  contactName?: string;
  contactTitle?: string;
  contactPhone?: string;
  contactEmail?: string;
  fileName?: string;
}

export async function POST(req: Request) {
  const ctx = await requireAdmin();
  if (!ctx) {
    return Response.json({ ok: false, error: "어드민 권한이 필요합니다." }, { status: 403 });
  }

  let body: ReqBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (!body.data?.cover?.title) {
    return Response.json(
      { ok: false, error: "제안서 데이터가 없습니다." },
      { status: 400 },
    );
  }

  registerPdfFonts();

  const safeData = sanitizeProposal(body.data);
  const doc = PdfDynamicReport({
    data: safeData,
    contactName: body.contactName,
    contactTitle: body.contactTitle,
    contactPhone: body.contactPhone,
    contactEmail: body.contactEmail,
  });

  let buf: Buffer;
  try {
    buf = await renderToBuffer(doc);
  } catch (e) {
    console.error("[proposal/pdf] render failed:", e);
    return Response.json(
      {
        ok: false,
        error: "PDF 렌더에 실패했어요.",
        hint: e instanceof Error ? e.message : undefined,
      },
      { status: 500 },
    );
  }

  const safe = (body.fileName || `${safeData.meta.clientName || "proposal"}-china-marketing-proposal`)
    .replace(/[^\w가-힣.\-]/g, "_")
    .slice(0, 120);
  const filename = `${safe}.pdf`;

  return new Response(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "no-store",
    },
  });
}
