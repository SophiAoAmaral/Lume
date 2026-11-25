
import "dotenv/config";
import pg from "pg";
import fs from "node:fs";

const { Pool } = pg;

// Verificar variável obrigatória
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL não configurada. Verifique as variáveis de ambiente."
  );
}

// Certificado SSL do Supabase
const ca = fs.readFileSync(
  new URL("../certificates/prod-ca-2021.crt", import.meta.url),
  "utf8"
);

// Pool de conexões PostgreSQL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  max: 5,

  connectionTimeoutMillis: 10000,

  idleTimeoutMillis: 30000,

  ssl: {
    ca,
    rejectUnauthorized: true
  }
});

// Tratamento de erros em conexões ociosas
pool.on("error", (error) => {
  console.error(
    "Erro inesperado na conexão PostgreSQL:",
    error.message
  );
});
