import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.STORAGE_DIR
      ? `${process.env.STORAGE_DIR}/ddj.db`
      : "./local.db",
  },
} satisfies Config;
