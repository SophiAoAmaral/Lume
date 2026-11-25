import React, { useState } from 'react'
import logo from '/logo.png?url'
import { Link, NavLink, useNavigate } from 'react-router'
import {  LogOut } from "lucide-react";
import { useUser } from '../context/UserContext';
import { logout } from '../services/login';

export const Header = () => {
    const [islogded, setIslogded] = useState(false);
    const [input, setInput] = useState(false);
    const {user, loading, setUser} = useUser();
    const [menuAberto, setMenuAberto] = useState(false)
    const navigate = useNavigate()

    function handleClick(){
        setInput(true)
    }

    async function handleLogout() {
        try{
            await logout();
            setUser(null);
            navigate("/");
        }catch(err){
            console.error(err)
        }
    }


  return (
    <header className="border-b border-gray-300 font-display">
      <div className="container flex  justify-between my-5 items-center ">
        <Link to="/">
          <img src={logo} alt="" className="w-40 object-contain" />
        </Link>
        <nav>
          <ul className="hidden md:flex gap-6 flex-wrap">
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <NavLink to="/busca?tipo=explorar">Explorar</NavLink>
            </li>
            <li>
              <Link to="/minha-biblioteca">Minha Biblioteca</Link>
            </li>
            <li>
              <Link to="/favoritos">Favoritos</Link>
            </li>
          </ul>
        </nav>
        <div className=" hidden md:flex gap-5 items-center">
          
          {loading ? (
            <span>Carregando...</span>
          ) : user ? (
            <div className='flex gap-5 items-center'>
                <span>Olá, {user.name}!</span>
                <button 
                type='button'
                onClick={handleLogout}
                className=' py-2 px-4 flex items-center gap-2 rounded-2xl bg-terracota-100 text-white cursor-pointer'>
                    Sair 
                    <LogOut size={20} color="#FFFF" />
                </button>
            </div>
          ) : (
            <div>
              <Link to="/login">Entrar</Link>
            </div>
          )}
        </div>
        
        <div className='flex md:hidden'>{user ?  <span>Olá, {user.name}!</span> : ''}</div>

        <button
            className='md:hidden flex flex-col gap-1 '
            onClick={() => setMenuAberto(!menuAberto)}>
            <span className='w-6 h-0.5 bg-black'></span>
            <span className='w-6 h-0.5 bg-black'></span>
            <span className='w-6 h-0.5 bg-black'></span>
        </button>

        {menuAberto && (
            <ul className='md:hidden text-center md:text-start absolute top-16 right-0 bg-surface text-ink rounded-xl shadow-lg p-6 flex flex-col gap-4 min-w-48 bg-white z-50'>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <NavLink to="/busca?tipo=explorar">Explorar</NavLink>
            </li>
            <li>
              <Link to="/minha-biblioteca">Minha Biblioteca</Link>
            </li>
             <li>
              <Link to="/favoritos">Favoritos</Link>
            </li>
            {loading ? (
            <span>Carregando...</span>
          ) : user ? (
            <div className='flex justify-center'>
  
                <button 
                type='button'
                onClick={handleLogout}
                className=' py-2 px-4 flex items-center gap-2 rounded-2xl bg-terracota-100 text-white cursor-pointer'>
                    Sair 
                    <LogOut size={20} color="#FFFF" />
                </button>
            </div>
          ) : (
            <div className='flex justify-center'>
              <Link to="/login" className='py-2 px-4 flex items-center gap-2 rounded-2xl bg-terracota-100 text-white cursor-pointer'>Entrar</Link>
            </div>
          )}
            </ul>          
        )}
      </div>
    </header>
  );
}
