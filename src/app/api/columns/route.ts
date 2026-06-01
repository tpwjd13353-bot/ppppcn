import { readJson, writeJson } from "@/lib/storage";
import { requireAdmin } from "@/lib/admin";
import type { ColumnData } from "@/lib/column";

export async function GET() {
  const data = await readJson<ColumnData>("columns.json", { columns: [] });
  return Response.json(data);
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return new Response("Unauthorized", { status: 401 });

  let body: ColumnData;
  try {
    body = (await req.json()) as ColumnData;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body || !Array.isArray(body.columns)) {
    return new Response("Invalid data shape", { status: 400 });
  }

  await writeJson("columns.json", body);
  return Response.json({ ok: true });
}
