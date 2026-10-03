import { useState } from "react";
import { api, getUsuario } from "../api.js";

// Prefixo em que o router de atendimento foi registrado no app.js do back-end.
// Confira a linha app.use('/???', atendimentoRoutes) e ajuste aqui se for outro.
const PREFIXO = "/atendimento";

export default function Atendente() {
  const [guicheId, setGuicheId] = useState("1");
  const [senha, setSenha] = useState(null); // senha em atendimento
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");
  const [ocupado, setOcupado] = useState(false);

  const estado = senha?.estado?.toUpperCase();
  const codigo = senha && (senha.codigo ?? senha.numero ?? senha.id);

  async function executar(rota, corpo, aoConcluir) {
    setErro(""); setMsg(""); setOcupado(true);
    try {
      const r = await api(`${PREFIXO}/${rota}`, { method: "POST", body: corpo });
      aoConcluir(r);
    } catch (e) {
      setErro(e.message);
    } finally {
      setOcupado(false);
    }
  }

  function chamarProxima(e) {
    e.preventDefault();
    executar("chamar", { guicheId: Number(guicheId) }, (r) => {
      if (r?.id) setSenha(r);
      else setMsg(r?.mensagem || "Nenhuma senha aguardando na fila.");
    });
  }

  // Ações sobre a senha atual. Todas enviam senhaId no corpo.
  const iniciar = () =>
    executar("iniciar", { senhaId: senha.id, atendenteId: getUsuario()?.id }, (r) => setSenha(r?.id ? r : senha));

  const chamarNovamente = () =>
    executar("chamar-novamente", { senhaId: senha.id }, (r) => {
      setSenha(r?.id ? r : senha);
      setMsg("Senha chamada novamente.");
    });

  const finalizar = () =>
    executar("finalizar", { senhaId: senha.id }, () => {
      setSenha(null);
      setMsg(`Senha ${codigo} finalizada.`);
    });

  const naoCompareceu = () =>
    executar("nao-compareceu", { senhaId: senha.id }, () => {
      setSenha(null);
      setMsg(`Senha ${codigo} marcada como não compareceu.`);
    });

  return (
    <section>
      <h1>Atendimento</h1>

      {!senha && (
        <form className="linha" onSubmit={chamarProxima}>
          <label>Guichê
            <input type="number" min="1" value={guicheId} onChange={(e) => setGuicheId(e.target.value)} required />
          </label>
          <button className="botao" disabled={ocupado}>Chamar próxima</button>
        </form>
      )}

      {senha && (
        <div className="cartao">
          <p className="rotulo">Senha atual</p>
          <strong className="codigo">{codigo}</strong>
          <p>Situação: {estado || "—"}</p>
          <div className="linha">
            {estado === "EM_ATENDIMENTO" ? (
              <button className="botao" disabled={ocupado} onClick={finalizar}>Finalizar</button>
            ) : (
              <>
                <button className="botao" disabled={ocupado} onClick={iniciar}>Iniciar</button>
                <button className="botao sec" disabled={ocupado} onClick={chamarNovamente}>Chamar novamente</button>
                <button className="botao perigo" disabled={ocupado} onClick={naoCompareceu}>Não compareceu</button>
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
