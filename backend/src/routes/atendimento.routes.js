const { Router } = require('express');
const atendimentoController = require('../controllers/atendimentoController');

const router = Router();

router.post('/chamar', atendimentoController.chamar);
router.post('/chamar-novamente', atendimentoController.chamarNovamente);
router.post('/nao-compareceu', atendimentoController.naoCompareceu);
router.post('/iniciar', atendimentoController.iniciar);
router.post('/finalizar', atendimentoController.finalizar);

module.exports = router;
