// 비밀번호 재설정 - 휴대폰 SMS 인증 기반
//
// POST { phone, password }
//   - 사전조건: phone에 대해 purpose="reset" 인증코드를 검증한 상태여야 함

import { eq, and, desc, isNotNull, gte } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, schema } from "@/lib/db";
import { normalizePhone } from "@/lib/sms";

const VERIFICATION_WINDOW_MS = 30 * 60 * 1000;

export async function POST(req: Request) {
  let body: { phone?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });
  }

  const phone = normalizePhone(body.phone ?? "");
  const password = body.password ?? "";

  if (!/^010\d{8}$/.test(phone)) {
    return Response.json({ ok: false, error: "휴대폰 번호 형식이 올바르지 않아요." }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ ok: false, error: "비밀번호는 8자 이상으로 설정해주세요." }, { status: 400 });
  }

  // SMS 인증 완료 확인 (reset purpose)
  const verifiedSince = new Date(Date.now() - VERIFICATION_WINDOW_MS);
  const verified = await db
    .select()
    .from(schema.phoneCodes)
    .where(
      and(
        eq(schema.phoneCodes.phone, phone),
        eq(schema.phoneCodes.purpose, "reset"),
        isNotNull(schema.phoneCodes.usedAt),
        gte(schema.phoneCodes.usedAt, verifiedSince),
      ),
    )
    .orderBy(desc(schema.phoneCodes.usedAt))
    .limit(1);
  if (verified.length === 0) {
    return Response.json(
      { ok: false, error: "휴대폰 인증을 먼저 완료해주세요." },
      { status: 400 },
    );
  }

  // 사용자 조회
  const rows = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.phone, phone))
    .limit(1);
  const user = rows[0];
  if (!user) {
    return Response.json({ ok: false, error: "가입되지 않은 번호예요." }, { status: 404 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db
    .update(schema.users)
    .set({ passwordHash })
    .where(eq(schema.users.id, user.id));

  return Response.json({ ok: true });
}
