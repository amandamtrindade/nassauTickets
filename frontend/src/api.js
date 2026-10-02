// Cliente HTTP único: injeta o Bearer token e trata 401.
// Ajuste os caminhos/campos aqui se a API for diferente.
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3333";

let aoExpirar = () => {};
export const definirAoExpirar = (fn) => { aoExpirar = fn; };

export const getToken = () => localStorage.getItem("token");
export const salvarSessao = (token, usuario) => {
  localStorage.setItem("token", token);
  localStorage.setItem("usuario", JSON.stringify(usuario));
};
export const limparSessao = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};
export const getUsuario = () => {
  try { return JSON.parse(localStorage.getItem("usuario")); } catch { return null; }
};

export async function api(caminho, { method = "GET", body } = {}) {
  const token = getToken();
  const res = await fetch(BASE + caminho, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && token) {
    aoExpirar(); // volta para o login
    throw new Error("Sessão expirada. Entre novamente.");
  }

  const texto = await res.text();
  let dados = null;
  try { dados = texto ? JSON.parse(texto) : null; } catch { dados = null; }

  if (!res.ok) {
    throw new Error(dados?.message || dados?.erro || dados?.error || `Erro ${res.status}`);
  }
  return dados;
}
