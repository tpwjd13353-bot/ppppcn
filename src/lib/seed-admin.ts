// 부팅 시 자동 어드민 계정 seed.
//
// 환경변수:
//   ADMIN_SEED_EMAIL    — 어드민 이메일 (없으면 seed 안 함)
//   ADMIN_SEED_PASSWORD — 어드민 비밀번호 (없으면 seed 안 함)
//   ADMIN_RESET_ALL=true — 같이 설정 시 user/account/session/phoneCode 전부 비움 (일회성)
//
// 같은 이메일 user가 있으면 비밀번호만 덮어쓰기. 없으면 새로 생성.

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function seedAdmin(): Promise<void> {
  const seedEmail = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;
  if (!seedEmail || !seedPassword) return;

  // 빌드 페이즈는 in-memory DB라 seed 의미 없음 → 스킵
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const { db, schema } = await import("./db");

  // 전체 데이터 리셋 (옵션)
  // 외래키 참조하는 자식 테이블의 userId를 먼저 NULL로 풀고 user를 삭제해야
  // SQLITE_CONSTRAINT_FOREIGNKEY 위반이 발생하지 않음. analyses·usage_log row 자체는 유지.
  if (process.env.ADMIN_RESET_ALL === "true") {
    await db.update(schema.analyses).set({ userId: null });
    await db.update(schema.usageLog).set({ userId: null });
    await db.delete(schema.sessions);
    await db.delete(schema.accounts);
    await db.delete(schema.phoneCodes);
    await db.delete(schema.users);
    console.log(
      "[seed-admin] reset: cleared sessions/accounts/phoneCodes/users (analyses·usage_log userId set to null)",
    );
  }

  const passwordHash = await bcrypt.hash(seedPassword, 10);

  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, seedEmail))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(schema.users)
      .set({ passwordHash })
      .where(eq(schema.users.email, seedEmail));
    console.log(`[seed-admin] password updated for ${seedEmail}`);
  } else {
    await db.insert(schema.users).values({
      email: seedEmail,
      passwordHash,
      name: "관리자",
      businessName: "퍼플페퍼",
      phone: "01029915990",
    });
    console.log(`[seed-admin] created admin user ${seedEmail}`);
  }
}
