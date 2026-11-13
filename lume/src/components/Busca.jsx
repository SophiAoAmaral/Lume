import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'





export const Busca = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')

     const [searchParams] = useSearchParams();
     const query = searchParams.get("q");



async function handleFetch() {
  setLoading(true);
  setError(false);
  setMessage("");

  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const json = await response.json();

    setData(Array.isArray(json.docs) ? json.docs : []);

  } catch (err) {
    console.error(err);

    setError(true);
    setMessage("Não foi possível buscar os livros. Tente novamente.");
    setData([]);

  } finally {
    setLoading(false);
  }
}
console.log(data)

useEffect(()=>{
    handleFetch()
    console.log(data)
},[]);


  return (
    <section className="container mt-5">
        {error ? '' : <h1>Resultados para : {query}</h1>}
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
        <div className="grid grid-cols-4 gap-5  mt-10">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="w-[150px] shrink-0">
              <div className="h-[270px] rounded-lg bg-stone-200 animate-pulse" />
              <div className="mt-3 h-4 rounded bg-stone-200 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className=" grid grid-cols-4 gap-5 mt-10">
          {data.map((data) => (
            <div key={data.key} className='w-[220px]'>
              <img
                src={`https://covers.openlibrary.org/b/id/${data.cover_i}-M.jpg`}
                alt={data.title}
                className="w-full h-[290px] object-cover rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer"
              />
              <h1>{data.title}</h1>
              <span>{data.author_name}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
