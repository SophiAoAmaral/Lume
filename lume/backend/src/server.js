import cors from "cors";
import "dotenv/config";
import express from "express";
import { pool } from "./database.js";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors({
    origin:[
    process.env.FRONTEND_URL,
    process.env.FRONTEND_PROD_URL
    ]
}));

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "API Lume funcionando!" });
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor iniciado!");
});



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