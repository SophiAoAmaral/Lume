import React from 'react';
import { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from "../services/favorites";
import { Link, useNavigate } from "react-router";
import { Heart } from "lucide-react";

export const Favoritos = () => {
   
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("")
const navigate = useNavigate()

useEffect(() => {
  let active = true;

  async function fetchFavorites() {
    try {
      const favorites = await getFavorites();

      if (active) {
        setBooks(favorites);
      }
    } catch (error) {
      if (active) {
        setError(error.message);
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  fetchFavorites();

  return () => {
    active = false;
  };
}, []);


  async function handleRemoveFavorite(bookId) {
    try {
   await removeFavorite(bookId);
      setBooks((previous) =>
        previous.filter((book) => book.book_id !== bookId)
      );
      setMessage("Livro removido com sucesso!")
    } catch (error) {
      setError(error.message);
    }
  }
      useEffect(() => {
        if (!message) return;
    
        const timer = setTimeout(() => {
          setMessage("");
        }, 2000);
    
        return () => clearTimeout(timer);
      }, [setMessage]);



  if (loading) return <p className='text-center mt-50 md:h-[40vh] h-[30vh] text-xl md:text-3xl'>Carregando favoritos...</p>;
  if (error) return  <div className='h-[71vh]  md:flex items-center justify-center flex-col gap-3' >
        <p className='text-center  text-2xl '>{error}</p>
         <Link to="/login" className='py-2 px-4 flex items-center gap-2 rounded-2xl bg-terracota-100 hover:bg-terracota-100/70 text-white cursor-pointer'>Entrar</Link>
        </div>;
  return (
    <section className='text-center md:text-start'>
        <button onClick={() => navigate(-1)} className="ml-5 md:ml-90 block mt-10 cursor-pointer"> ← Voltar</button>
      <section className='container flex flex-col items-center md:justify-center gap-5 mt-10 '>
        {message && (
                <div
                  role="status"
                  className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-5"
                >
                  {message}
                </div>
              )}
        {books.length === 0 ? (
          <p className='text-xl md:text-2xl md:h-[40vh] h-[30vh] mt-20 md:mt-50 text-center'>Você ainda não adicionou nenhum livro.</p>
        ) : (
          <div className='mb-30'>
            {message && (
                <div
                  role="status"
                  className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-5"
                >
                  {message}
                </div>
              )}
            <h1 className='text-center text-2xl font-semibold '>Seus favoritos</h1>
            <div className='grid md:grid-cols-4 mt-15 gap-3'>
      
      
                   {books.map((book)=>(
                <article className='text-center md:text-start flex flex-col items-center md:block'>
                  <Link to={`/livro/${book.book_id}`} className='md:w-[260px]'>
                  {book.cover_id ? (
                        <img
                          src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                          alt={`Capa de ${book.title}`}
                          className="md:h-[260px]  object-contain rounded-lg"
                        />
                      ) : (
                        <div className="md:h-[260px] bg-[#E8D9C8] rounded-lg ">
                          Sem capa
                        </div>
                      )}
                      <h1 className='text-xl my-1 mt-3 md:mt-0' >{book.title}</h1>
                      <span className=' text-black/70'>{book.author}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemoveFavorite(book.book_id)}
                    title="Remover da biblioteca"
                    aria-label={`Remover ${book.title} da biblioteca`}
                    className=" text-sm mt-4 cursor-pointer flex gap-3 rounded-3xl"
                  >
                    Remover dos favoritos
                  </button>
      
                </article>
      
      
                   ))}
      
                   </div>
          </div>
        )}
      </section>
    </section>
  )
}
