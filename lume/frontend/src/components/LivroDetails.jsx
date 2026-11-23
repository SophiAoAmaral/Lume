import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { addBookToLibrary } from "../services/library";

export const LivroDetails = () => {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [showOptions, setShowOptions] = useState(false);
  const [status, setStatus] = useState(null);
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function getBook() {
      setLoading(true);
      setError("");
      setBook(null);
      setAuthor("");

      try {
        if (!/^OL\d+W$/.test(id)) {
          throw new Error("Identificador inválido.");
        }

        const response = await fetch(
          `https://openlibrary.org/works/${id}.json`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Não foi possível carregar o livro.");
        }

        const data = await response.json();

        console.log("Dados do livro:", data);
        const authorKey = data.authors?.[0]?.author?.key;
        if (authorKey) {
          const authorResponse = await fetch(
            `https://openlibrary.org${authorKey}.json`,
            { signal: controller.signal },
          );

          if (authorResponse.ok) {
            const authorData = await authorResponse.json();

            console.log("Nome do autor:", authorData.name);

            if (!controller.signal.aborted) {
              setAuthor(authorData.name || "");
            }
          }
        }

        if (!controller.signal.aborted) {
          setBook(data);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getBook();

    return () => controller.abort();
  }, [id]);


async function handleAddLibrary(status) {
  if (!user) {
    navigate("/login", {
      state: {
        message: "Entre na sua conta para salvar livros."
      }
    });
    return;
  }

  if (!book || saving) return;

  setSaving(true);
  setNotification("");

  try {
    await addBookToLibrary({
      bookId: id,
      title: book.title,
      author,
      coverId: book.covers?.find((id) => id > 0) ?? null,
      status
    });

    const labels = {
      quero_ler: "Quero ler",
      lendo: "Lendo",
      ja_li: "Já li"
    };

    setStatus(labels[status]);
    setNotification("Livro salvo na sua biblioteca!");
    setShowOptions(false);

  } catch (error) {
    setNotification(
      error.message || "Não foi possível salvar o livro."
    );
  } finally {
    setSaving(false);
  }
}


  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification]);

  if (loading) return <p>Carregando livro...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!book) return null;

  const cover = book.covers?.find((id) => id > 0);

  function handleOpenLibrary() {
    if (!user) {
      navigate("/login", {
        state: {
          message: "Entre na sua conta para salvar livros.",
        },
      });
      return;
    }

    setShowOptions((prev) => !prev);
  }
  return (
    <section className="container mt-20">
      <div>
        {cover && (
          <div className="flex gap-20 ">
            <div className="ml-60">
              <img
                className=" w-[280px] h-auto max-w-none object-contain rounded-lg"
                src={`https://covers.openlibrary.org/b/id/${cover}-L.jpg`}
                alt={`Capa de ${book.title}`}
              />
            </div>

            <div>
              {notification && (
                <p className="library-notification" role="status">
                  {notification}
                </p>
              )}
              <h1>{book.title}</h1>
              <p>Autor: {author || "Não informado"}</p>

              <p>
                {typeof book.description === "string"
                  ? book.description
                  : book.description?.value || "Descrição indisponível."}
              </p>

              <button
                type="button"
                onClick={handleOpenLibrary}
                className="bg-[#B75E45]  px-5 py-3 rounded-xl cursor-pointer"
              >
                {status || "Adicionar à biblioteca"}
              </button>

              {showOptions && user && (
                <div className="flex flex-col gap-2 mt-2">
                  {showOptions && user && (
                    <div className="flex flex-col gap-2 mt-2">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleAddLibrary("quero_ler")}
                      >
                        Quero ler
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleAddLibrary("lendo")}
                      >
                        Lendo
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleAddLibrary("ja_li")}
                      >
                        Já li
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
