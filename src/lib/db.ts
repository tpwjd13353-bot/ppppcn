import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "node:path";
import fs from "node:fs";
import * as schema from "./schema";

// Railway Volume(STORAGE_DIR)이 있으면 그 안에, 없으면 프로젝트 루트에 로컬 파일 생성
const STORAGE_DIR = process.env.STORAGE_DIR;
const DB_PATH = STORAGE_DIR
  ? path.join(STORAGE_DIR, "ddj.db")
  : path.join(process.cwd(), "local.db");

if (STORAGE_DIR) fs.mkdirSync(STORAGE_DIR, { recursive: true });

const globalForSqlite = globalThis as unknown as {
  __sqlite?: Database.Database;
  __migrated?: boolean;
};

const sqlite = globalForSqlite.__sqlite ?? new Database(DB_PATH);
if (process.env.NODE_ENV !== "production") globalForSqlite.__sqlite = sqlite;

sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

// 앱 부팅 시 한 번만 마이그레이션 적용 (Railway 첫 배포 자동 처리)
if (!globalForSqlite.__migrated) {
  migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  globalForSqlite.__migrated = true;
}

export { schema };
