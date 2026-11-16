import { useEffect, useState } from "react"
import semcapa from '../images/semcapa.png'
import { Link, useNavigate } from "react-router";
import React from 'react'

export const Itensalta = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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


    console.log(data)
    
return (
  <div className="mt-20">
    <div className=" flex justify-between items-center mb-4">
      <div>
        <span className="font-bold text-terracota-100 text-sm">Em alta esta semana</span>
        <h2 className="text-4xl font-medium mt-2">Tá todo mundo lendo.</h2>
      </div>
      <button onClick={() => navigate()} className="border py-2 px-4 rounded-xl cursor-pointer" >Ver Todos</button>
    </div>
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
      <div className="flex gap-5 overflow-x-auto pb-3 pt-4">
        {data.map((item) => (
          <div key={item.key} className="w-[150px] shrink-0 flex flex-col ">
            <img
              src={
                item.cover_i ??  item.cover_id
                  ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
                  : semcapa
              }
              alt={item.title}
              className="w-full h-[220px] object-cover rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer"
            />

            <h3 className="font-medium  line-clamp-1  mt-3 ">{item.title}</h3>
            <span className="text-sm text-gray-500 mt-2 line-clamp-1">
              {item.author_name}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);};