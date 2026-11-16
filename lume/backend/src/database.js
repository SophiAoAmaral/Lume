import pg from "pg";
import fs from "node:fs";

const { Pool } = pg;

const ca = fs.readFileSync(
  new URL("../certificates/prod-ca-2021.crt", import.meta.url),
  "utf8"
);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  connectionTimeoutMillis: 10000,
  ssl: {
    ca,
    rejectUnauthorized: true
  }
});