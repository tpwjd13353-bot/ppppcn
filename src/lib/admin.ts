// 어드민 권한 판별
//
// ADMIN_EMAILS 환경변수 (콤마 구분)에 등록된 이메일이면 어드민.
// 예: ADMIN_EMAILS=tpwjd133@naver.com,admin@ppppcn.com

import { auth } from "@/lib/auth";

/** 이메일이 어드민 리스트에 포함되는지 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

export interface AdminGuardResult {
  isAdmin: boolean;
  userId: string | null;
  email: string | null;
}

/** 현재 세션 기준 어드민 여부 (서버 컴포넌트/route 핸들러용) */
export async function getAdminContext(): Promise<AdminGuardResult> {
  const session = await auth();
  const email = session?.user?.email ?? null;
  const userId = session?.user?.id ?? null;
  return {
    isAdmin: isAdminEmail(email),
    userId,
    email,
  };
}

/** route 핸들러에서 어드민 확인 — 아니면 null 반환 */
export async function requireAdmin(): Promise<AdminGuardResult | null> {
  const ctx = await getAdminContext();
  if (!ctx.isAdmin) return null;
  return ctx;
}
