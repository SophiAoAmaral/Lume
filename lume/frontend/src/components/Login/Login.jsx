import React, { useState, useEffect } from 'react'
import {useNavigate, Link} from 'react-router'
import logo from '../../../public/logo.png'
import { login } from '../../services/login';
import { useUser } from '../../context/UserContext';
import { useLocation } from 'react-router';


export const Login = () => {
  const navigate = useNavigate();
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [loading, setLoading ]  = useState(false);
  const [error, setError] = useState("");
  const {setUser} = useUser();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState(
  location.state?.message || ""
);


 async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    setError("");
     console.time("Tempo do login");

    try{
      const data = await login(email, password);
      console.log("Usuario autenticado: ", data.user);
      setUser(data.user);
      navigate("/");
    }catch(err){
        setError(err.message)
      
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
  if (!error) return;

  const timer = setTimeout(() => {
    setError("");
  }, 7000);

  return () => clearTimeout(timer);
}, [error]);

useEffect(() => {
  if (!successMessage) return;

  const timer = setTimeout(() => {
    setSuccessMessage("");

    navigate(location.pathname, {
      replace: true,
      state: null
    });
  }, 5000);

  return () => clearTimeout(timer);
}, [successMessage, navigate, location.pathname]);


  return (
    <div className=" background">
      <section className="container md:pt-30 pt-15">
        <div className="flex flex-col items-center bg-white justify-center  md:w-130 mx-auto p-4 md:p-3 rounded-3xl">
          
          <Link to="/" className="pt-10">
            <img src={logo} alt="" className="w-50 mb-5 " />
          </Link>
          {successMessage && (
            <p className="text-green-600 text-xs text-center font-bold my-2" role="status" >
              {successMessage}
            </p>
          )}
          <h1 className="text-3xl font-bold text-center md:text-start">Que bom te ver de novo.</h1>
          <p className="text-black/50 mt-2 text-sm font-semibold">
            Entre para continuar de onde parou
          </p>

          <form action="" className="flex flex-col w-full p-2 md:p-0 md:w-100" onSubmit={handleSubmit}>
            <label htmlFor="email" className="block font-semibold text-sm mt-5">
              Email
            </label>
            <input
              type="text"
              id="email"
              placeholder='voce@email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              className={`${error ? "border-red-500" : "border-[#E0DBD0]"} border w-full md:w-100 rounded-2xl py-2 px-4 bg-white   outline-0 `}
            />

            <label
              htmlFor="password"
              className="block font-semibold text-sm mt-5"
            >
              Senha
            </label>
            <div
              className={` ${error ? "border-red-500" : "border-[#E0DBD0]"} w-full border border-[#E0DBD0] md:w-100 rounded-2xl py-2 px-4   outline-0  flex  `}
            >
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Mínimo de 8 caracteres"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-[100%] w-full outline-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-semibold"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <Link
              to="/esqueciminhasenha"
              className="block mb-5 mt-2 text-xs text-end text-terracota-200 font-semibold  self-end"
            >
              Esqueci minha senha
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="border w-full md:w-100 py-2 bg-black text-white rounded-2xl font-medium cursor-pointer mb-2"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            {error && (
              <p
                role="alert"
                className="text-center text-sm font-bold text-red-500"
              >
                {error}
              </p>
            )}
          </form>
          <span className="detail relative text-sm mt-3 text-black/50">ou</span>
          <button
            onClick={() => navigate("/")}
            className="bg-white border border-[#E0DBD0] font-medium w-full md:w-100 py-2 rounded-2xl mt-5 cursor-pointer"
          >
            Explorar sem conta
          </button>

          <p className="font-medium text-sm mt-4 text-black/50 pb-3">
            Ainda nao tem conta?{" "}
            <Link to="/cadastro" className="text-terracota-200 font-semibold">
              Criar conta
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
