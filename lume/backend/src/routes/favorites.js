
import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

// Exigir login
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
      `SELECT book_id, title, author, cover_id
       FROM user_favorites
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.session.userId]
    );

    return res.json({ books: result.rows });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao buscar favoritos."
    });
  }
});

// Adicionar aos favoritos
router.post("/", async (req, res) => {
  try {
    const { bookId, title, author, coverId } = req.body ?? {};

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
      `INSERT INTO user_favorites
        (user_id, book_id, title, author, cover_id)
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
      message: "Livro favoritado!",
      book: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao favoritar livro."
    });
  }
});

// Remover dos favoritos
router.delete("/:bookId", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM user_favorites
       WHERE user_id = $1 AND book_id = $2`,
      [req.session.userId, req.params.bookId]
    );

    return res.json({
      message: "Livro removido dos favoritos."
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao remover favorito."
    });
  }
});

export default router;
