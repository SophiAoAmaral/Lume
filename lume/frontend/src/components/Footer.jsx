import React from 'react';
import logo from '../../public/logo.png'
import { Link } from 'react-router';

export const Footer = () => {
  return (
    <footer className='border-2 border-black/10 mt-20'>
      <div className='container border-b border-black/10 flex justify-between p-5'>
        <div>
            <img src={logo} alt="logo" className='w-50 mb-4' />
            <p className='font-medium'>Historias boas nunca acabam por aqui.</p>
        </div>
        <div className='flex gap-20'>
          <div>
            <span className='text-black/60'>Navegar</span>
            <ul className='flex flex-col text-sm gap-2 **:hover:underline'>
              <a href='#home'></a>
              <Link to='/busca?tipo=explorar'>Explorar</Link>
              <Link to='/minha-biblioteca'>Minha Biblioteca</Link>
              <Link to='/favoritos'>Favoritos</Link>
            </ul>
          </div>


          <div className='flex flex-col gap-2'>
            <span className='text-black/60'>Dados</span>
            <p className='text-xs'>API Open Library</p>
            <span className='text-xs'>https://openlibrary.org/dev</span>
          </div>
        </div>
      </div>

    </footer>
  )
}
