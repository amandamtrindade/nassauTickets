const { Op } = require('sequelize');
const { Senha } = require('../models');

function intervaloDoDia(data) {
  const inicio = new Date(data);
  inicio.setHours(0, 0, 0, 0);
  const fim = new Date(data);
  fim.setHours(23, 59, 59, 999);
  return { inicio, fim };
}

async function diario(req, res) {
  try {
    const dataRef = req.query.data ? new Date(req.query.data) : new Date();
    const { inicio, fim } = intervaloDoDia(dataRef);

    const senhas = await Senha.findAll({
      where: { dataEmissao: { [Op.between]: [inicio, fim] } },
    });

    const emitidas = senhas.length;
    const atendidas = senhas.filter((s) => s.estado === 'ATENDIDA').length;

    const porPrioridade = (estadoFiltro) => {
      const resultado = { SP: 0, SG: 0, SE: 0 };
      senhas
        .filter((s) => (estadoFiltro ? s.estado === estadoFiltro : true))
        .forEach((s) => {
          resultado[s.tipo] += 1;
        });
      return resultado;
    };

    return res.json({
      emitidas,
      atendidas,
      emitidasPorPrioridade: porPrioridade(),
      atendidasPorPrioridade: porPrioridade('ATENDIDA'),
      detalhado: senhas.map((s) => ({
        numero: s.numero,
        tipo: s.tipo,
        dataEmissao: s.dataEmissao,
        inicioAtendimento: s.inicioAtendimento,
        fimAtendimento: s.fimAtendimento,
        guicheId: s.guicheId,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao gerar relatório diário' });
  }
}

async function mensal(req, res) {
  try {
    const mesRef = req.query.mes ? new Date(req.query.mes) : new Date();
    const inicio = new Date(mesRef.getFullYear(), mesRef.getMonth(), 1);
    const fim = new Date(mesRef.getFullYear(), mesRef.getMonth() + 1, 0, 23, 59, 59, 999);

    const senhas = await Senha.findAll({
      where: { dataEmissao: { [Op.between]: [inicio, fim] } },
    });

    return res.json({
      emitidas: senhas.length,
      atendidas: senhas.filter((s) => s.estado === 'ATENDIDA').length,
      naoAtendidas: senhas.filter((s) => s.estado === 'NAO_COMPARECEU').length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao gerar relatório mensal' });
  }
}

async function auditoria(req, res) {
  try {
    const senhas = await Senha.findAll({
      where: { estado: ['ATENDIDA', 'NAO_COMPARECEU'] },
      order: [['dataEmissao', 'DESC']],
    });

    const registros = senhas.map((s) => ({
      senha: s.numero,
      atendenteId: s.atendenteId,
      guicheId: s.guicheId,
      primeiraChamada: s.primeiraChamada,
      segundaChamada: s.segundaChamada,
      inicioAtendimento: s.inicioAtendimento,
      fimAtendimento: s.fimAtendimento,
    }));

    return res.json(registros);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao gerar relatório de auditoria' });
  }
}

module.exports = { diario, mensal, auditoria };
