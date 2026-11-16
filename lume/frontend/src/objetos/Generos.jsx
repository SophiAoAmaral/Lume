 import fantasia from "../images/fantasialivros.png";
import humor from "../images/humorlivros.png";
import terror from "../images/terrorlivros.png";
import suspense from "../images/suspenselivros.png";
import romance from "../images/romancelivros.png";
import classicos from "../images/classicoslivros.png";



 
 
 const generos = [
  { nome: "Romance", descricao: "Histórias de amor de se emocionar.", assunto: "romance",img: romance, },
  { nome: "Suspense", descricao: "Mistérios que prendem sua atenção.", assunto: "thriller", img: suspense, },
  { nome: "Reflexão", descricao: "Ideias que transformam sua visão.", assunto: "philosophy", img: classicos, },
  { nome: "Fantasia", descricao: "Mundos mágicos para fugir daqui.", assunto: "fantasy",img: fantasia, },
  { nome: "Humor", descricao: "Histórias divertidas para boas risadas.", assunto: "humor",img: humor, },
  { nome: "Terror", descricao: "Histórias assustadoras para perder o sono. ", assunto: "horror",img: terror, },
];


export default generos;