import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router';
import tumb from '../images/tumb.png'
import { Search } from "lucide-react";
import { Itensalta } from './Itensalta';

export const Home = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate()

    function handleSubmit(e){
        e.preventDefault();

        try{
            navigate(`/busca?q=${encodeURIComponent(search.trim())}`)
        }catch(err){
            console.log(err)
        }
    }



    
  return (

        <section className='container'>
            <div  className='grid grid-cols-2 mt-20'>
                <div className='md:w-150 flex flex-col gap-3 mt-10'>
                    <span className='text-terracota-200 font-bold text-xs'>Descoberta de livros</span>
                    <h1 className='text-5xl font-bold'>Sua próxima obsessão começa aqui.</h1>
                    <p className='text-texto'>Descubra histórias incríveis, encontre novas perspectivas e transforme sua próxima leitura em uma experiência.</p>
                    <form onSubmit={handleSubmit} className='border border-gray-400 w-[75%]  flex gap-2 rounded-2xl p-1 bg-white '>
                        <Search size={25} strokeWidth={2} color="#242424" className='self-center ml-3' />
                        <input 
                         type="text" 
                         value={search}
                         onChange={(e) =>setSearch(e.target.value)} 
                         placeholder='Busque pelo titulo ' className=' w-[90%] p-3 outline-0'/>
                        <button type='submit' className='bg-black text-white px-5 py-2 rounded-2xl cursor-pointer'>Buscar</button>
                    </form>

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


            <Itensalta/>
        </section>
    
  )
}
