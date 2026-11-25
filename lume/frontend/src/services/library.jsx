
import { apiRequest } from "./api";


export async function addBookToLibrary(book) {
  return apiRequest("/api/library", {
    method: "POST",
    body: JSON.stringify(book)
  });}

export async function getMyLibrary() {
  const data = await apiRequest("/api/library");

  return data.books ?? [];
}

export async function removeBookFromLibrary(bookId) {
  return apiRequest(
    `/api/library/${encodeURIComponent(bookId)}`,
    {
      method: "DELETE"
    }
  );
}

export async function toggleFavorite(bookId, favorite) {
  const data = await apiRequest(
    `/api/library/${encodeURIComponent(bookId)}/favorite`,
    {
      method: "PATCH",
      body: JSON.stringify({ favorite })
    }
  );

  return data.book;
}
