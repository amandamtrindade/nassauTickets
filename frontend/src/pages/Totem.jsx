import { useState } from "react";
import { api } from "../api.js";

// Ajustado os tipos conforme a API .
const TIPOS = [
  { valor: "SP", rotulo: "Prioritária (SP)" },
  { valor: "SG", rotulo: "Geral (SG)" },
  { valor: "SE", rotulo: "Exames (SE)"}

];

export default function Totem() {
  const [emitida, setEmitida] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function emitir(tipo) {
    setErro(""); setCarregando(true);
    try {
      setEmitida(await api("/senhas", { method: "POST", body: { tipo } }));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="totem">
      <h1>Retire sua senha</h1>
      <div className="tipos">
        {TIPOS.map((t) => (
          <button key={t.valor} className="botao grande" disabled={carregando} onClick={() => emitir(t.valor)}>
            {t.rotulo}
          </button>
        ))}
      </div>
      {erro && <p className="erro">{erro}</p>}
      {emitida && (
        <div className="ticket">
          <span>Sua senha</span>
          <strong>{emitida.codigo ?? emitida.numero ?? emitida.id}</strong>
          <span>Aguarde ser chamado no painel.</span>
        </div>
      )}
    </section>
  );
}
