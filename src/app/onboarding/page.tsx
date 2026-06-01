import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { revalidatePath } from "next/cache";

const INDUSTRIES = ["외식", "뷰티", "레저", "숙박·호텔", "기타"];

export const metadata = {
  title: "프로필 완성 — 퍼플페퍼",
};

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/onboarding");

  const userId = session.user.id;
  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);
  const user = rows[0];

  // 이미 필수 정보 다 채웠으면 메인으로
  if (user?.phone && user?.businessName) redirect("/");

  async function saveProfile(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;

    const businessName = ((formData.get("businessName") as string) ?? "").trim();
    const phone = ((formData.get("phone") as string) ?? "").trim();
    if (!businessName || !phone) {
      // 필수 누락 시 그대로 (브라우저 required도 있지만 백엔드 가드)
      return;
    }

    await db
      .update(schema.users)
      .set({
        businessName,
        phone,
        region: ((formData.get("region") as string) ?? "").trim() || null,
        industry: ((formData.get("industry") as string) ?? "").trim() || null,
        placeUrl: ((formData.get("placeUrl") as string) ?? "").trim() || null,
      })
      .where(eq(schema.users.id, s.user.id));

    revalidatePath("/");
    redirect("/");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg rounded-2xl border border-border/40 bg-background/60 p-8 backdrop-blur">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          프로필 완성
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {session.user.name ? `${session.user.name}님, 환영합니다. ` : ""}
          상담을 더 빠르게 도와드리려고 한 번만 받는 정보예요.
        </p>

        <form action={saveProfile} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground/80">
              상호명 <span className="text-primary">*</span>
            </label>
            <input
              name="businessName"
              required
              placeholder="예) 퍼플페퍼"
              className="w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground/80">
              휴대폰 번호 <span className="text-primary">*</span>
            </label>
            <input
              name="phone"
              required
              type="tel"
              placeholder="예) 010-1234-5678"
              className="w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-muted-foreground/70">
              현재는 인증 없이 입력만 받습니다. (SMS 인증은 다음 단계에서 추가)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                지역 (선택)
              </label>
              <input
                name="region"
                placeholder="예) 홍대"
                className="w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                업종 (선택)
              </label>
              <select
                name="industry"
                defaultValue=""
                className="w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">선택 안 함</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              네이버 플레이스 URL (선택)
            </label>
            <input
              name="placeUrl"
              type="url"
              placeholder="https://map.naver.com/..."
              className="w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition hover:opacity-90"
          >
            저장하고 시작하기
          </button>
        </form>
      </div>
    </main>
  );
}
