const FALLBACK_PASSWORD = "ddj2026";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = (await req.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return Response.json({ ok: false });
  }
  const expected = process.env.ADMIN_PASSWORD ?? FALLBACK_PASSWORD;
  return Response.json({ ok: password === expected });
}
