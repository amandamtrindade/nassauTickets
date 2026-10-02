import { useState, useEffect } from "react";
import { api } from "../api.js";

const fmt = (v) => (v !== null && typeof v === "object" ? JSON.stringify(v) : String(v ?? ""));

export default function Relatorios() {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");

  async function buscar(e) {
    e?.preventDefault();
    setErro("");
    const qs = new URLSearchParams();
    if (inicio) qs.set("inicio", inicio);
    if (fim) qs.set("fim", fim);
    try { setDados(await api(`/relatorios${qs.size ? `?${qs}` : ""}`)); }
    catch (e) { setErro(e.message); }
  }

  useEffect(() => { buscar(); }, []);

  const lista = Array.isArray(dados) ? dados : null;
  const colunas = lista?.length ? Object.keys(lista[0]) : [];

  return (
    <section>
      <h1>Relatórios</h1>
      <form className="linha" onSubmit={buscar}>
        <label>De <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} /></label>
        <label>Até <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} /></label>
        <button className="botao">Filtrar</button>
      </form>

      {erro && <p className="erro">{erro}</p>}
      {dados === null && !erro && <p className="vazio">Carregando...</p>}
      {lista && lista.length === 0 && <p className="vazio">Nenhum dado no período.</p>}

      {lista && lista.length > 0 && (
        <div className="rolagem">
          <table>
            <thead><tr>{colunas.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {lista.map((linha, i) => (
                <tr key={linha.id ?? i}>{colunas.map((c) => <td key={c}>{fmt(linha[c])}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dados && !lista && (
        <dl className="metricas">
          {Object.entries(dados).map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{fmt(v)}</dd></div>
          ))}
        </dl>
      )}
    </section>
  );
}
