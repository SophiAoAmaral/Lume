
import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

const validStatuses = ["quero_ler", "lendo", "ja_li"];

// Verificar se o usuário está autenticado
router.use((req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({
      message: "Entre na sua conta para acessar sua biblioteca."
    });
  }

  next();
});

// Buscar livros da biblioteca do usuário
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        book_id,
        title,
        author,
        cover_id,
        status,
        is_favorite,
        created_at
       FROM user_books
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.session.userId]
    );

    return res.json({
      books: result.rows
    });

  } catch (error) {
    console.error("Erro ao buscar biblioteca:", error.message);

    return res.status(500).json({
      message: "Não foi possível carregar sua biblioteca."
    });
  }
});

// Adicionar livro ou atualizar sua categoria
router.post("/", async (req, res) => {
  try {
    const {
      bookId,
      title,
      author,
      coverId,
      status
    } = req.body ?? {};

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
      `INSERT INTO user_books (
        user_id,
        book_id,
        title,
        author,
        cover_id,
        status
      )
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
    console.error("Erro ao salvar livro:", error.message);

    return res.status(500).json({
      message: "Não foi possível salvar o livro."
    });
  }
});

// Remover livro da biblioteca
router.delete("/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!/^OL\d+W$/.test(bookId)) {
      return res.status(400).json({
        message: "Identificador do livro inválido."
      });
    }

    const result = await pool.query(
      `DELETE FROM user_books
       WHERE user_id = $1
         AND book_id = $2
       RETURNING book_id`,
      [req.session.userId, bookId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Livro não encontrado na biblioteca."
      });
    }

    return res.json({
      message: "Livro removido da biblioteca."
    });

  } catch (error) {
    console.error("Erro ao remover livro:", error.message);

    return res.status(500).json({
      message: "Não foi possível remover o livro."
    });
  }
});

// Favoritar ou remover dos favoritos
router.patch("/:bookId/favorite", async (req, res) => {
  try {
    const { bookId } = req.params;
    const { favorite } = req.body ?? {};

    if (!/^OL\d+W$/.test(bookId)) {
      return res.status(400).json({
        message: "Identificador do livro inválido."
      });
    }

    if (typeof favorite !== "boolean") {
      return res.status(400).json({
        message: "Favorito deve ser true ou false."
      });
    }

    const result = await pool.query(
      `UPDATE user_books
       SET
         is_favorite = $1,
         updated_at = NOW()
       WHERE user_id = $2
         AND book_id = $3
       RETURNING book_id, is_favorite`,
      [
        favorite,
        req.session.userId,
        bookId
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Adicione o livro à biblioteca antes de favoritar."
      });
    }

    return res.json({
      message: favorite
        ? "Livro adicionado aos favoritos!"
        : "Livro removido dos favoritos!",
      book: result.rows[0]
    });

  } catch (error) {
    console.error("Erro ao atualizar favorito:", error.message);

    return res.status(500).json({
      message: "Não foi possível atualizar o favorito."
    });
  }
});

export default router;
