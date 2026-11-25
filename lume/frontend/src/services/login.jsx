
const API_URL = import.meta.env.VITE_API_URL || "";

// LOGIN
export async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao entrar");
  }

  return data;
}

// LOGOUT
export async function logout() {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao sair da conta");
  }

  return data;
}

// CADASTRO
export async function register(name, email, password) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      name,
      email,
      password
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message || "Erro no cadastro"
    );

    error.errors = data.errors || {};

    throw error;
  }

  return data;
}
