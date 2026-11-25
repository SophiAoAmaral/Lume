
const API_URL = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || `Erro na requisição (${response.status}).`
    );

    error.status = response.status;
    error.errors = data.errors;

    throw error;
  }

  return data;
}
