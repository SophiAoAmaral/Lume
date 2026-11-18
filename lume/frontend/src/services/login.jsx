
export async function login (email, password)  {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.message || "Erro ao entrar");
  }

  return data;
}


export async function logout() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("Erro ao sair da conta");
  }

  return response.json();
}


export async function register(name, email, password) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
  const error = new Error(data.message || "Erro no cadastro");

  error.errors = data.errors || {};

  throw error;
}
}