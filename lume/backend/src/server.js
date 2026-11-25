
import "dotenv/config";

import express from "express";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import { pool } from "./database.js";

import authRoutes from "./routes/auth.js";
import libraryRoutes from "./routes/library.js";
import favoritesRoutes from "./routes/favorites.js";
import translateRoutes from "./routes/translate.js";

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;

// Validar as variáveis obrigatórias
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET não configurado");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não configurada");
}

// Render utiliza um proxy HTTPS
if (isProduction) {
  app.set("trust proxy", 1);
}

// CORS - Frontend local e GitHub Pages
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_PROD_URL
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Permitir requisições sem Origin (ex.: testes por curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origem não permitida pelo CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token"]
  })
);

// Middleware JSON
app.use(express.json({ limit: "100kb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    message: "API Lume funcionando!"
  });
});

// Teste de conexão com Supabase
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    return res.json({
      message: "Banco conectado com sucesso!",
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);

    return res.status(500).json({
      message: "Erro ao conectar ao banco"
    });
  }
});

// Sessões armazenadas no PostgreSQL
const PgSession = connectPgSimple(session);

app.use(
  session({
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
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

// Rotas da aplicação
app.use("/api/auth", authRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/translate", translateRoutes);

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    message: "Rota não encontrada"
  });
});

// Tratamento geral de erros
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err);

  res.status(500).json({
    message: "Erro interno do servidor"
  });
});

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor Lume iniciado na porta ${PORT}`);
});
