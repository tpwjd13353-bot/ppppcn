import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ---------- Auth.js 표준 테이블 ----------

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  // ↓ 자체 가입자(이메일/비번)용 — 카카오 가입자는 null
  passwordHash: text("passwordHash"),
  phone: text("phone"), // 휴대폰 (자체 가입자는 필수)
  phoneVerified: integer("phoneVerified", { mode: "timestamp_ms" }), // SMS 인증 완료 시각
  businessName: text("businessName"), // 상호명 (필수)
  region: text("region"), // 지역 (선택)
  industry: text("industry"), // 업종 (선택)
  placeUrl: text("placeUrl"), // 네이버 플레이스 URL (선택)
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 시군구 단위 지역 인사이트 (결과 페이지 지역 분석용)
// region_code = "{sido}|{sigungu}" 텍스트 조합. lossLookup이 추출한 시군구와 정확히 일치해야 함.
export const regionInsights = sqliteTable("region_insight", {
  regionCode: text("regionCode").primaryKey(), // "경기도|안산시 단원구"
  regionName: text("regionName").notNull(), // 표시명 "안산 단원구"
  inboundTotal: integer("inboundTotal"), // 해당 연도 방한 중국 관광객 전국 총계
  inboundYoy: text("inboundYoy"), // 전년 대비 증감률 (텍스트 — "15.4" / "+15.4%")
  residentForeigners: integer("residentForeigners"), // 지역 거주 중국인 수
  residentRank: integer("residentRank"), // 전국 거주 순위
  regionAnnualVisitors: integer("regionAnnualVisitors"), // 지역 권역 연간 방문 추정
  isEstimate: integer("isEstimate", { mode: "boolean" }).default(false), // 추정치 플래그
  sourceLabel: text("sourceLabel"), // 출처 표기 ("한국관광공사" / "자체 추정")
  commercialZones: text("commercialZones", { mode: "json" }).$type<
    Array<{ name: string; weight: number; label?: string; type: "hot" | "you" | "cool" }>
  >(),
  monthlyTrend: text("monthlyTrend", { mode: "json" }).$type<
    Array<{ month: number; value: number; peak?: boolean }>
  >(),
  peakNote: text("peakNote"), // 성수기 안내 문구
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// 플랫폼 활용 전략 카드 (잠금 티저 포함)
export const platformPlaybook = sqliteTable("platform_playbook", {
  platformKey: text("platformKey").primaryKey(), // "xhs" / "dzdp" / "douyin"
  nameKo: text("nameKo").notNull(),
  nameCn: text("nameCn"),
  roleTag: text("roleTag"), // "발견" / "바이럴" / "리뷰" 등
  icon: text("icon"), // lucide 아이콘명 또는 이모지
  descTemplate: text("descTemplate"), // {{viral_menus}} 같은 변수 지원
  lockedTeaser: text("lockedTeaser"), // 잠금 상태에서 보여줄 한 줄
  sortOrder: integer("sortOrder").default(0),
  enabled: integer("enabled", { mode: "boolean" }).default(true),
});

// SMS 인증코드 임시 저장 (가입 / 비번 재설정)
export const phoneCodes = sqliteTable("phone_code", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  phone: text("phone").notNull(),
  code: text("code").notNull(), // 6자리 숫자
  purpose: text("purpose").notNull(), // "signup" | "reset"
  expiresAt: integer("expiresAt", { mode: "timestamp_ms" }).notNull(),
  usedAt: integer("usedAt", { mode: "timestamp_ms" }), // 사용한 시점 (재사용 방지)
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ],
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

// ---------- 앱 전용 테이블 ----------

export const analyses = sqliteTable("analyses", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => users.id, { onDelete: "set null" }),
  naverUrl: text("naverUrl").notNull(),
  placeName: text("placeName"),
  menu: text("menu", { mode: "json" }).$type<string[]>(),
  scores: text("scores", { mode: "json" }).$type<Record<string, number>>(),
  totalScore: integer("totalScore"),
  reportData: text("reportData", { mode: "json" }),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const usageLog = sqliteTable("usage_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // "analyze" = 분석 1회, "pdf" = PDF 다운로드 1회
  type: text("type").notNull().default("analyze"),
  ipHash: text("ipHash").notNull(),
  uaHash: text("uaHash"),
  userId: text("userId").references(() => users.id, { onDelete: "set null" }),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type Analysis = typeof analyses.$inferSelect;
export type NewAnalysis = typeof analyses.$inferInsert;
