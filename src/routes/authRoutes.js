const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

// Ruta para iniciar sesión
// Según tu guía, es buena práctica validar los datos antes de enviarlos al controlador
router.post('/login', [
    body('email').isEmail().withMessage('Debe proporcionar un email válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
], authController.login);

module.exports = router;