
import { Router } from "express";
import { createHash } from "node:crypto";
import { pool } from "../database.js";

const router = Router();

function splitText(text, maxBytes = 450) {
  const chunks = [];
  let current = "";

  for (const word of text.split(/\s+/)) {
    const next = current ? `${current} ${word}` : word;

    if (Buffer.byteLength(next, "utf8") > maxBytes) {
      if (current) chunks.push(current);

      if (Buffer.byteLength(word, "utf8") > maxBytes) {
        throw new Error("Trecho muito longo");
      }

      current = word;
    } else {
      current = next;
    }
  }

  if (current) chunks.push(current);

  return chunks;
}

router.post("/", async (req, res) => {
  const { text } = req.body ?? {};

  if (
    typeof text !== "string" ||
    !text.trim() ||
    text.length > 3000
  ) {
    return res.status(400).json({
      message: "Descrição inválida."
    });
  }

  const originalText = text.trim();

  const hash = createHash("sha256")
    .update(`en|pt-BR|${originalText}`)
    .digest("hex");

  try {
    // Primeiro procura uma tradução no Supabase
    const cached = await pool.query(
      `SELECT translated_text
       FROM book_translations
       WHERE content_hash = $1`,
      [hash]
    );

    if (cached.rows.length > 0) {
      return res.json({
        translatedText: cached.rows[0].translated_text,
        cached: true
      });
    }

    // Se não existe, consulta o MyMemory
    const chunks = splitText(originalText);
    const translatedChunks = [];

    for (const chunk of chunks) {
      const url = new URL(
        "https://api.mymemory.translated.net/get"
      );

      url.searchParams.set("q", chunk);
      url.searchParams.set("langpair", "en|pt-BR");

      const response = await fetch(url, {
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error("Serviço de tradução indisponível");
      }

      const data = await response.json();

      if (
        Number(data.responseStatus) !== 200 ||
        data.quotaFinished ||
        typeof data.responseData?.translatedText !== "string"
      ) {
        throw new Error(
          data.responseDetails || "Limite ou falha na tradução"
        );
      }

      translatedChunks.push(
        data.responseData.translatedText
      );
    }

    const translatedText = translatedChunks.join(" ");

    // Salva para reutilizar nas próximas visitas
    await pool.query(
      `INSERT INTO book_translations
        (content_hash, original_text, translated_text,
         source_language, target_language)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (content_hash) DO NOTHING`,
      [
        hash,
        originalText,
        translatedText,
        "en",
        "pt-BR"
      ]
    );

    return res.json({
      translatedText,
      cached: false
    });

  } catch (error) {
    console.error("Erro de tradução:", error.message);

    return res.status(502).json({
      message: "Tradução indisponível. Tente novamente."
    });
  }
});

export default router;
