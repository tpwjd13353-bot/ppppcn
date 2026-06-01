import { readJson, writeJson } from "@/lib/storage";
import { requireAdmin } from "@/lib/admin";
import type { ShowcaseData } from "@/lib/showcase";

export async function GET() {
  const data = await readJson<ShowcaseData>("showcase.json", { cards: [] });
  return Response.json(data);
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return new Response("Unauthorized", { status: 401 });

  let body: ShowcaseData;
  try {
    body = (await req.json()) as ShowcaseData;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body || !Array.isArray(body.cards)) {
    return new Response("Invalid data shape", { status: 400 });
  }

  await writeJson("showcase.json", body);
  return Response.json({ ok: true });
}
