
import "dotenv/config";
import pg from "pg";
import fs from "node:fs";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL não foi carregada. Verifique o .env."
  );
}

const dbUrl = new URL(process.env.DATABASE_URL);

console.log("Host:", dbUrl.hostname);
console.log("Usuário configurado:", Boolean(dbUrl.username));
console.log("Senha configurada:", Boolean(dbUrl.password));
console.log("Banco:", dbUrl.pathname);
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

console.log("Diagnóstico PostgreSQL:", {
  host: pool.options.host,
  port: pool.options.port,
  userConfigured: Boolean(pool.options.user),
  passwordType: typeof pool.options.password,
  databaseConfigured: Boolean(pool.options.database)
});
