const jwt = require('jsonwebtoken');

// Exige um token válido no cabeçalho: Authorization: Bearer <token>
function exigirLogin(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const [tipo, token] = cabecalho.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Token não informado' });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

// Exige que o usuário logado seja gestor (usar sempre depois de exigirLogin)
function apenasGestor(req, res, next) {
  if (!req.usuario || req.usuario.perfil !== 'gestor') {
    return res.status(403).json({ erro: 'Acesso restrito ao gestor' });
  }
  return next();
}

module.exports = { exigirLogin, apenasGestor };