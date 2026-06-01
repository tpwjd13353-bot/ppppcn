import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";

const FALLBACK_PASSWORD = "ddj2026";

export async function GET(req: Request) {
  const pw = req.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? FALLBACK_PASSWORD;
  if (pw !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      image: schema.users.image,
      phone: schema.users.phone,
      businessName: schema.users.businessName,
      region: schema.users.region,
      industry: schema.users.industry,
      placeUrl: schema.users.placeUrl,
      createdAt: schema.users.createdAt,
    })
    .from(schema.users)
    .orderBy(desc(schema.users.createdAt));

  return Response.json({ users: rows });
}
