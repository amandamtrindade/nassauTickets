const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Atendente = require('../models/Atendente');

async function autenticar(req, res) {
  try {
    const { login, senha } = req.body;

    if (!login || !senha) {
      return res.status(400).json({ erro: 'Informe login e senha' });
    }

    const atendente = await Atendente.findOne({ where: { login } });
    const senhaCorreta = atendente && (await bcrypt.compare(senha, atendente.senhaHash));

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Login ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: atendente.id, login: atendente.login, perfil: atendente.perfil },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      atendente: {
        id: atendente.id,
        nome: atendente.nome,
        login: atendente.login,
        perfil: atendente.perfil,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao autenticar' });
  }
}

module.exports = { autenticar };