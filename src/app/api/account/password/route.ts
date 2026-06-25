// 본인 비밀번호 변경 API.
// - 로그인 세션 필요 (어드민/일반 회원 모두 사용 가능)
// - 카카오 가입자(passwordHash null)는 currentPassword 검증 없이 새 비번 설정 허용
// - 자체 가입자는 currentPassword 일치 시 갱신
// - 새 비번 8자 이상

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";

interface Body {
  currentPassword?: string;
  newPassword?: string;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { ok: false, error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json(
      { ok: false, error: "잘못된 요청입니다." },
      { status: 400 },
    );
  }

  const next = (body.newPassword ?? "").trim();
  if (next.length < 8) {
    return Response.json(
      { ok: false, error: "새 비밀번호는 8자 이상이어야 합니다." },
      { status: 400 },
    );
  }
  if (next.length > 200) {
    return Response.json(
      { ok: false, error: "비밀번호가 너무 깁니다." },
      { status: 400 },
    );
  }

  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id))
    .limit(1);
  const user = rows[0];
  if (!user) {
    return Response.json(
      { ok: false, error: "계정을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  // 자체 가입자(passwordHash 있음) → 현재 비번 검증 필수
  if (user.passwordHash) {
    const current = (body.currentPassword ?? "").trim();
    if (!current) {
      return Response.json(
        { ok: false, error: "현재 비밀번호를 입력해주세요." },
        { status: 400 },
      );
    }
    const ok = await bcrypt.compare(current, user.passwordHash);
    if (!ok) {
      return Response.json(
        { ok: false, error: "현재 비밀번호가 일치하지 않습니다." },
        { status: 400 },
      );
    }
    if (current === next) {
      return Response.json(
        { ok: false, error: "새 비밀번호가 현재 비밀번호와 같습니다." },
        { status: 400 },
      );
    }
  }
  // 카카오 가입자 → currentPassword 없이 첫 비번 설정 허용 (분기 메시지는 클라이언트가 표시)

  const hash = await bcrypt.hash(next, 10);
  await db
    .update(schema.users)
    .set({ passwordHash: hash })
    .where(eq(schema.users.id, session.user.id));

  return Response.json({ ok: true });
}
