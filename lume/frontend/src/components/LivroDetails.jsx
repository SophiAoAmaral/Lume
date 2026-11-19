import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

export const LivroDetails = () => {
    const {id} = useParams();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(()=>{
        const controller = new AbortController();


        async function getBook() {
            setLoading(true);
            setError("");
            setBook(null);

            try{
                if(!/^OL\d+W$/.test(id)){
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
            console.log("Dados completos do livro:", data);
            setBook(data);
        }catch(err){
            if (err.name !== "AbortError") {
          setError(err.message);
        }
        }finally{
        if (!controller.signal.aborted) {
          setLoading(false);
        }}}
        getBook();


}, [id]);

if(loading) return <p>Carregando livro...</p>
if (error) return <p role="alert">{error}</p>;
if (!book) return null;

const description =
    typeof book.description === "string"
      ? book.description
      : book.description?.value;

  const cover = book.covers?.[0];


    
  return (
    <div>
    {cover && (
          <img
            className="book-cover"
            src={`https://covers.openlibrary.org/b/id/${cover}-L.jpg`}
            alt={`Capa de ${book.title}`}
          />
        )}

    </div>
  )
}
