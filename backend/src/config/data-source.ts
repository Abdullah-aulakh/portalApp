import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } = process.env;

// Use TS files for dev, compiled JS for production
const entitiesPath =
  NODE_ENV === "production"
    ? join(__dirname, "dist/entity/**/*.js")   // after build, TS → JS
    : join(__dirname, "/../src/entity/**/*.ts");  // dev

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST || "",
  port: Number(DB_PORT) || 5432,
  username: DB_USER || "postgres",
  password: DB_PASSWORD || "",
  database: DB_NAME || "postgres",
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],

});
