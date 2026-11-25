import React from 'react';
import logo from '../../public/logo.png'
import { Link } from 'react-router';

export const Footer = () => {
  return (
    <footer className='border-2 border-black/10  '>
      <div className='container border-b border-black/10 flex flex-wrap md:flex-nowrap md:justify-between p-5 items-center justify-center'>
        <div>
            <img src={logo} alt="logo" className='w-50 mb-4' />
            <p className='font-medium text-xs md:text-base'>Historias boas nunca acabam por aqui.</p>
        </div>
        <div className='flex gap-10 md:gap-20 flex-wrap mt-5'>
          <div>
            <span className='text-black/60'>Navegar</span>
            <ul className='flex flex-col text-sm gap-2 **:hover:underline'>
              <a href='#home'></a>
              <Link to='/busca?tipo=explorar'>Explorar</Link>
              <Link to='/minha-biblioteca'>Minha Biblioteca</Link>
              <Link to='/favoritos'>Favoritos</Link>
            </ul>
          </div>


          <div className='flex flex-col gap-2 flex-wrap'>
            <span className='text-black/60'>Dados</span>
            <p className='text-xs'>API Open Library</p>
            <span className='text-xs'>https://openlibrary.org/dev</span>
          </div>
        </div>
      </div>

    </footer>
  )
}
