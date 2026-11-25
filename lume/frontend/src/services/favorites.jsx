
import { apiRequest } from "./api";


export async function getFavorites() {
  const data = await apiRequest("/api/favorites");

  return data.books ?? [];
}


export async function addFavorite(book) {
  const data = await apiRequest("/api/favorites", {
    method: "POST",
    body: JSON.stringify(book)
  });

  return data.book;
}


export async function removeFavorite(bookId) {
  return apiRequest(
    `/api/favorites/${encodeURIComponent(bookId)}`,
    {
      method: "DELETE"
    }
  );
}
