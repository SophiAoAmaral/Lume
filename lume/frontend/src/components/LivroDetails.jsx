import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { addBookToLibrary } from "../services/library";
import { Heart } from "lucide-react";

import { getFavorites,addFavorite, removeFavorite,} from "../services/favorites";
import { ChevronDown, Bookmark, BookOpen, CheckCircle } from "lucide-react";

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

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
};



async function handleFavorite() {
  if (!user || !book || favoriteLoading) return;

  setFavoriteLoading(true);

  try {
    if (isFavorite) {
      await removeFavorite(id);
      setIsFavorite(false);
      setNotification("Livro removido dos favoritos!");
    } else {
      const result = await addFavorite({
        bookId: id,
        title: book.title,
        author,
        coverId: book.covers?.find((id) => id > 0) ?? null
      });

      console.log("Favorito salvo:", result);

      setIsFavorite(true);
      setNotification("Livro adicionado aos favoritos!");
    }
  } catch (error) {
    console.error("Erro ao favoritar:", error);
    setNotification(error.message);
  } finally {
    setFavoriteLoading(false);
  }
}



  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification]);

  



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


useEffect(() => {
  if (!user || !id) {
    setIsFavorite(false);
    return;
  }

  let active = true;

  async function checkFavorite() {
    try {
      setIsFavorite(false);

      const favorites = await getFavorites();

      if (active) {
        setIsFavorite(
          favorites.some((item) => item.book_id === id)
        );
      }
    } catch (error) {
      console.error("Erro ao consultar favoritos:", error);
    }
  }

  checkFavorite();

  return () => {
    active = false;
  };
}, [id, user?.id]);


const cover = book?.covers?.find((id) => id > 0);

  if (loading) return <p className="text-center  mt-60 mb-90 text-3xl font-bold">Carregando livro...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!book) return null;
  return (
    <section className="mb-20">
       <button onClick={() => navigate(-1)} className=" ml-5 md:ml-90 block mt-10 cursor-pointer"> ← Voltar</button>
      <div className="container mt-15 ">
        <div>
          {cover && (
            <div className="flex md:flex-nowrap flex-wrap gap-20 ">
              <div className="md:ml-60 ml-3">
                <img
                  className="w-[300px] md:w-[280px] h-auto max-w-none object-contain rounded-lg ml-[15px]"
                  src={`https://covers.openlibrary.org/b/id/${cover}-L.jpg`}
                  alt={`Capa de ${book.title}`}
                />
              </div>
              <div className="flex flex-col gap-2">
                {notification && (
                  <p className="text-green-600" role="status">
                    {notification}
                  </p>
                )}
                <div className="flex justify-between  gap-20">
      
                  <h1 className="text-3xl font-semibold">{author || "Não informado"}</h1>
                  {user && (
                    <button
                      type="button"
                      onClick={handleFavorite}
                      disabled={favoriteLoading}
                      className="cursor-pointer"
                    >
                      <Heart
                        size={26}
                        color="#FF2C2C"
                        fill={isFavorite ? "#FF2C2C" : "none"}
                      />
                    </button>
                  )}
                </div>
                <div>
                  <p>
                    Publicado em: {book.first_publish_date || "Não informado"}
                  </p>
                  <div className=" flex gap-2 flex-wrap md:flex-nowrap my-2">
                    {book.subjects?.slice(1, 5).map((subject) => (
                      <span key={subject} className="p-2 rounded-3xl border text-xs font-medium">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                <p>
                  {typeof book.description === "string"
                    ? book.description
                    : book.description?.value || "Descrição indisponível."}
                </p>
                
<button
  type="button"
  onClick={handleOpenLibrary}
  className="bg-black text-white hover:bg-black/90 px-5 py-3 rounded-xl cursor-pointer mt-4 transition flex items-center gap-3"
>
  {status || "Adicionar à biblioteca"}
  <ChevronDown size={18} />
</button>

{showOptions && user && (
  <div className="flex flex-col mt-2 bg-white border border-[#E0DBD0] rounded-xl p-2 shadow-sm">

    <button
      type="button"
      disabled={saving}
      onClick={() => handleAddLibrary("quero_ler")}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F7F6F2] transition cursor-pointer text-left"
    >
      <Bookmark size={18} className="text-[#B75E45]" />
      Quero ler
    </button>

    <button
      type="button"
      disabled={saving}
      onClick={() => handleAddLibrary("lendo")}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F7F6F2] transition cursor-pointer text-left"
    >
      <BookOpen size={18} className="text-[#B75E45]" />
      Lendo
    </button>

    <button
      type="button"
      disabled={saving}
      onClick={() => handleAddLibrary("ja_li")}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F7F6F2] transition cursor-pointer text-left"
    >
      <CheckCircle size={18} className="text-[#B75E45]" />
      Já li
    </button>

  </div>
)}

              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
