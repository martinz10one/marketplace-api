const { verificarToken, extraerTokenDeHeader } = require('../utils/jwt');

const auth = (req, res, next) => {
    try {
        // 1. Extraer el token del encabezado Authorization
        const authHeader = req.headers.authorization;
        const token = extraerTokenDeHeader(authHeader);

        // 2. Verificar el token usando la utilidad que creamos antes
        const decoded = verificarToken(token);

        // 3. Adjuntar los datos del usuario decodificados al objeto request
        // Esto permite que los controladores sepan quién está haciendo la petición
        req.usuario = decoded;

        // 4. Continuar al siguiente middleware o controlador
        next();
    } catch (error) {
        res.status(401).json({
            error: true,
            mensaje: 'No autorizado: ' + error.message
        });
    }
};

// Middleware opcional para verificar roles específicos (ej: solo admin)
const authorize = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: true, mensaje: 'Usuario no autenticado' });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ 
                error: true, 
                mensaje: `Acceso denegado: se requiere rol [${rolesPermitidos.join(', ')}]` 
            });
        }
        next();
    };
};

module.exports = { auth, authorize };