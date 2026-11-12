import React, { useState } from 'react'
import logo from '/logo.png?url'
import { Link } from 'react-router'
import { Search } from "lucide-react";

export const Header = () => {
    const [islogded, setIslogded] = useState(false);
    const [input, setInput] = useState(false);
    function handleClick(){
        setInput(true)
    }
  return (
    <header className='container flex justify-between mt-7 items-center'>
        <img src={logo} alt="" className='w-40 object-contain' />
        <nav >
            <ul className='flex gap-6'>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='explorar'>Explorar</Link>
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

    </header>
  )
}
