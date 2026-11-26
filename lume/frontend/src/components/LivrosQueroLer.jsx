import React, { useState, useEffect } from "react";
import { getMyLibrary } from "../services/library";
import { useUser } from "../context/UserContext";
import { Link } from "react-router";

export const LivrosMomento = () => {
  const [booksLendo, setBooksLendo] = useState([]);
  const [booksprox, setBooksProx] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState();
  const { user } = useUser();
  useEffect(() => {
    async function livrosLendo() {
      try {
        const data = await getMyLibrary();
        const filtroLivros = data.filter((book) => book.status === "lendo");
        setBooksLendo(filtroLivros);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    livrosLendo();
  }, []);
 

  useEffect(() => {
    async function proximosLirvos() {
      try {
        const data = await getMyLibrary();
        const filtroLivros = data.filter((book) => book.status === "quero_ler");
        setBooksProx(filtroLivros);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    proximosLirvos();
  }, []);

  return (
    <section className="mt-20 mb-10 ">
      <span className="text-terracota-100 text-sm font-bold">
        Sua biblioteca
      </span>
      <div>
        <h1 className="text-3xl mt-2 font-semibold">Seu universo literário</h1>
        <span></span>
      </div>

      {user ? (
        <div className="grid grid-cols-2 gap-20 mt-10">
          <article className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Estou lendo</h2>

              <span className="text-sm text-gray-500">
                {booksLendo.length} livros
              </span>
              
            </div>
            {booksLendo.length == 0 ? <h1 className ='text-center'>Adicione livros a sua biblioteca</h1> : ''}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {booksLendo.map((book) => (
                <Link
                  to={`/livro/${book.book_id}`}
                  key={book.book_id}
                  className="flex items-center gap-4 p-3
                   bg-[#F7F6F2] rounded-xl
                   hover:shadow-md hover:-translate-y-1
                   transition-all duration-300"
                >
                  <img
                    src={
                      book.cover_id
                        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
                        : semcapa
                    }
                    alt={`Capa de ${book.title}`}
                    className="w-[85px] h-[125px] object-cover
                     rounded-md shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#242424] line-clamp-2">
                      {book.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {book.author || "Autor desconhecido"}
                    </p>

                    <span
                      className="inline-block mt-3 text-xs
                           text-[#B75E45] font-medium"
                    >
                      Lendo agora
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </article>

          <article className="bg-white rounded-2xl p-6">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Proximas leituras</h2>
              <span className="text-sm text-gray-500">
                {booksprox .length} livros
              </span>
              
            </div>
               {booksprox.length == 0 ? <h1 className ='text-center'>Adicione livros a sua biblioteca</h1> : ''}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {booksprox.map((book) => (
                <Link
                  to={`/livro/${book.book_id}`}
                  key={book.book_id}
                  className="flex items-center gap-4 p-3
                   bg-[#F7F6F2] rounded-xl
                   hover:shadow-md hover:-translate-y-1
                   transition-all duration-300"
                >
                  <img
                    src={
                      book.cover_id
                        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
                        : semcapa
                    }
                    alt={`Capa de ${book.title}`}
                    className="w-[85px] h-[125px] object-cover
                     rounded-md shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#242424] line-clamp-2">
                      {book.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {book.author || "Autor desconhecido"}
                    </p>

                    <span
                      className="inline-block mt-3 text-xs
                           text-[#B75E45] font-medium"
                    >
                      Lendo agora
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        </div>
      ) : (
        <article className="bg-white text-center py-15 rounded-xl mt-6">
          <h1 className="mb-5 text-xl font-semibold">Entre ou crie uma conta para ter acesso aos seus dados</h1>
          <Link to="/login" className="bg-terracota-100 text-white py-2 px-4 rounded-xl hover:bg-terracota-100/70 transition ">Entrar</Link>
        </article>
      )}
    </section>
  );
};
