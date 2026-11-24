
import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

const validStatuses = ["quero_ler", "lendo", "ja_li"];


router.use((req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({
      message: "Entre na sua conta para acessar sua biblioteca."
    });
  }

  next();
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT book_id, title, author, cover_id,
              status, created_at
       FROM user_books
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.session.userId]
    );

    return res.json({ books: result.rows });
  } catch (error) {
    console.error("Erro ao buscar biblioteca:", error);
    return res.status(500).json({
      message: "Não foi possível carregar sua biblioteca."
    });
  }
});


router.post("/", async (req, res) => {
  try {
    const { bookId, title, author, coverId, status } =
      req.body ?? {};

    if (
      typeof bookId !== "string" ||
      !/^OL\d+W$/.test(bookId) ||
      typeof title !== "string" ||
      !title.trim() ||
      title.length > 500 ||
      (author != null && typeof author !== "string") ||
      (coverId != null &&
        (!Number.isSafeInteger(coverId) || coverId <= 0)) ||
      !validStatuses.includes(status)
    ) {
      return res.status(400).json({
        message: "Dados do livro inválidos."
      });
    }

    const result = await pool.query(
      `INSERT INTO user_books
        (user_id, book_id, title, author, cover_id, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, book_id)
       DO UPDATE SET
         title = EXCLUDED.title,
         author = EXCLUDED.author,
         cover_id = EXCLUDED.cover_id,
         status = EXCLUDED.status,
         updated_at = NOW()
       RETURNING *`,
      [
        req.session.userId,
        bookId,
        title.trim(),
        author || null,
        coverId ?? null,
        status
      ]
    );

    return res.status(200).json({
      message: "Livro salvo na biblioteca!",
      book: result.rows[0]
    });
  } catch (error) {
    console.error("Erro ao salvar livro:", error);
    return res.status(500).json({
      message: "Não foi possível salvar o livro."
    });
  }
});


router.delete("/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;

    const result = await pool.query(
      `DELETE FROM user_books
       WHERE user_id = $1 AND book_id = $2
       RETURNING book_id`,
      [req.session.userId, bookId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Livro não encontrado na sua biblioteca."
      });
    }

    return res.json({
      message: "Livro removido da biblioteca."
    });
  } catch (error) {
    console.error("Erro ao remover livro:", error);
    return res.status(500).json({
      message: "Não foi possível remover o livro."
    });
  }
});


router.patch("/:bookId/favorite", async (req, res) => {
  try {
    const { bookId } = req.params;
    const { favorite } = req.body ?? {};

    if (typeof favorite !== "boolean") {
      return res.status(400).json({
        message: "Favorito deve ser true ou false."
      });
    }

 const result = await pool.query(
   `SELECT book_id, title, author, cover_id,
          status, is_favorite, created_at
   FROM user_books
   WHERE user_id = $1
   ORDER BY created_at DESC`,
   [req.session.userId],
 );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Livro não encontrado na biblioteca."
      });
    }

    return res.json({
      message: "Favorito atualizado!",
      book: result.rows[0]
    });

  } catch (error) {
    console.error("Erro ao favoritar:", error);

    return res.status(500).json({
      message: "Não foi possível atualizar o favorito."
    });
  }
});



export default router;
