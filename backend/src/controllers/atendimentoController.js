const filaService = require('../services/filaService');

async function chamar(req, res) {
  try {
    const { guicheId } = req.body || {};
    const senha = await filaService.chamarSenha(guicheId);

    if (!senha) {
      return res.status(200).json({ mensagem: 'Nenhuma senha aguardando na fila' });
    }

    return res.json(senha);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao chamar senha' });
  }
}

async function chamarNovamente(req, res) {
  try {
    const { senhaId } = req.body || {};
    if (!senhaId) {
      return res.status(400).json({ erro: 'Informe a senha' });
    }
    const senha = await filaService.chamarNovamente(senhaId);
    return res.json(senha);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ erro: error.message });
  }
}

async function naoCompareceu(req, res) {
  try {
    const { senhaId } = req.body || {};
    if (!senhaId) {
      return res.status(400).json({ erro: 'Informe a senha' });
    }
    const senha = await filaService.marcarNaoCompareceu(senhaId);
    return res.json(senha);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ erro: error.message });
  }
}

async function iniciar(req, res) {
  try {
    const { senhaId, atendenteId } = req.body || {};
    if (!senhaId || !atendenteId) {
      return res.status(400).json({ erro: 'Informe a senha e o atendente' });
    }
    const senha = await filaService.iniciarAtendimento(senhaId, atendenteId);
    return res.json(senha);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ erro: error.message });
  }
}

async function finalizar(req, res) {
  try {
    const { senhaId } = req.body || {};
    if (!senhaId) {
      return res.status(400).json({ erro: 'Informe a senha' });
    }
    const senha = await filaService.finalizarAtendimento(senhaId);
    return res.json(senha);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ erro: error.message });
  }
}

module.exports = { chamar, chamarNovamente, naoCompareceu, iniciar, finalizar };
