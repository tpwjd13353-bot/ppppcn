import { promises as fs } from "node:fs";
import path from "node:path";
import type { ShowcaseData } from "@/lib/showcase";

const FILE = path.join(process.cwd(), "src/data/showcase.json");
const FALLBACK_PASSWORD = "ddj2026";

async function readData(): Promise<ShowcaseData> {
  const raw = await fs.readFile(FILE, "utf-8");
  return JSON.parse(raw) as ShowcaseData;
}

export async function GET() {
  try {
    const data = await readData();
    return Response.json(data);
  } catch {
    return Response.json({ cards: [] });
  }
}

export async function PUT(req: Request) {
  const pw = req.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? FALLBACK_PASSWORD;
  if (pw !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: ShowcaseData;
  try {
    body = (await req.json()) as ShowcaseData;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!body || !Array.isArray(body.cards)) {
    return new Response("Invalid data shape", { status: 400 });
  }

  await fs.writeFile(FILE, JSON.stringify(body, null, 2), "utf-8");
  return Response.json({ ok: true });
}
