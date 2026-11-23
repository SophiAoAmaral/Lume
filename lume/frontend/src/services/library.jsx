export async function addBookToLibrary(book) {
  const response = await fetch("/api/library", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(book)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao salvar livro");
  }

  return data;
}


export async function getMyLibrary() {
  const response = await fetch("/api/library", {
    method: "GET",
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao buscar biblioteca.");
  }

  return data.books;
}