import { promises as fs } from "node:fs";
import path from "node:path";
import type { Inquiry, InquiryData } from "@/lib/inquiry";

const FILE = path.join(process.cwd(), "src/data/inquiries.json");
const FALLBACK_PASSWORD = "ddj2026";

async function readData(): Promise<InquiryData> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as InquiryData;
  } catch {
    return { inquiries: [] };
  }
}

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

  const data = await readData();
  data.inquiries.unshift(entry);
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");

  return Response.json({ ok: true });
}

export async function GET(req: Request) {
  const pw = req.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? FALLBACK_PASSWORD;
  if (pw !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }
  const data = await readData();
  return Response.json(data);
}
