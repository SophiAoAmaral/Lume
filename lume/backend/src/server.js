import translateRoutes from "./routes/translate.js";
import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import libraryRoutes from "./routes/library.js";

import { pool } from "./database.js";
import authRoutes from "./routes/auth.js";

const app = express();

const isProduction = process.env.NODE_ENV === "production";

const PgSession = connectPgSimple(session);

// Necessário quando o servidor está atrás de um proxy HTTPS
if (isProduction) {
  app.set("trust proxy", 1);
}

// CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_PROD_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());

// Sessões
app.use(session({
  store: new PgSession({
    pool,
    tableName: "user_sessions",
    createTableIfMissing: true
  }),

  name: "lume.sid",

  secret: process.env.SESSION_SECRET,

  resave: false,
  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

// Rotas de autenticação
app.use("/api/auth", authRoutes);


//app.use("/api/translate", translateRoutes);

app.use("/api/library", libraryRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    message: "API Lume funcionando!"
  });
});

// Teste do banco
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Banco conectado com sucesso!",
      timestamp: result.rows[0].now
    });

  } catch (error) {
    console.error("Erro:", error.message);
    console.error("Código:", error.code);
    console.error("Causa:", error.cause?.message);

    res.status(500).json({
      message: "Erro ao conectar ao banco"
    });
  }
});

// Iniciar servidor
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET não configurado");
}

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor Lume iniciado!");
});
