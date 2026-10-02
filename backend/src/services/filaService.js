const { Senha } = require('../models');
const { transicionarEstado } = require('./senhaService');

// Controla, em memória, qual foi o último "grupo" chamado, para alternar
// entre SP e (SE|SG) conforme a regra: [SP] -> [SE|SG] -> [SP] -> [SE|SG]
// OBS: isso é uma simplificação para rodar em uma única instância do servidor.
// Se o grupo for evoluir para múltiplas instâncias, essa informação precisa
// morar no banco (ex.: uma tabela de "estado da fila").
let ultimoGrupoChamado = null; // 'SP' | 'SE_SG'

async function buscarProximaDaFila(tipo) {
  return Senha.findOne({
    where: { tipo, estado: 'AGUARDANDO' },
    order: [
      ['dataEmissao', 'ASC'],
      ['id', 'ASC'],
    ],
  });
}

// Decide e retorna a próxima senha a ser chamada, já seguindo a prioridade.
// NOTE: em produção, isso deve rodar dentro de uma transação com lock
// (ex.: sequelize.transaction + { lock: true }) para evitar que dois
// atendentes peguem a mesma senha ao chamar ao mesmo tempo.
async function proximaSenha() {
  let candidata = null;

  if (ultimoGrupoChamado !== 'SP') {
    candidata = await buscarProximaDaFila('SP');
    if (candidata) {
      ultimoGrupoChamado = 'SP';
      return candidata;
    }
  }

  // Grupo SE|SG: tenta SE primeiro (prioridade operacional especial), depois SG
  candidata = await buscarProximaDaFila('SE');
  if (!candidata) {
    candidata = await buscarProximaDaFila('SG');
  }

  if (candidata) {
    ultimoGrupoChamado = 'SE_SG';
    return candidata;
  }

  // Se não achou nada no grupo esperado, tenta SP mesmo fora da alternância
  // (regra: fila vazia não pode travar o atendimento)
  candidata = await buscarProximaDaFila('SP');
  if (candidata) {
    ultimoGrupoChamado = 'SP';
  } else {
    ultimoGrupoChamado = null;
  }

  return candidata; // pode ser null se não houver nenhuma senha aguardando
}

async function chamarSenha(guicheId) {
  const senha = await proximaSenha();
  if (!senha) return null;

  senha.guicheId = guicheId;
  senha.primeiraChamada = new Date();
  await transicionarEstado(senha, 'CHAMADA');
  return senha;
}

async function chamarNovamente(senhaId) {
  const senha = await Senha.findByPk(senhaId);
  if (!senha) throw new Error('Senha não encontrada');

  senha.segundaChamada = new Date();
  await transicionarEstado(senha, 'CHAMADA_NOVAMENTE');
  return senha;
}

async function marcarNaoCompareceu(senhaId) {
  const senha = await Senha.findByPk(senhaId);
  if (!senha) throw new Error('Senha não encontrada');

  return transicionarEstado(senha, 'NAO_COMPARECEU');
}

async function iniciarAtendimento(senhaId, atendenteId) {
  const senha = await Senha.findByPk(senhaId);
  if (!senha) throw new Error('Senha não encontrada');

  senha.atendenteId = atendenteId;
  senha.inicioAtendimento = new Date();
  await transicionarEstado(senha, 'EM_ATENDIMENTO');
  return senha;
}

async function finalizarAtendimento(senhaId) {
  const senha = await Senha.findByPk(senhaId);
  if (!senha) throw new Error('Senha não encontrada');

  senha.fimAtendimento = new Date();
  await transicionarEstado(senha, 'ATENDIDA');
  return senha;
}

function resetEstadoFila() {
  ultimoGrupoChamado = null;
}

module.exports = {
  proximaSenha,
  chamarSenha,
  chamarNovamente,
  marcarNaoCompareceu,
  iniciarAtendimento,
  finalizarAtendimento,
  resetEstadoFila,
};
