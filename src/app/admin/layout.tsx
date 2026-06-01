// 어드민 영역 가드 — 모든 /admin/* 페이지에 자동 적용
//
// ADMIN_EMAILS 환경변수에 포함된 이메일로 로그인한 경우만 통과.
// 비로그인 → /login으로, 비어드민 → / 로 리다이렉트.

import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getAdminContext();

  if (!ctx.email) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!ctx.isAdmin) {
    // 로그인은 했지만 어드민 아님 → 홈으로
    redirect("/?notAdmin=1");
  }

  return <>{children}</>;
}
