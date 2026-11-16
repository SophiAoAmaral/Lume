import React from 'react'
import genero from '../objetos/Generos.jsx'
import { useNavigate } from 'react-router';

export const Explorar = () => {
    const navigate = useNavigate()
   
  return (
    <section>
      <h2>Qual é a sua vibe hoje?</h2>
      <div className='grid grid-cols-3 gap-10'>
          {genero.map((genero) => (
            <div
              key={genero.nome}
              onClick={() =>
                navigate(`/busca?genero=${encodeURIComponent(genero.assunto)}`)
              }
              className="cursor-pointer rounded-xl border p-5 flex  bg-white justify-between"
            >
              <div className='flex flex-col gap-3'>
                  <span className='text-sm font-bold'>{genero.nome}</span>
                  <h3 className='text-lg '>{genero.descricao}</h3>
                  <span className='text-sm block mt-2'>Explorar</span>
              </div>
              <img src={genero.img} alt="" className='w-45 object-cover' />
            </div>
          ))}
      </div>
    </section>
  );
}
