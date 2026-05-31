// 분석 도구 무료 사용 횟수 제한
//
// 비회원: 쿠키 + IP 해시 둘 다 체크 (24시간 윈도우, 최대 3회)
// 회원: 제한 없음 (또는 더 높은 한도 — 일단 무제한)

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { and, gte, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

const COOKIE_NAME = "ddj_analyze_used";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7일
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24시간
const FREE_LIMIT = 3;

export interface RateLimitInfo {
  allowed: boolean;
  remaining: number;
  used: number;
  limit: number;
  isMember: boolean;
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

async function getCookieCount(): Promise<number> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

async function getIpCount(ipHash: string): Promise<number> {
  const since = new Date(Date.now() - WINDOW_MS);
  const rows = await db
    .select({ id: schema.usageLog.id })
    .from(schema.usageLog)
    .where(
      and(
        eq(schema.usageLog.ipHash, ipHash),
        gte(schema.usageLog.createdAt, since),
      ),
    );
  return rows.length;
}

/** 분석 시도 가능 여부 + 남은 횟수 반환. 카운트는 증가시키지 않음. */
export async function checkRateLimit(
  req: Request,
  userId: string | null,
): Promise<RateLimitInfo> {
  if (userId) {
    return {
      allowed: true,
      remaining: Number.POSITIVE_INFINITY,
      used: 0,
      limit: Number.POSITIVE_INFINITY,
      isMember: true,
    };
  }

  const ipHash = hashClient(getClientIp(req));
  const [cookieCount, ipCount] = await Promise.all([
    getCookieCount(),
    getIpCount(ipHash),
  ]);

  const used = Math.max(cookieCount, ipCount);
  const remaining = Math.max(0, FREE_LIMIT - used);

  return {
    allowed: remaining > 0,
    remaining,
    used,
    limit: FREE_LIMIT,
    isMember: false,
  };
}

/** 분석 성공 후 카운트 증가 (쿠키 +1, usage_log 행 추가). 회원은 패스. */
export async function recordUsage(
  req: Request,
  userId: string | null,
): Promise<void> {
  const ipHash = hashClient(getClientIp(req));
  const uaHash = hashClient(req.headers.get("user-agent") ?? "");

  // 사용 이력 기록 (회원·비회원 모두)
  await db.insert(schema.usageLog).values({
    ipHash,
    uaHash,
    userId: userId ?? null,
  });

  // 회원은 쿠키 갱신 불필요
  if (userId) return;

  const current = await getCookieCount();
  const store = await cookies();
  store.set(COOKIE_NAME, String(current + 1), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export { FREE_LIMIT };
