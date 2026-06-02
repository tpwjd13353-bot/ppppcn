import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "node:path";
import fs from "node:fs";
import * as schema from "./schema";

// `next build` 페이즈에서는 페이지 분석용 import에 의해 31개 worker가
// 동시에 같은 DB 파일에 접근하여 SQLITE_BUSY 락 충돌이 발생.
// 빌드 페이즈엔 worker별 in-memory DB로 우회 (어차피 force-dynamic 라우트라 호출 안 됨).
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

// Railway Volume(STORAGE_DIR)이 있으면 그 안에, 없으면 프로젝트 루트에 로컬 파일 생성
const STORAGE_DIR = process.env.STORAGE_DIR;
const DB_PATH = isBuildPhase
  ? ":memory:"
  : STORAGE_DIR
    ? path.join(STORAGE_DIR, "ddj.db")
    : path.join(process.cwd(), "local.db");

if (STORAGE_DIR && !isBuildPhase) fs.mkdirSync(STORAGE_DIR, { recursive: true });

const globalForSqlite = globalThis as unknown as {
  __sqlite?: Database.Database;
  __migrated?: boolean;
};

const sqlite =
  globalForSqlite.__sqlite ?? new Database(DB_PATH, { timeout: 15000 });
if (process.env.NODE_ENV !== "production") globalForSqlite.__sqlite = sqlite;

if (!isBuildPhase) {
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
}

export const db = drizzle(sqlite, { schema });

// 앱 부팅 시 한 번만 마이그레이션 적용 (Railway 첫 배포 자동 처리)
if (!isBuildPhase && !globalForSqlite.__migrated) {
  try {
    migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  } catch (err) {
    // 이미 적용된 테이블이 있으면 무시 (race condition 대비)
    const msg = err instanceof Error ? err.message : String(err);
    if (!/already exists/i.test(msg)) throw err;
  }
  globalForSqlite.__migrated = true;
}

export { schema };
