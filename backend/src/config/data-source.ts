import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "postgres",
  synchronize: false,
  logging: false,

  // ✅ Dev: TS files, Prod: compiled JS
  entities: [
    isProd
      ? join(__dirname, "entity/**/*.js")   // Vercel/production
      : join(__dirname, "../src/entity/**/*.ts") // local dev
  ],

  migrations: [
    isProd
      ? join(__dirname, "migrations/**/*.js")
      : join(__dirname, "../src/migrations/**/*.ts")
  ],
});
