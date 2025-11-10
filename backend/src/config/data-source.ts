import "reflect-metadata"
import { DataSource } from "typeorm"


import * as dotenv from "dotenv"
dotenv.config()

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST || "db.atkygskavfqtxvnygvbc.supabase.co",
  port: Number(DB_PORT) || 5432,
  username: DB_USER || "postgres",
  password: DB_PASSWORD || "@bdull@h$h@H132109",
  database: DB_NAME || "postgres",

  synchronize: false,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
});
