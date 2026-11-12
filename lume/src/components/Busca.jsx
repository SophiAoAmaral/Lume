import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'





export const Busca = () => {
    const [data, setData] = useState([])
     const [searchParams] = useSearchParams();
     const query = searchParams.get("q");



 async function handleFetch(){
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`;
    const response = await fetch(url);
    const data = await response.json();
    setData(data.docs)
}


useEffect(()=>{
    handleFetch()
},[]);


  return (
    <section>
        <h1>Resultados para : {query}</h1>
        {data.map((data)=>(
            <h1>{data.title}</h1>
        ))}
    </section>
  )
}
