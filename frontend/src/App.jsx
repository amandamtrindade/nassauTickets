import { useState, useEffect } from "react";
import { definirAoExpirar, getUsuario, limparSessao } from "./api.js";
import Totem from "./pages/Totem.jsx";
import Painel from "./pages/Painel.jsx";
import Login from "./pages/Login.jsx";
import Atendente from "./pages/Atendente.jsx";
import Relatorios from "./pages/Relatorios.jsx";

export default function App() {
  const [usuario, setUsuario] = useState(getUsuario());
  const [tela, setTela] = useState("totem");

  const sair = () => { limparSessao(); setUsuario(null); setTela("login"); };

  // Qualquer 401 da API cai aqui e leva para o login.
  useEffect(() => { definirAoExpirar(sair); }, []);

  const ehGestor = usuario?.perfil?.toUpperCase() === "GESTOR";

  const abas = [
    ["totem", "Totem"],
    ["painel", "Painel"],
    ...(usuario ? [["atendente", "Atendimento"]] : []),
    ...(ehGestor ? [["relatorios", "Relatórios"]] : []),
  ];

  // Telas protegidas: sem login vai para o login; sem perfil gestor, não abre relatórios.
  let conteudo;
  if (tela === "totem") conteudo = <Totem />;
  else if (tela === "painel") conteudo = <Painel />;
  else if (tela === "atendente" && usuario) conteudo = <Atendente />;
  else if (tela === "relatorios" && ehGestor) conteudo = <Relatorios />;
  else if (tela === "relatorios" && usuario) conteudo = <p className="aviso">Acesso restrito ao gestor.</p>;
  else conteudo = <Login aoEntrar={(u) => { setUsuario(u); setTela("atendente"); }} />;

  return (
    <>
      <header className="topo">
        <strong className="marca">Senhas</strong>
        <nav>
          {abas.map(([id, rotulo]) => (
            <button key={id} className={tela === id ? "aba ativa" : "aba"} onClick={() => setTela(id)}>
              {rotulo}
            </button>
          ))}
        </nav>
        {usuario ? (
          <span className="sessao">
            {usuario.nome || "Usuário"} <button className="link" onClick={sair}>Sair</button>
          </span>
        ) : (
          <button className="aba" onClick={() => setTela("login")}>Entrar</button>
        )}
      </header>
      <main>{conteudo}</main>
    </>
  );
}
