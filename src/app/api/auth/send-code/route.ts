// 휴대폰 SMS 인증코드 발송
//
// POST { phone, purpose: "signup" | "reset" }
//   - signup: 가입용 — 이미 가입된 번호면 거부
//   - reset:  비번 재설정 — 가입 안 된 번호면 거부
//
// 60초 내 재요청 방지, 1시간 5회 제한.

import { eq, and, desc, gte } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { sendSms, generateCode, normalizePhone } from "@/lib/sms";

const RESEND_COOLDOWN_MS = 60 * 1000;
const HOURLY_LIMIT = 5;
const HOURLY_WINDOW_MS = 60 * 60 * 1000;
const CODE_TTL_MS = 5 * 60 * 1000;

export async function POST(req: Request) {
  let body: { phone?: string; purpose?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });
  }

  const phone = normalizePhone(body.phone ?? "");
  const purpose = body.purpose === "reset" ? "reset" : "signup";

  if (!/^010\d{8}$/.test(phone)) {
    return Response.json(
      { ok: false, error: "휴대폰 번호 형식이 올바르지 않아요." },
      { status: 400 },
    );
  }

  // 이미 가입된 번호 체크
  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.phone, phone))
    .limit(1);

  if (purpose === "signup" && existing.length > 0) {
    return Response.json(
      {
        ok: false,
        error: "이미 가입된 번호예요. 로그인 페이지에서 시도해주세요.",
      },
      { status: 409 },
    );
  }
  if (purpose === "reset" && existing.length === 0) {
    return Response.json(
      { ok: false, error: "가입되지 않은 번호예요." },
      { status: 404 },
    );
  }

  // 요청 제한
  const oneHourAgo = new Date(Date.now() - HOURLY_WINDOW_MS);
  const recent = await db
    .select()
    .from(schema.phoneCodes)
    .where(
      and(
        eq(schema.phoneCodes.phone, phone),
        gte(schema.phoneCodes.createdAt, oneHourAgo),
      ),
    )
    .orderBy(desc(schema.phoneCodes.createdAt))
    .limit(HOURLY_LIMIT + 1);

  if (recent.length >= HOURLY_LIMIT) {
    return Response.json(
      { ok: false, error: "잠시 후 다시 시도해주세요. (1시간 5회 제한)" },
      { status: 429 },
    );
  }
  if (recent[0]) {
    const since = Date.now() - new Date(recent[0].createdAt).getTime();
    if (since < RESEND_COOLDOWN_MS) {
      const wait = Math.ceil((RESEND_COOLDOWN_MS - since) / 1000);
      return Response.json(
        { ok: false, error: `${wait}초 후에 다시 요청해주세요.` },
        { status: 429 },
      );
    }
  }

  // 코드 생성 + SMS 발송
  const code = generateCode();
  const expiresAt = new Date(Date.now() + CODE_TTL_MS);
  const text = `[퍼플페퍼] 인증번호: ${code} (5분 내 입력)`;

  const smsResult = await sendSms(phone, text);
  if (!smsResult.ok) {
    return Response.json(
      { ok: false, error: smsResult.error },
      { status: 502 },
    );
  }

  await db.insert(schema.phoneCodes).values({
    phone,
    code,
    purpose,
    expiresAt,
  });

  return Response.json({ ok: true });
}
