import { Router } from "express";
import argon2 from "argon2";
import { pool } from "../database.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Dados inválidos"
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (
      cleanName.length < 2 ||
      cleanName.length > 100 ||
      cleanEmail.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
      password.length < 12 ||
      Buffer.byteLength(password, "utf8") > 1024
    ) {
      return res.status(400).json({
        message: "Informe nome, e-mail válido e senha de pelo menos 12 caracteres"
      });
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id
    });

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [cleanName, cleanEmail, passwordHash]
    );

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      user: result.rows[0]
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Não foi possível realizar o cadastro com esse e-mail"
      });
    }

    console.error("Erro no cadastro:", error.message);

    return res.status(500).json({
      message: "Erro interno do servidor"
    });
  }
});

export default router;