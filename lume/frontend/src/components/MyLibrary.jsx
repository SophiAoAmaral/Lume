import React from 'react'
import { useEffect, useState } from 'react'
import {data, Link} from 'react-router'
import { getMyLibrary , removeBookFromLibrary } from '../services/library'
import semcapa from '../images/semcapa.png'
import { useNavigate } from 'react-router'

import { Trash2 } from "lucide-react";

export const MyLibrary = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState(null);
    const [message, setMessage] = useState("")
    const navigate = useNavigate()

    useEffect(()=>{
        async function fetchLibrary() {
            try{
                const data = await getMyLibrary();
                setBooks(data)
            }catch(err){
                setError(err.message)
            }
            finally{
                setLoading(false)
            }
        }
         fetchLibrary();
    }, []);
console.log(books)

    async function handleRemoveBook(bookId) {
  if (removingId) return;

  const confirmRemove = window.confirm(
    "Deseja remover este livro da sua biblioteca?"
  );

  if (!confirmRemove) return;

  setRemovingId(bookId);
  setError("");

  try {
    await removeBookFromLibrary(bookId);

    setBooks((previous) =>
      previous.filter((book) => book.book_id !== bookId)
    );
    setMessage("Livro removido da biblioteca com sucesso!!")

  } catch (error) {
    setError(error.message);
  } finally {
    setRemovingId(null);
  }
}

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [setMessage]);

  
      if (loading) return <p className='text-center mt-50 md:h-[40vh] h-[30vh] text-xl md:text-3xl'>Carregando biblioteca...</p>;
      if (error) return  <div className='h-[71vh]  md:flex items-center justify-center flex-col gap-3' >
      <p className='text-center  text-2xl '>{error}</p>
       <Link to="/login" className='py-2 px-4 flex items-center gap-2 rounded-2xl hover:bg-terracota-100/70 bg-terracota-100 text-white cursor-pointer'>Entrar</Link>
      </div>;


  return (
    <section className='md:mb-20 md:h-[70vh]'>
      <button onClick={() => navigate(-1)} className="md:ml-90 block mt-10 cursor-pointer ml-5"> ← Voltar</button>
      <section className="mt-5 flex flex-col items-center justify-center gap-5 container ">
      
        <div>
              {message && (
                <div
                  role="status"
                  className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-5"
                >
                  {message}
                </div>
              )}
            </div>
        {books.length === 0 ? (
          <p className="text-2xl h-[40vh] mt-50">
            Você ainda não adicionou nenhum livro.
          </p>
        ) : (
          <div className="">
            <h1 className="text-center text-2xl font-semibold">Sua biblioteca</h1>
      
            <div className="grid md:grid-cols-4 mt-5 md:mt-10 md:gap-20 gap-5">
              {books.map((book) => (
                <div className='md:border-0 border-b  border-black/20  p-5 flex flex-col items-center md:block'>
                  <Link
                    key={book.book_id}
                    to={`/livro/${book.book_id}`}
                    className="flex flex-col text-center items-center md:text-start"
                  >
                    {book.cover_id ? (
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                        alt={book.title}
                        className="w-[180px]  md:h-[260px] object-contain rounded-2xl"
                      />
                    ) : (
                      <div className="md:w-[180px] md:h-[260px] bg-[#E8D9C8] rounded-lg flex items-center justify-center">
                        Sem capa
                      </div>
                    )}
                    <span className="text-xs text-[#B75E45] font-semibold mt-3">
                      {book.status === "quero_ler"
                        ? "Quero ler"
                        : book.status === "lendo"
                          ? "Lendo"
                          : "Já li"}
                    </span>
                    <h2 className='text-xl mb-1'>{book.title}</h2>
                    <p className="text-sm text-black/70">{book.author || "Autor desconhecido"}</p>
      
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemoveBook(book.book_id)}
                    disabled={removingId === book.book_id}
                    title="Remover da biblioteca"
                    aria-label={`Remover ${book.title} da biblioteca`}
                    className="text-center  text-sm mt-2 cursor-pointer flex gap-3 rounded-xl text-red-500 border-red-500 border px-1 py-2 hover:text-red-500/50 hover:border-red-500/50"
                  >
                    Remover dos favoritos
                    <Trash2 size={20} color="" className='hover:text-red-500/50 ' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
