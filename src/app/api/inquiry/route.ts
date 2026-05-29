import { readJson, writeJson } from "@/lib/storage";
import { notifyNewInquiry } from "@/lib/notify";
import type { Inquiry, InquiryData } from "@/lib/inquiry";

const FALLBACK_PASSWORD = "ddj2026";

export async function POST(req: Request) {
  let body: Partial<Inquiry>;
  try {
    body = (await req.json()) as Partial<Inquiry>;
  } catch {
    return Response.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });
  }

  const business = (body.business ?? "").trim();
  const contact = (body.contact ?? "").trim();
  if (!business || !contact) {
    return Response.json({ ok: false, error: "상호명과 연락처는 필수입니다." });
  }

  const entry: Inquiry = {
    id: `inq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    business,
    contact,
    industry: (body.industry ?? "").trim(),
    region: (body.region ?? "").trim(),
    budget: (body.budget ?? "").trim(),
    message: (body.message ?? "").trim(),
  };

  const data = await readJson<InquiryData>("inquiries.json", { inquiries: [] });
  data.inquiries.unshift(entry);
  await writeJson("inquiries.json", data);

  // 새 문의 알림 (텔레그램/이메일 등 — 환경변수 설정 시에만 동작)
  notifyNewInquiry(entry).catch(() => {});

  return Response.json({ ok: true });
}

export async function GET(req: Request) {
  const pw = req.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? FALLBACK_PASSWORD;
  if (pw !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }
  const data = await readJson<InquiryData>("inquiries.json", { inquiries: [] });
  return Response.json(data);
}
