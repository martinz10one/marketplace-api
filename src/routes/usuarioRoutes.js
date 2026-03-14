const express = require('express');
const UsuarioController = require('../controllers/usuarioController');
const {
    validacionCrearUsuario,
    validacionParametroId
} = require('../middlewares/validaciones');

// 1. IMPORTAMOS EL MIDDLEWARE DE AUTENTICACIÓN
const { auth } = require('../middlewares/auth');

const router = express.Router();

// --- RUTAS EXISTENTES ---

// El registro (POST) se deja público para que nuevos usuarios se unan
router.post('/', validacionCrearUsuario, UsuarioController.crear);

// GET / - Listar: PROTEGIDO con 'auth'
router.get('/', auth, UsuarioController.listar);

// GET /:id - Obtener: PROTEGIDO con 'auth'
router.get('/:id', auth, validacionParametroId, UsuarioController.obtener);

// --- TAREA 1: NUEVAS RUTAS DEL DESAFÍO (AHORA PROTEGIDAS) ---

// PUT /:id - Actualizar: PROTEGIDO
router.put('/:id', auth, validacionParametroId, UsuarioController.actualizar);

// DELETE /:id - Eliminar: PROTEGIDO
router.delete('/:id', auth, validacionParametroId, UsuarioController.eliminar);

module.exports = router;