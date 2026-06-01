// 사용 횟수 제한 (24시간 윈도우)
//
//                  분석          PDF 다운로드
//   비회원         3회           불가
//   회원           5회           3회
//   어드민         무제한        무제한

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { and, gte, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/auth";

const COOKIE_NAME = "ddj_analyze_used";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7일
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24시간

export const LIMITS = {
  analyze: { guest: 3, member: 5 },
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

async function getIpUsageCount(
  ipHash: string,
  type: UsageType,
): Promise<number> {
  const since = new Date(Date.now() - WINDOW_MS);
  const rows = await db
    .select({ id: schema.usageLog.id })
    .from(schema.usageLog)
    .where(
      and(
        eq(schema.usageLog.ipHash, ipHash),
        eq(schema.usageLog.type, type),
        gte(schema.usageLog.createdAt, since),
      ),
    );
  return rows.length;
}

async function getUserUsageCount(
  userId: string,
  type: UsageType,
): Promise<number> {
  const since = new Date(Date.now() - WINDOW_MS);
  const rows = await db
    .select({ id: schema.usageLog.id })
    .from(schema.usageLog)
    .where(
      and(
        eq(schema.usageLog.userId, userId),
        eq(schema.usageLog.type, type),
        gte(schema.usageLog.createdAt, since),
      ),
    );
  return rows.length;
}

async function getCookieAnalyzeCount(): Promise<number> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 0;
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
  req: Request,
  type: UsageType,
): Promise<RateLimitInfo> {
  const ctx = await getUserContext();

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
    const limit = LIMITS[type].member;
    const used = await getUserUsageCount(ctx.userId, type);
    return {
      allowed: used < limit,
      remaining: Math.max(0, limit - used),
      used,
      limit,
      tier: "member",
    };
  }

  // 비회원
  const limit = LIMITS[type].guest;
  if (limit === 0) {
    return { allowed: false, remaining: 0, used: 0, limit: 0, tier: "guest" };
  }

  const ipHash = hashClient(getClientIp(req));
  const [cookieCount, ipCount] = await Promise.all([
    getCookieAnalyzeCount(),
    getIpUsageCount(ipHash, type),
  ]);

  const used = Math.max(cookieCount, ipCount);
  return {
    allowed: used < limit,
    remaining: Math.max(0, limit - used),
    used,
    limit,
    tier: "guest",
  };
}

/** 성공 후 카운트 증가. 어드민이면 통계용으로만 기록 (제한 안 받음). */
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

  // 비회원은 쿠키도 갱신 (analyze 만)
  if (!ctx.userId && type === "analyze") {
    const current = await getCookieAnalyzeCount();
    const store = await cookies();
    store.set(COOKIE_NAME, String(current + 1), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }
}

// 기존 호출부 호환을 위한 별칭 (필요시 삭제 가능)
export const FREE_LIMIT = LIMITS.analyze.guest;
