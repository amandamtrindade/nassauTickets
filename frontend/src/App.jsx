import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ehPerfil } from "./util";
import RotaProtegida from "./src/paginas/RotaProtegida";
import Totem from "./paginas/Totem";
import Painel from "./paginas/Painel";
import Login from "./paginas/Login";
import Atendente from "./paginas/Atendente";
import Relatorios from "./paginas/Relatorios";

export default function App() {
  const { usuario, sair } = useAuth();

  return (
    <>
      <nav className="menu">
        <Link to="/">Totem</Link>
        <Link to="/painel">Painel</Link>
        {usuario && <Link to="/atendente">Atendimento</Link>}
        {ehPerfil(usuario, "gestor") && <Link to="/relatorios">Relatórios</Link>}
        <span className="espaco" />
        {usuario ? (
          <>
            <span>Olá, {usuario.nome}</span>
            <button onClick={sair}>Sair</button>
          </>
        ) : (
          <Link to="/login">Entrar</Link>
        )}
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Totem />} />
          <Route path="/painel" element={<Painel />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/atendente"
            element={
              <RotaProtegida perfis={["atendente", "gestor"]}>
                <Atendente />
              </RotaProtegida>
            }
          />
          <Route
            path="/relatorios"
            element={
              <RotaProtegida perfis={["gestor"]}>
                <Relatorios />
              </RotaProtegida>
            }
          />
        </Routes>
      </main>
    </>
  );
}