const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const senhaRoutes = require('./routes/senha.routes');
const atendimentoRoutes = require('./routes/atendimento.routes');
const relatorioRoutes = require('./routes/relatorio.routes');
const { exigirLogin, apenasGestor } = require('./middlewares/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/senhas', senhaRoutes);
app.use('/atendimento', atendimentoRoutes);
app.use('/relatorios', exigirLogin, apenasGestor, relatorioRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Tratamento de erro: se for erro de cliente (status 4xx), retorna o status correspondente
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode;
  if (status && status >= 400 && status < 500) {
    return res.status(status).json({ erro: err.message || 'Requisição inválida' });
  }

  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});


module.exports = app;