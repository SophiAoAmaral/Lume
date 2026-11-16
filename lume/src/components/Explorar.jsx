import React from 'react'

export const Explorar = () => {
   
  return (
    <section>
      <h2>Qual é a sua vibe hoje?</h2>
      {generos.map((genero) => (
        <div
          key={genero.nome}
          onClick={() =>
            navigate(`/busca?genero=${encodeURIComponent(genero.assunto)}`)
          }
          className="cursor-pointer rounded-xl border p-5"
        >
          <span>{genero.nome}</span>
          <h3>{genero.descricao}</h3>
        </div>
      ))}
    </section>
  );
}
