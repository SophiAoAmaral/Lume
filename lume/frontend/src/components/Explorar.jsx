import React from 'react'
import genero from '../objetos/Generos.jsx'
import { useNavigate } from 'react-router';

export const Explorar = () => {
    const navigate = useNavigate()
   
  return (
    <section className='mt-20'>
        <span className='font-bold text-sm text-terracota-100 text-center md:text-start block'>Explorar por gênero</span>
      <h2 className='text-3xl mt-2  mb-5 font-bold text-center md:text-start '>Qual é a sua vibe hoje?</h2>
      <div className='grid md:grid-cols-3 gap-10'>
          {genero.map((genero) => (
            <div
              key={genero.nome}
              onClick={() =>
                navigate(`/busca?genero=${encodeURIComponent(genero.assunto)}`)
              }
              className="cursor-pointer rounded-xl border border-gray-500/30 p-5 flex gap-5 md:gap-0 bg-white justify-between hover:shadow-xl"
            >
              <div className='flex flex-col gap-3'>
                  <span className='text-xs font-semibold text-black/60'>{genero.nome}</span>
                  <h3 className='md:text-lg text-sm font-bold'>{genero.descricao}</h3>
                  <span className='text-sm block mt-2 text-terracota-100 font-semibold'>Explorar</span>
              </div>
              <img src={genero.img} alt="" className='w-30 md:w-45 md:object-cover object-contain' />
            </div>
          ))}
      </div>
    </section>
  );
}
