
import { Router } from "express";
import argon2 from "argon2";
import { pool } from "../database.js";

const router = Router();

// Validar e-mail
const isValidEmail = (email) =>
  typeof email === "string" &&
  email.trim().length <= 255 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

// Criar conta
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};
    const errors = {};

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 100
    ) {
      errors.name = "O nome deve ter entre 2 e 100 caracteres.";
    }

    if (!isValidEmail(email)) {
      errors.email = "Informe um e-mail válido.";
    }

    if (
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 1024
    ) {
      errors.password =
        "A senha deve ter pelo menos 8 caracteres.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Verifique os campos do formulário.",
        errors
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

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
        message: "Não foi possível realizar o cadastro com esse e-mail.",
        errors: {
          email: "Não foi possível cadastrar este e-mail."
        }
      });
    }

    console.error("Erro no cadastro:", error.message);

    return res.status(500).json({
      message: "Não foi possível criar sua conta agora."
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (
      !isValidEmail(email) ||
      typeof password !== "string" ||
      password.length === 0 ||
      Buffer.byteLength(password, "utf8") > 1024
    ) {
      return res.status(400).json({
        message: "E-mail ou senha inválidos"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `SELECT id, name, email, password_hash
       FROM users
       WHERE email = $1`,
      [cleanEmail]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos"
      });
    }

    const passwordValid = await argon2.verify(
      user.password_hash,
      password
    );

    if (!passwordValid) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos"
      });
    }

    // Evitar reutilização da sessão anterior
    await new Promise((resolve, reject) => {
      req.session.regenerate((error) => {
        if (error) return reject(error);
        resolve();
      });
    });

    req.session.userId = user.id;

    // Garantir que a sessão foi salva
    await new Promise((resolve, reject) => {
      req.session.save((error) => {
        if (error) return reject(error);
        resolve();
      });
    });

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Erro no login:", error.message);

    return res.status(500).json({
      message: "Não foi possível realizar o login."
    });
  }
});

// Verificar usuário autenticado
router.get("/me", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({
        message: "Usuário não autenticado"
      });
    }

    const result = await pool.query(
      `SELECT id, name, email
       FROM users
       WHERE id = $1`,
      [req.session.userId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Usuário não encontrado"
      });
    }

    return res.status(200).json({ user });

  } catch (error) {
    console.error(
      "Erro ao buscar usuário:",
      error.message
    );

    return res.status(500).json({
      message: "Erro interno do servidor"
    });
  }
});

// Logout
router.post("/logout", (req, res) => {
  if (!req.session) {
    return res.status(200).json({
      message: "Logout realizado com sucesso!"
    });
  }

  req.session.destroy((error) => {
    if (error) {
      console.error("Erro no logout:", error.message);

      return res.status(500).json({
        message: "Erro ao encerrar sessão"
      });
    }

    res.clearCookie("lume.sid", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax"
    });

    return res.status(200).json({
      message: "Logout realizado com sucesso!"
    });
  });
});

export default router;
