import React, { useState, useEffect } from 'react'
import { Link } from 'react-router';
import tumb from '../images/tumb.png'

export const Home = () => {
    const [data, setData] = useState({})

   async function handleFetch(){
        const url = "https://openlibrary.org/search.json?q=python&page=2&limit=10";
        try{
        const response = await fetch(url);
        const json =  await response.json()
        setData(json)
        console.log(json)
        }catch(err){
            console.log(err)
        }
    }



    
  return (

        <section className='container'>
            <div  className='grid grid-cols-2'>
                <div >
                    <span>Descoberta de livros</span>
                    <h1>Sua próxima obsessão começa aqui.</h1>
                    <p>Descubra histórias incríveis, encontre novas perspectivas e transforme sua próxima leitura em uma experiência.</p>
                    <div className='border border-gray-400 w-[75%]  flex gap-2 rounded-2xl p-1 bg-white'>
                        <input type="text"  placeholder='Busque pelo titulo ' className=' w-[90%] p-3 '/>
                        <button className='bg-black text-white px-5 py-2 rounded-2xl cursor-pointer'>Buscar</button>
                    </div>

                    <div>
                        <ul>
                            <span>Populares</span>
                            <Link></Link>
                        </ul>
                    </div>
                </div>

                <div>
                 <img src={tumb} alt="" />
                </div>
            </div>
        </section>
    
  )
}
