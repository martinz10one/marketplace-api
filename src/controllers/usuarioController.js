const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario = require('../models/usuario');

class UsuarioController {
    static async crear(req, res, next) {
        try {
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    mensaje: 'Datos inválidos',
                    errores: errores.array()
                });
            }
            const { nombre, email, password, rol } = req.body;
            /*const usuarioExistente = await Usuario.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.status(409).json({
                    error: true,
                    mensaje: 'El email ya está registrado'
                });
            }*/
            const passwordEncriptada = await bcrypt.hash(password, 12);
            const nuevoUsuario = await Usuario.crear({
                nombre,
                email,
                password: passwordEncriptada,
                rol
            });
            res.status(201).json({
                error: false,
                mensaje: 'Usuario creado exitosamente',
                usuario: nuevoUsuario
            });
        } catch (error) {
            next(error);
        }
    }

    static async obtener(req, res, next) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.buscarPorId(id);
            if (!usuario) {
                return res.status(404).json({
                    error: true,
                    mensaje: 'Usuario no encontrado'
                });
            }
            res.json({ error: false, usuario });
        } catch (error) {
            next(error);
        }
    }
static async listar(req, res, next) {
    try {
        const filtros = {
            rol: req.query.rol,
            busqueda: req.query.q, // Tarea 2: Búsqueda por nombre/email
            pagina: parseInt(req.query.pagina) || 1, // Aseguramos que sea número
            limite: parseInt(req.query.limite) || 10,
            desde: req.query.desde, // Tarea 2: Filtro de fecha inicio
            hasta: req.query.hasta  // Tarea 2: Filtro de fecha fin
        };

        // El modelo ahora devuelve un objeto con { usuarios, paginacion }
        const resultado = await Usuario.obtenerTodos(filtros);

        res.json({
            error: false,
            data: resultado.usuarios, // La lista de usuarios
            meta: resultado.paginacion, // Tarea 2: Metadatos (Total registros, páginas, etc.)
            filtros_aplicados: filtros
        });
    } catch (error) {
        next(error);
    }
}

    // --- MÉTODOS AGREGADOS PARA LA TAREA 1 ---

    static async actualizar(req, res, next) {
        try {
            const { id } = req.params;
            const { nombre, email } = req.body;

            // Tarea 1: Solo actualizamos campos permitidos
            const resultado = await Usuario.actualizar(id, { nombre, email });

            if (!resultado || resultado.affectedRows === 0) {
                return res.status(404).json({
                    error: true,
                    mensaje: 'Usuario no encontrado para actualizar'
                });
            }

            res.json({
                error: false,
                mensaje: 'Usuario actualizado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    static async eliminar(req, res, next) {
        try {
            const { id } = req.params;

            // Tarea 1: Eliminación lógica
            const resultado = await Usuario.eliminar(id);

            if (!resultado || resultado.affectedRows === 0) {
                return res.status(404).json({
                    error: true,
                    mensaje: 'Usuario no encontrado para eliminar'
                });
            }

            res.json({
                error: false,
                mensaje: 'Usuario eliminado (desactivado) exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UsuarioController;