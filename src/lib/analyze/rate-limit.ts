// 사용 횟수 제한
//
//                  분석          PDF 다운로드
//   비회원         무제한        불가 (가입 유도)
//   회원           무제한        계정당 총 3회 (lifetime)
//   어드민         무제한        무제한

import crypto from "node:crypto";
import { and, gte, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/auth";

const WINDOW_MS = 24 * 60 * 60 * 1000; // (현재 미사용 - 향후 윈도우 제한 필요 시)

export const LIMITS = {
  analyze: { guest: Number.POSITIVE_INFINITY, member: Number.POSITIVE_INFINITY },
  pdf: { guest: 0, member: 3 },
} as const;

export type UsageType = "analyze" | "pdf";

export interface RateLimitInfo {
  allowed: boolean;
  remaining: number;
  used: number;
  limit: number;
  tier: "guest" | "member" | "admin";
}

function hashClient(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 32);
}

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp;
  return "unknown";
}

async function getUserUsageCount(
  userId: string,
  type: UsageType,
  lifetime = false,
): Promise<number> {
  const conditions = [
    eq(schema.usageLog.userId, userId),
    eq(schema.usageLog.type, type),
  ];
  if (!lifetime) {
    const since = new Date(Date.now() - WINDOW_MS);
    conditions.push(gte(schema.usageLog.createdAt, since));
  }
  const rows = await db
    .select({ id: schema.usageLog.id })
    .from(schema.usageLog)
    .where(and(...conditions));
  return rows.length;
}

interface UserContext {
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
}

async function getUserContext(): Promise<UserContext> {
  const session = await auth();
  const email = session?.user?.email ?? null;
  const userId = session?.user?.id ?? null;
  return {
    userId,
    email,
    isAdmin: isAdminEmail(email),
  };
}

/** 분석/PDF 시도 가능 여부 + 남은 횟수 반환. 카운트는 증가시키지 않음. */
export async function checkRateLimit(
  _req: Request,
  type: UsageType,
): Promise<RateLimitInfo> {
  const ctx = await getUserContext();
  const tier: RateLimitInfo["tier"] = ctx.isAdmin
    ? "admin"
    : ctx.userId
      ? "member"
      : "guest";

  // 분석은 누구나 무제한
  if (type === "analyze") {
    return {
      allowed: true,
      remaining: Number.POSITIVE_INFINITY,
      used: 0,
      limit: Number.POSITIVE_INFINITY,
      tier,
    };
  }

  // PDF
  if (ctx.isAdmin) {
    return {
      allowed: true,
      remaining: Number.POSITIVE_INFINITY,
      used: 0,
      limit: Number.POSITIVE_INFINITY,
      tier: "admin",
    };
  }
  if (ctx.userId) {
    const limit = LIMITS.pdf.member; // 계정당 lifetime 3회
    const used = await getUserUsageCount(ctx.userId, "pdf", true);
    return {
      allowed: used < limit,
      remaining: Math.max(0, limit - used),
      used,
      limit,
      tier: "member",
    };
  }
  // 비회원은 PDF 불가
  return { allowed: false, remaining: 0, used: 0, limit: 0, tier: "guest" };
}

/** 성공 후 카운트 증가. 통계 + PDF 카운트용. */
export async function recordUsage(
  req: Request,
  type: UsageType,
): Promise<void> {
  const ctx = await getUserContext();
  const ipHash = hashClient(getClientIp(req));
  const uaHash = hashClient(req.headers.get("user-agent") ?? "");

  await db.insert(schema.usageLog).values({
    type,
    ipHash,
    uaHash,
    userId: ctx.userId,
  });
}

// 기존 호출부 호환을 위한 별칭 (필요시 삭제 가능)
export const FREE_LIMIT = LIMITS.analyze.guest;
