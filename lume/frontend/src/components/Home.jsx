import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router';
import tumb from '../images/tumb.png'
import { Search } from "lucide-react";
import { Itensalta } from './Itensalta';
import { Explorar } from './Explorar';
import { LivrosMomento } from './LivrosQueroLer';

export const Home = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const sugestoes = [
      { nome: "Clarice Lispector", busca: "Clarice Lispector" },
      { nome: "Ficção científica", busca: "Ficção científica" },
      { nome: "Literatura brasileira", busca: "Literatura brasileira" },
      { nome: "Romance histórico", busca: "Romance histórico" },
    ];

    function handleSubmit(e){
        e.preventDefault();

        try{
            navigate(`/busca?q=${encodeURIComponent(search.trim())}`)
        }catch(err){
            console.log(err)
        }
    }



    
  return (

        <section className='container' id='home'>
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
                        <span className='mb-2 block'>Populares: </span>
                        <div className='flex flex-wrap gap-2'>
                            {sugestoes.map((item)=>(
                                <button
                                key={item.nome}
                                onClick={()=>  navigate(`/busca?q=${encodeURIComponent(item.busca)}`)}
                                className='cursor-pointer border border-[#E0DBD0] text-[#3F3D39] py-2 px-4 rounded-xl text-sm hover:bg-terracota-100 hover:text-white transition my-1 mr-1 '
                                >
                                    {item.nome}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                 <img src={tumb} alt="" />
                </div>

            </div>


            <Itensalta/>


            <Explorar/>

            <LivrosMomento/>
        </section>
    
  )
}
