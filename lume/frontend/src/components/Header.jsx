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
      <div className="container flex justify-between my-5 items-center ">
        <Link to="/">
          <img src={logo} alt="" className="w-40 object-contain" />
        </Link>
        <nav>
          <ul className="flex gap-6 ">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <NavLink to="/busca?tipo=explorar">Explorar</NavLink>
            </li>
            <li>
              <Link to="minhabiblioteca">Minha Biblioteca</Link>
            </li>
            <li>
              <Link to="favoritos">Favoritos</Link>
            </li>
          </ul>
        </nav>
        <div className="flex gap-5 items-center">
          
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
      </div>
    </header>
  );
}
