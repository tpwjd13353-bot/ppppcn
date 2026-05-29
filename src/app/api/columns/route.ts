import { promises as fs } from "node:fs";
import path from "node:path";
import type { ColumnData } from "@/lib/column";

const FILE = path.join(process.cwd(), "src/data/columns.json");
const FALLBACK_PASSWORD = "ddj2026";

async function readData(): Promise<ColumnData> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as ColumnData;
  } catch {
    return { columns: [] };
  }
}

export async function GET() {
  const data = await readData();
  return Response.json(data);
}

export async function PUT(req: Request) {
  const pw = req.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? FALLBACK_PASSWORD;
  if (pw !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: ColumnData;
  try {
    body = (await req.json()) as ColumnData;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body || !Array.isArray(body.columns)) {
    return new Response("Invalid data shape", { status: 400 });
  }

  await fs.writeFile(FILE, JSON.stringify(body, null, 2), "utf-8");
  return Response.json({ ok: true });
}
