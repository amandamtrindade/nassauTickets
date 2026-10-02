const { emitirSenha } = require('../services/senhaService');
const { Senha } = require('../models');

async function emitir(req, res) {
  try {
    const { tipo } = req.body || {};

    if (!tipo || !['SP', 'SG', 'SE'].includes(tipo)) {
      return res.status(400).json({ erro: 'Tipo de senha inválido' });
    }

    const senha = await emitirSenha(tipo);
    return res.status(201).json(senha);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao emitir senha' });
  }
}

// Últimas 5 senhas chamadas, para o painel
async function painel(req, res) {
  try {
    const ultimasChamadas = await Senha.findAll({
      where: { estado: ['CHAMADA', 'CHAMADA_NOVAMENTE', 'EM_ATENDIMENTO', 'ATENDIDA'] },
      order: [['primeiraChamada', 'DESC']],
      limit: 5,
    });

    return res.json(ultimasChamadas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao buscar painel' });
  }
}

module.exports = { emitir, painel };
