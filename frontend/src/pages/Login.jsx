import { useState } from "react";
import { api, salvarSessao } from "../api.js";

export default function Login({ aoEntrar }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro(""); setCarregando(true);
    try {
      const r = await api("/auth/login", { method: "POST", body: { login: usuario, senha } });
      const sessao = r.usuario ?? { nome: r.nome ?? usuario, perfil: r.perfil };
      salvarSessao(r.token, sessao);
      aoEntrar(sessao);
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
        <label>Usuário
          <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
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