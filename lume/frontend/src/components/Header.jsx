import React, { useState } from 'react'
import logo from '/logo.png?url'
import { Link, NavLink } from 'react-router'
import { Search } from "lucide-react";

export const Header = () => {
    const [islogded, setIslogded] = useState(false);
    const [input, setInput] = useState(false);
    function handleClick(){
        setInput(true)
    }
  return (
    <header className='border-b border-gray-300 font-display'>
    <div className='container flex justify-between my-5 items-center '>
        <Link to='/'><img src={logo} alt="" className='w-40 object-contain' /></Link>
        <nav >
            <ul className='flex gap-6 '>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <NavLink to='/busca?tipo=explorar'>Explorar</NavLink>
                </li>
                <li>
                    <Link to='minhabiblioteca'>Minha Biblioteca</Link>
                </li>
                <li>
                    <Link to='favoritos'>Favoritos</Link>
                </li>
            </ul>
        </nav>
        <div className='flex gap-5 items-center'>
            <div>
                <button onClick={handleClick} className=' bg-salvia-100 p-2 rounded-2xl'>
                    {input ?
                    <input type="text"  className='border rounded-md border-gray-400 '/>
                    :
                    <Search size={17} strokeWidth={2} color="#242424" />
                
                    }
                </button>

            </div>
            
            <Link>{islogded ? 'Sua conta' : 'Criar conta' }</Link>
        </div>

    </div>
    </header>
  )
}
