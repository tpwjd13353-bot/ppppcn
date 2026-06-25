// 본인 비밀번호 변경 페이지 (로그인 필요).
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { PasswordChangeForm } from "./PasswordChangeForm";

export const metadata = { title: "비밀번호 변경 — 퍼플페퍼" };
export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/password");
  }

  const rows = await db
    .select({
      email: schema.users.email,
      hasPassword: schema.users.passwordHash,
    })
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id))
    .limit(1);
  const me = rows[0];
  const hasPassword = !!me?.hasPassword;

  return (
    <main className="mx-auto w-full max-w-md px-6 py-16 md:py-24">
      <header className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          비밀번호 변경
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {me?.email && (
            <>
              로그인 계정 <span className="text-foreground">{me.email}</span>
              <br />
            </>
          )}
          {hasPassword
            ? "현재 비밀번호를 확인한 뒤 새 비밀번호로 바꿔드립니다."
            : "카카오로 가입하신 계정이라 비밀번호가 아직 없어요. 새 비밀번호를 설정하면 이메일+비밀번호로도 로그인하실 수 있습니다."}
        </p>
      </header>

      <PasswordChangeForm hasPassword={hasPassword} />
    </main>
  );
}
