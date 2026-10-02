const { Router } = require('express');
const senhaController = require('../controllers/senhaController');

const router = Router();

router.post('/', senhaController.emitir);
router.get('/painel', senhaController.painel);

module.exports = router;
