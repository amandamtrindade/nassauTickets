import { useState } from "react";
import { api, salvarSessao } from "../api.js";

export default function Login({ aoEntrar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro(""); setCarregando(true);
    try {
      // Esperado: { token, usuario: { nome, perfil } } (ou nome/perfil na raiz)
      const r = await api("/auth/login", { method: "POST", body: { email, senha } });
      const usuario = r.usuario ?? { nome: r.nome, perfil: r.perfil };
      salvarSessao(r.token, usuario);
      aoEntrar(usuario);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="cartao estreito">
      <h1>Entrar</h1>
      <form onSubmit={enviar}>
        <label>E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </label>
        {erro && <p className="erro">{erro}</p>}
        <button className="botao" disabled={carregando}>{carregando ? "Entrando..." : "Entrar"}</button>
      </form>
    </section>
  );
}
