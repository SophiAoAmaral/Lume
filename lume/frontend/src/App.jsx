import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { Home } from "./components/Home";
import { Busca } from "./components/Busca";
import { Login } from "./components/Login/Login";
import { Cadastro } from "./components/Login/Cadastro";
import { useState } from "react";
import { LivroDetails } from "./components/LivroDetails";


function App() {
  const location = useLocation();

  const ocultarHeader = ["/login", "/cadastro"].includes(
    location.pathname
  );

  return (
    <>
      {!ocultarHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/busca" element={<Busca />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/livro/:id" element={<LivroDetails/>} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
