import React from 'react'
import { useEffect, useState } from 'react'
import {Link} from 'react-router'
import { getMyLibrary } from '../services/library'
import semcapa from '../images/semcapa.png'

export const MyLibrary = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
      if (loading) return <p>Carregando biblioteca...</p>;
      if (error) return <p>{error}</p>;


  return (
    <section className='mt-5 flex flex-col items-center justify-center gap-5 container '>
      {books.length === 0 ? (
        <p>Você ainda não adicionou nenhum livro.</p>
      ) : (
        <div className='grid grid-cols-4 mt-10 gap-20'>
          {books.map((book) => (
            <Link key={book.book_id} to={`/livro/${book.book_id}`}>
              {book.cover_id ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                  alt={book.title}
                  className=" object-contain rounded-lg"
                />
              ) : (
                <div className="w-[180px] h-[260px] bg-[#E8D9C8] rounded-lg flex items-center justify-center">
                  Sem capa
                </div>
              )}

              <h2>{book.title}</h2>
               <p className="">
                {book.author || "Autor desconhecido"}
              </p>

              <span className="text-sm text-[#B75E45]">
                {book.status === "quero_ler"
                  ? "Quero ler"
                  : book.status === "lendo"
                    ? "Lendo"
                    : "Já li"}
              </span>

            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
