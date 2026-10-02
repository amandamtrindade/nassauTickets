import { useState } from "react";
import { api } from "../api.js";

export default function Atendente() {
  const [guiche, setGuiche] = useState("1");
  const [senha, setSenha] = useState(null); // senha em atendimento
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function executar(fn, aviso) {
    setErro(""); setMsg(""); setOcupado(true);
    try { await fn(); if (aviso) setMsg(aviso); }
    catch (e) { setErro(e.message); }
    finally { setOcupado(false); }
  }

  // Cada ação devolve a senha atualizada; se vier vazio, ajusta o status local.
  const acao = (rota, novoStatus, aviso) => () =>
    executar(async () => {
      const r = await api(`/senhas/${senha.id}/${rota}`, { method: "POST" });
      const atualizada = r?.id ? r : { ...senha, status: novoStatus };
      setSenha(["FINALIZADA", "NAO_COMPARECEU"].includes(atualizada.status) ? null : atualizada);
    }, aviso);

  const chamarProxima = (e) => {
    e.preventDefault();
    executar(async () => {
      const r = await api("/senhas/chamar", { method: "POST", body: { guiche: Number(guiche) } });
      if (!r) setMsg("Fila vazia.");
      else setSenha(r);
    });
  };

  const status = senha?.status?.toUpperCase();

  return (
    <section>
      <h1>Atendimento</h1>

      {!senha && (
        <form className="linha" onSubmit={chamarProxima}>
          <label>Guichê
            <input type="number" min="1" value={guiche} onChange={(e) => setGuiche(e.target.value)} required />
          </label>
          <button className="botao" disabled={ocupado}>Chamar próxima</button>
        </form>
      )}

      {senha && (
        <div className="cartao">
          <p className="rotulo">Senha atual</p>
          <strong className="codigo">{senha.codigo ?? senha.numero ?? senha.id}</strong>
          <p>Status: {status || "—"}</p>
          <div className="linha">
            {status === "EM_ATENDIMENTO" ? (
              <button className="botao" disabled={ocupado} onClick={acao("finalizar", "FINALIZADA", "Atendimento finalizado.")}>
                Finalizar
              </button>
            ) : (
              <>
                <button className="botao" disabled={ocupado} onClick={acao("iniciar", "EM_ATENDIMENTO")}>Iniciar</button>
                <button className="botao sec" disabled={ocupado} onClick={acao("rechamar", "CHAMADA", "Senha chamada novamente.")}>
                  Chamar novamente
                </button>
                <button className="botao perigo" disabled={ocupado} onClick={acao("nao-compareceu", "NAO_COMPARECEU", "Marcada como não compareceu.")}>
                  Não compareceu
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {msg && <p className="ok">{msg}</p>}
      {erro && <p className="erro">{erro}</p>}
    </section>
  );
}
