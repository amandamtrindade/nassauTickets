const { Router } = require('express');
const atendimentoController = require('../controllers/atendimentoController');
const { exigirLogin } = require('../middlewares/authMiddleware');

const router = Router();

// Todas as rotas de atendimento exigem atendente (ou gestor) logado
router.use(exigirLogin);

router.post('/chamar', atendimentoController.chamar);
router.post('/chamar-novamente', atendimentoController.chamarNovamente);
router.post('/nao-compareceu', atendimentoController.naoCompareceu);
router.post('/iniciar', atendimentoController.iniciar);
router.post('/finalizar', atendimentoController.finalizar);

module.exports = router;