import React from 'react';
import { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from "../services/favorites";
import { Link } from "react-router";
import { Heart } from "lucide-react";

export const Favoritos = () => {
   
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


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
    } catch (error) {
      setError(error.message);
    }
  }
    

  if (loading) return <p>Carregando favoritos...</p>;
  return (
    <section className='container mt-10'>
        <div className='grid grid-cols-4'>
       {books.map((book)=>(
            <Link to={`/livro/${book.book_id}`}>
            {book.cover_id ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                    alt={`Capa de ${book.title}`}
                    className="w-full h-[260px] object-contain rounded-lg"
                  />
                ) : (
                  <div className="h-[260px] bg-[#E8D9C8] rounded-lg ">
                    Sem capa
                  </div>
                )}
    
            </Link>
        
        
       ))}

       </div>
    </section>
  )
}
