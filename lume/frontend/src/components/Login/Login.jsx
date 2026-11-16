import React from 'react'
import {useNavigate, Link} from 'react-router'
import logo from '../../../public/logo.png'
import tumb from '../../images/fotologin.png'

export const Login = () => {
  const navigate = useNavigate()
  return (
    <section className="container">
      <div className="grid grid-cols-2 ">
        <div className='flex flex-col items-center'>
          <div >
            <img src={logo} alt="" className="w-40" />
          </div>
          <h1>Que bom te ver de novo.</h1>
          <p>Entre para continuar de onde parou</p>

          <form action="" className='flex flex-col'>
            <label htmlFor="email" className='block font-semibold text-sm mt-5'>Email</label>
            <input type="text" id="email" name="email" className='border w-100 rounded-2xl py-2 px-4 bg-white border-[#E0DBD0]'/>

            <label htmlFor="senha" className='block font-semibold text-sm mt-5'>Senha</label>
            <input type="password" name="" id=""  className='mb-7 border w-100 rounded-2xl py-2 px-4 bg-white border-[#E0DBD0]' />

            <button type='submit' className='border w-100 py-2 bg-black text-white rounded-2xl font-medium cursor-pointer mb-2'>Entrar</button>
          </form>
          <span className='detail relative text-sm mt-3 text-black/50'>ou</span>
          <button onClick={() => navigate("/")} className='bg-white border border-[#E0DBD0] font-medium w-100 py-2 rounded-2xl mt-5 cursor-pointer'>Explorar sem conta</button>

          <p>
            Ainda nao tem conta? <Link to="/criar">Criar conta</Link>
          </p>
        </div>
        <div className='bg-[#E8D9C8]'>
          <span>Sua biblioteca pessoal</span>
          <h2>Sua estante continua de onde você parou.</h2>
          <img src={tumb} alt="" />
        </div>
      </div>
    </section>
  );
}
