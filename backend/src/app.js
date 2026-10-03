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

// Tratamento de erro genérico, para o frontend/painel não quebrar em silêncio
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

module.exports = app;