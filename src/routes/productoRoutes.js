const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { auth } = require('../middlewares/auth');

// Si productoController.obtenerTodos es undefined, saldrá el TypeError. 
// Por eso es vital el module.exports que hicimos arriba.
router.get('/', productoController.obtenerTodos); 
router.get('/:id', productoController.obtenerPorId);
router.post('/', auth, productoController.crear);

module.exports = router;