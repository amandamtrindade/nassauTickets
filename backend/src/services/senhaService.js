const { Op } = require('sequelize');
const { Senha } = require('../models');

// Transições válidas da máquina de estados (regra 9 do enunciado)
const TRANSICOES_VALIDAS = {
  EMITIDA: ['AGUARDANDO'],
  AGUARDANDO: ['CHAMADA'],
  CHAMADA: ['CHAMADA_NOVAMENTE', 'EM_ATENDIMENTO', 'NAO_COMPARECEU'],
  CHAMADA_NOVAMENTE: ['EM_ATENDIMENTO', 'NAO_COMPARECEU'],
  EM_ATENDIMENTO: ['ATENDIDA'],
  ATENDIDA: [],
  NAO_COMPARECEU: [],
};

function podeTransicionar(estadoAtual, novoEstado) {
  return (TRANSICOES_VALIDAS[estadoAtual] || []).includes(novoEstado);
}

async function transicionarEstado(senha, novoEstado) {
  if (!podeTransicionar(senha.estado, novoEstado)) {
    throw new Error(
      `Transição inválida: ${senha.estado} -> ${novoEstado}`
    );
  }
  senha.estado = novoEstado;
  await senha.save();
  return senha;
}

// Gera o número no formato YYMMDD-PPSQ, com sequência diária por tipo
async function gerarNumeroSenha(tipo) {
  const hoje = new Date();
  const yy = String(hoje.getFullYear()).slice(-2);
  const mm = String(hoje.getMonth() + 1).padStart(2, '0');
  const dd = String(hoje.getDate()).padStart(2, '0');
  const prefixoData = `${yy}${mm}${dd}`;

  const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0));
  const fimDoDia = new Date(hoje.setHours(23, 59, 59, 999));

  const quantidadeHoje = await Senha.count({
    where: {
      tipo,
      dataEmissao: { [Op.between]: [inicioDoDia, fimDoDia] },
    },
  });

  const sequencia = String(quantidadeHoje + 1).padStart(3, '0');

  return `${prefixoData}-${tipo}${sequencia}`;
}

async function emitirSenha(tipo) {
  const numero = await gerarNumeroSenha(tipo);
  const senha = await Senha.create({ numero, tipo, estado: 'EMITIDA' });
  return transicionarEstado(senha, 'AGUARDANDO');
}

module.exports = {
  podeTransicionar,
  transicionarEstado,
  gerarNumeroSenha,
  emitirSenha,
};
