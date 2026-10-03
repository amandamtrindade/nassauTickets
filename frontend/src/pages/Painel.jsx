import { useState, useEffect } from "react";
import { api } from "../api.js";

const INTERVALO_MS = 4000;

export default function Painel() {
  const [chamadas, setChamadas] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    async function buscar() {
      try {
        const dados = await api("/senhas/painel");
        if (ativo) { setChamadas(dados || []); setErro(""); }
      } catch (e) {
        if (ativo) setErro(e.message);
      }
    }
    buscar();
    const timer = setInterval(buscar, INTERVALO_MS);
    return () => { ativo = false; clearInterval(timer); };
  }, []);

  return (
    <section>
      <h1>Últimas chamadas</h1>
      {erro && <p className="erro">{erro}</p>}
      {chamadas.length === 0 && !erro && <p className="vazio">Nenhuma senha chamada ainda.</p>}
      <ol className="painel">
        {chamadas.slice(0, 5).map((c, i) => (
          <li key={c.id ?? i} className={i === 0 ? "atual" : ""}>
            <strong>{c.codigo ?? c.numero ?? c.id}</strong>
            <span>{c.guiche != null ? `Guichê ${c.guiche}` : ""}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
