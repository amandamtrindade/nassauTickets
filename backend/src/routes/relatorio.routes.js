const { Router } = require('express');
const relatorioController = require('../controllers/relatorioController');

const router = Router();

router.get('/diario', relatorioController.diario);
router.get('/mensal', relatorioController.mensal);
router.get('/auditoria', relatorioController.auditoria);

module.exports = router;
