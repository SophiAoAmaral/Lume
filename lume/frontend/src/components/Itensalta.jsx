import { useEffect, useState } from "react"
import semcapa from '../images/semcapa.png'
import { Link, useNavigate } from "react-router";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from 'react'

export const Itensalta = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

       async function handleFetch() {
         setLoading(true);
         const url = "https://openlibrary.org/trending/now.json?limit=15";
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


    const scrollRef = useRef(null);

function handleScroll(direction) {
  if (!scrollRef.current) return;

  scrollRef.current.scrollBy({
    left: direction === "left" ? -400 : 400,
    behavior: "smooth"
  });
}
    
return (
  <div className="mt-20">
    <div className=" flex justify-between items-center mb-4">
      <div>
        <span className="font-bold text-terracota-100 text-sm">Em alta esta semana</span>
        <h2 className="text-xl md:text-4xl font-medium mt-2">Tá todo mundo lendo.</h2>
      </div>
      <button onClick={() => navigate("/busca?tipo=trending")} className=" md:border md:py-2 md:px-4  rounded-xl cursor-pointer text-xs" >Ver Todos</button>
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
      
<div className="relative">

  <div className="flex justify-end gap-2 mb-3">
    <button
      type="button"
      onClick={() => handleScroll("left")}
      aria-label="Voltar livros"
      className="p-2 border border-gray-300 rounded-full hover:bg-[#E8D9C8] cursor-pointer transition"
    >
      <ChevronLeft size={20} />
    </button>

    <button
      type="button"
      onClick={() => handleScroll("right")}
      aria-label="Próximos livros"
      className="p-2 border border-gray-300 rounded-full hover:bg-[#E8D9C8] cursor-pointer transition"
    >
      <ChevronRight size={20} />
    </button>
  </div>

  <div
    ref={scrollRef}
    className="flex gap-5 overflow-x-auto pb-3 pt-4 scroll-smooth
               [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    {data.map((item) => {
      const coverId = item.cover_i ?? item.cover_id;

      return (
        <Link
          to={`/livro/${item.key.split("/").pop()}`}
          key={item.key}
          className="w-[150px] shrink-0 flex flex-col"
        >
          <img
            src={
              coverId
                ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
                : semcapa
            }
            alt={item.title}
            className="w-full h-[220px] object-cover rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 cursor-pointer"
          />

          <h3 className="font-medium line-clamp-1 mt-3">
            {item.title}
          </h3>

          <span className="text-sm text-gray-500 mt-2 line-clamp-1">
            {Array.isArray(item.author_name)
              ? item.author_name.join(", ")
              : item.author_name || "Autor desconhecido"}
          </span>
        </Link>
      );
    })}
  </div>

</div>

    )}
  </div>
);};