const Usuario = require('../models/usuario');
const { generarToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar al usuario por email
        const usuario = await Usuario.buscarPorEmail(email);
        
        if (!usuario) {
            return res.status(401).json({
                error: true,
                mensaje: 'Credenciales inválidas (email no encontrado)'
            });
        }

        // 2. Verificar la contraseña (comparar texto plano con el hash de la DB)
        // Nota: Asegúrate de que al crear el usuario usaste bcrypt.hash
        const esValida = await bcrypt.compare(password, usuario.password);
        
        if (!esValida) {
            return res.status(401).json({
                error: true,
                mensaje: 'Credenciales inválidas (contraseña incorrecta)'
            });
        }

        // 3. Generar el Token usando la utilidad del Paso 1
        const token = generarToken(usuario);

        // 4. Responder con el token y datos básicos del usuario
        res.json({
            error: false,
            mensaje: 'Login exitoso',
            data: {
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            error: true,
            mensaje: 'Error en el servidor al intentar iniciar sesión'
        });
    }
};

module.exports = { login };