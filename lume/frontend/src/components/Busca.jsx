import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import semcapa from '../images/semcapa.png'
import { Link } from 'react-router'





export const Busca = () => {
    const [loading, setLoading] = useState(false)
    
    const [data, setData] = useState([])
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const tipo = searchParams.get("tipo");
    const genero = searchParams.get("genero");
    const navigate = useNavigate()

    const nomesGeneros = {
      romance: "Romance",
      fantasy: "Fantasia",
      horror: "Terror",
      humor: "Humor",
      thriller: "Suspense",
      philosophy: "Reflexão",
    };


    let titulo = "";

    if (tipo === "trending") {
      titulo = "Livros em alta nesta semana";
    } else if(tipo === "explorar"){
       titulo = "Explore novos livros"
    }else if (genero) {
      titulo = `Resultados para: ${nomesGeneros[genero] || genero}`;
    } else if (query) {
      titulo = `Resultados para: ${query}`;
    };





async function handleFetch() {
  setLoading(true);
  setError(false);
  setMessage("");

 let url;

 if (tipo === "trending") {
   url = "https://openlibrary.org/trending/weekly.json?limit=40";
 }else if( tipo === 'explorar') {
  url = "https://openlibrary.org/search.json?q=fiction&limit=40"
 }else if (genero) {
   url = `https://openlibrary.org/search.json?subject=${encodeURIComponent(genero)}&limit=40`;
 } else if (query) {
   url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=40`;
 } else {
   setData([]);
   setLoading(false);
   return;
 }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

   const json = await response.json();

   const livros = tipo === "trending" ? json.works : json.docs;

   setData(Array.isArray(livros) ? livros : []);

  } catch (err) {
    console.error(err);

    setError(true);
    setMessage("Não foi possível buscar os livros. Tente novamente.");
    setData([]);

  } finally {
    setLoading(false);
  }
}


useEffect(()=>{
    handleFetch()
},[query, tipo, genero]);


  return (
    <div className='mb-10'>
        <button onClick={() => navigate(-1)} className=" ml-5 md:ml-90 block mt-10 cursor-pointer"> ← Voltar</button>
      <section className="container mt-5 flex flex-col items-center justify-center gap-5">
      
        {error ? "" : <h1 className='text-2xl font-semibold'>{titulo}</h1>}
        {error && (
          <div
            role="alert"
            className="mt-10 rounded-lg bg-red-50 p-5 text-red-700"
          >
            <h2 className="font-semibold">Ops! Algo deu errado.</h2>
            <p className="mt-2">{message}</p>
          </div>
        )}
        {loading ? (
          <div className="grid md:grid-cols-4 mt-10 gap-20">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="w-[220px] shrink-0">
                <div className="h-[290px] rounded-lg bg-stone-200 animate-pulse" />
                <div className="mt-3 h-4 rounded bg-stone-200 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className=" grid md:grid-cols-4 mt-10 gap-15">
            {data.map((data) => (
              <Link
                key={data.key}
                to={`/livro/${data.key.split("/").pop()}`}
                className="w-[220px] border-b border-black/30 pb-10 md:pb-0 md:border-0"
              >
                <img
                  src={
                    (data.cover_i ?? data.cover_id)
                      ? `https://covers.openlibrary.org/b/id/${data.cover_i}-M.jpg`
                      : semcapa
                  }
                  alt={data.title}
                  className="w-full h-[290px] object-cover rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer"
                />
                    <h1 className='text-lg font-medium mt-3'>{data.title}</h1>
                <span className='text-sm text-black/76'>
                  {data.author_name?.join(", ").length > 30
                    ? data.author_name.join(", ").slice(0, 30) + "..."
                    : data.author_name?.join(", ")}
                </span>
      
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
