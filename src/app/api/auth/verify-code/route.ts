// 휴대폰 SMS 인증코드 검증
//
// POST { phone, code, purpose }
//   - 코드 일치 + 미만료 + 미사용이면 ok=true
//   - 사용한 코드는 usedAt 표시해 재사용 방지
//   - 검증 성공 시에도 user 생성은 하지 않음 (그건 /signup이나 /reset 단계에서)

import { eq, and, desc, isNull, gte } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { normalizePhone } from "@/lib/sms";

export async function POST(req: Request) {
  let body: { phone?: string; code?: string; purpose?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });
  }

  const phone = normalizePhone(body.phone ?? "");
  const code = (body.code ?? "").trim();
  const purpose = body.purpose === "reset" ? "reset" : "signup";

  if (!/^010\d{8}$/.test(phone) || !/^\d{6}$/.test(code)) {
    return Response.json({ ok: false, error: "입력값이 올바르지 않아요." }, { status: 400 });
  }

  const now = new Date();
  const rows = await db
    .select()
    .from(schema.phoneCodes)
    .where(
      and(
        eq(schema.phoneCodes.phone, phone),
        eq(schema.phoneCodes.purpose, purpose),
        eq(schema.phoneCodes.code, code),
        isNull(schema.phoneCodes.usedAt),
        gte(schema.phoneCodes.expiresAt, now),
      ),
    )
    .orderBy(desc(schema.phoneCodes.createdAt))
    .limit(1);

  const row = rows[0];
  if (!row) {
    return Response.json(
      { ok: false, error: "인증번호가 일치하지 않거나 만료됐어요." },
      { status: 400 },
    );
  }

  await db
    .update(schema.phoneCodes)
    .set({ usedAt: now })
    .where(eq(schema.phoneCodes.id, row.id));

  return Response.json({ ok: true });
}
