// 회원가입 — 이메일/비밀번호 + 정보 입력 (SMS 인증 없음)

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, schema } from "@/lib/db";

function normalizePhone(input: string): string {
  return (input ?? "").replace(/[^0-9]/g, "");
}

export async function POST(req: Request) {
  let body: {
    email?: string;
    password?: string;
    phone?: string;
    businessName?: string;
    region?: string;
    industry?: string;
    placeUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const phone = normalizePhone(body.phone ?? "");
  const businessName = (body.businessName ?? "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "올바른 이메일을 입력해주세요." }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ ok: false, error: "비밀번호는 8자 이상으로 설정해주세요." }, { status: 400 });
  }
  if (!/^010\d{8}$/.test(phone)) {
    return Response.json({ ok: false, error: "휴대폰 번호 형식이 올바르지 않아요." }, { status: 400 });
  }
  if (!businessName) {
    return Response.json({ ok: false, error: "상호명을 입력해주세요." }, { status: 400 });
  }

  const dupEmail = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  if (dupEmail.length > 0) {
    return Response.json({ ok: false, error: "이미 가입된 이메일이에요." }, { status: 409 });
  }
  const dupPhone = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.phone, phone))
    .limit(1);
  if (dupPhone.length > 0) {
    return Response.json({ ok: false, error: "이미 가입된 번호예요." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(schema.users).values({
    email,
    passwordHash,
    phone,
    businessName,
    region: (body.region ?? "").trim() || null,
    industry: (body.industry ?? "").trim() || null,
    placeUrl: (body.placeUrl ?? "").trim() || null,
  });

  return Response.json({ ok: true });
}
