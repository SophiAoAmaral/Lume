import React, { useState } from 'react'
import {
  BookOpen, ChartNoAxesColumnIncreasing, Heart} from "lucide-react";

export const Cadastro = () => {
  const dicas = [
    {titulo: 'Sua estante, do seu jeito', subtitulo:'Separe o que quer ler, o que está lendo e o que já terminou.', icon: <BookOpen size={20}/>},
    {titulo: 'Nunca perca a página', subtitulo:'Salve onde parou e veja seu ano de leitura ganhar forma.', icon: <ChartNoAxesColumnIncreasing size={20}/>},
    {titulo: 'Descobertas com a sua cara', subtitulo:'Seus gêneros favoritos guiam as indicações da página inicial.', icon: <Heart size={20}/>},

  ];
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [password, setPassword] = useState("");


  return (
    <div>
        
    </div>
  )
}
