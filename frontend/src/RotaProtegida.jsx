import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { ehPerfil } from "../../util";

export default function RotaProtegida({ perfis, children }) {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" replace />;
  if (perfis && !ehPerfil(usuario, ...perfis)) {
    return <Navigate to="/" replace />;
  }
  return children;
}