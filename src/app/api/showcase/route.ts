import { readJson, writeJson } from "@/lib/storage";
import type { ShowcaseData } from "@/lib/showcase";

const FALLBACK_PASSWORD = "ddj2026";

export async function GET() {
  const data = await readJson<ShowcaseData>("showcase.json", { cards: [] });
  return Response.json(data);
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

  await writeJson("showcase.json", body);
  return Response.json({ ok: true });
}
