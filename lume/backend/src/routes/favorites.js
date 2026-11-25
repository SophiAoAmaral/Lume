
import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

// Verificar se o usuário está autenticado
router.use((req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({
      message: "Você precisa estar logado."
    });
  }

  next();
});

// Listar favoritos do usuário
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        book_id,
        title,
        author,
        cover_id,
        created_at
       FROM user_favorites
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.session.userId]
    );

    return res.json({
      books: result.rows
    });

  } catch (error) {
    console.error(
      "Erro ao buscar favoritos:",
      error.message
    );

    return res.status(500).json({
      message: "Erro ao buscar favoritos."
    });
  }
});

// Adicionar livro aos favoritos
router.post("/", async (req, res) => {
  try {
    const {
      bookId,
      title,
      author,
      coverId
    } = req.body ?? {};

    if (
      typeof bookId !== "string" ||
      !/^OL\d+W$/.test(bookId) ||
      typeof title !== "string" ||
      !title.trim() ||
      title.length > 500 ||
      (author != null && typeof author !== "string") ||
      (coverId != null &&
        (!Number.isSafeInteger(coverId) || coverId <= 0))
    ) {
      return res.status(400).json({
        message: "Dados do livro inválidos."
      });
    }

    const result = await pool.query(
      `INSERT INTO user_favorites (
        user_id,
        book_id,
        title,
        author,
        cover_id
      )
      VALUES ($1, $2, $3, $4, $5)

      ON CONFLICT (user_id, book_id)
      DO UPDATE SET
        title = EXCLUDED.title,
        author = EXCLUDED.author,
        cover_id = EXCLUDED.cover_id

      RETURNING *`,
      [
        req.session.userId,
        bookId,
        title.trim(),
        author || null,
        coverId ?? null
      ]
    );

    return res.json({
      message: "Livro adicionado aos favoritos!",
      book: result.rows[0]
    });

  } catch (error) {
    console.error(
      "Erro ao favoritar livro:",
      error.message
    );

    return res.status(500).json({
      message: "Erro ao favoritar livro."
    });
  }
});

// Remover livro dos favoritos
router.delete("/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!/^OL\d+W$/.test(bookId)) {
      return res.status(400).json({
        message: "Identificador do livro inválido."
      });
    }

    const result = await pool.query(
      `DELETE FROM user_favorites
       WHERE user_id = $1
         AND book_id = $2
       RETURNING book_id`,
      [req.session.userId, bookId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Livro não encontrado nos favoritos."
      });
    }

    return res.json({
      message: "Livro removido dos favoritos."
    });

  } catch (error) {
    console.error(
      "Erro ao remover favorito:",
      error.message
    );

    return res.status(500).json({
      message: "Erro ao remover favorito."
    });
  }
});

export default router;
