import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
if (!process.env.USER_DB_URL) throw new Error("DATABASE_URL is not set");

export default {
  schema: "./src/lib/db/*",
  out: "./drizzle",
  driver: "mysql2",
  breakpoints: true,
  dbCredentials: {
    uri: process.env.USER_DB_URL,
  },
} satisfies Config;