
export async function getFavorites() {
  const response = await fetch("/api/favorites", {
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.books;
}

export async function addFavorite(book) {
  const response = await fetch("/api/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(book)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.book;
}

export async function removeFavorite(bookId) {
  const response = await fetch(
    `/api/favorites/${encodeURIComponent(bookId)}`,
    {
      method: "DELETE",
      credentials: "include"
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}
