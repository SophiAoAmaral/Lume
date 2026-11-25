import React, { useState } from 'react'
import { BookOpen, ChartNoAxesColumnIncreasing, Heart} from "lucide-react";
import { Link, useNavigate } from 'react-router';
import logo from '../../../public/logo.png'
import { Eye, EyeOff } from "lucide-react";
import { register } from '../../services/login';

export const Cadastro = () => {

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()



async function handleRegister(e) {
  e.preventDefault();

  setLoading(true);
  setError(false);
  setErrors({});

  try {
    await register(name, email, password);

    navigate("/login", {
      state: {
        message: "Sua conta foi criada com sucesso!",
      },
    });

  } catch (error) {
    setError(true);

    if (Object.keys(error.errors || {}).length > 0) {
      setErrors(error.errors);
    } else {
      setErrors({
        general: error.message,
      });
    }

  } finally {
    setLoading(false);
  }
}



  return (
    <section className="background">
      <div className="container pt-30">
        <div className="bg-[#ffff] flex flex-col p-5 md:items-center justify-center md:w-130 m-auto rounded-3xl py-5">
          <Link>
            <img src={logo} alt="logo" className="md:w-50  w-40 m-auto md:m-0" />
          </Link>
          <h1 className="my-2 text-3xl font-bold  text-center md:text-start">
            Comece sua estante
          </h1>
          <p className="text-xs md:text-sm font-semibold text-black/60 mb-3 md:w-100 text-center px-3 md:px-0">
            Crie sua conta em menos de um minuto. Dá para ajustar tudo depois.
          </p>
          <form action="" className="flex flex-col " onSubmit={handleRegister}>
            <label htmlFor="name" className="label">
              Nome
            </label>
            <input
              type="text"
              name={name}
              id="nome"
              placeholder="Como voce quer ser chamado?"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className={` ${error ? "border-red-500" : "border-[#E0DBD0]"} border border-[#E0DBD0]  w-full md:w-100 rounded-2xl py-2 px-4   outline-0  `}
            />
            <label htmlFor="email" className="label">
              E-mail
            </label>
            <input
              type="text"
              name="email"
              id="email"
              required
              placeholder="voce@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={` ${error ? "border-red-500" : "border-[#E0DBD0]"} border border-[#E0DBD0] w-full md:w-100 rounded-2xl py-2 px-4   outline-0  `}
            />
            {errors.email && (
              <p className="text-xs mt-1 text-red-500 font-semibold" role="alert">
                {errors.email}
              </p>
            )}
            <label htmlFor="password" className="label">
              Senha
            </label>
            <div
              className={` ${error ? "border-red-500" : "border-[#E0DBD0]"} border border-[#E0DBD0] w-full md:w-100 rounded-2xl py-2 px-4   outline-0  flex  `}
            >
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Mínimo de 8 caracteres"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-[100%] outline-0"
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
            {errors.password && (
              <p className="text-xs mt-1 text-red-500 font-semibold" role="alert">
                {errors.password}
              </p>
            )}
            {errors.general && (
              <p
                className="text-red-500 font-semibold text-xs text-center my-2 "
                role="alert"
              >
                {errors.general}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white py-2 mt-6 rounded-2xl font-medium mb-3"
            >
              {" "}
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
          <span className="linha md:relative"></span>

          <span className="text-sm font-semibold mt-5 block text-center md:text-start">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-terracota-100">
              Entrar
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
}
