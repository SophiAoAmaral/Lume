import { useEffect, useState } from "react"
import React from 'react'

export const Itensalta = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

       async function handleFetch() {
         setLoading(true);
         const url = "https://openlibrary.org/trending/now.json?limit=10";
         try {
           const response = await fetch(url);
           const json = await response.json();
           setData(json.works);

           localStorage.setItem(
             "livrosEmAlta",
             JSON.stringify({
               books: json.works,
               timestamp: Date.now(),
             }),
           );
         } catch (err) {
           console.log(err);
         } finally {
           setLoading(false);
         }
       }

    useEffect(()=>{
        handleFetch()
    },[])

    
return (
  <div className="mt-20">
    {loading ? (
     
      <div className="flex gap-5 overflow-hidden">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="w-[150px] shrink-0">
            <div className="h-[220px] rounded-lg bg-stone-200 animate-pulse" />
            <div className="mt-3 h-4 rounded bg-stone-200 animate-pulse" />
          </div>
        ))}
      </div>
    ) : (
      // Quando terminar de carregar
      <div className="flex gap-5 overflow-x-auto ">
        {data.map((item) => (
          <div key={item.key} className="w-[150px] shrink-0">
            <img
              src={`https://covers.openlibrary.org/b/id/${item.cover_i ?? item.cover_id}-M.jpg`}
              alt={item.title}
              className="w-full h-[220px] object-cover rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer"
            />

            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    )}
  </div>
)};