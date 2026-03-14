const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/database');

class Usuario {
    // 1. MÉTODO CREAR (Sin la columna activo para evitar errores 500)
    static async crear(datosUsuario) {
        const { nombre, email, password, rol = 'comprador' } = datosUsuario;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const query = `
            INSERT INTO users (nombre, email, password, rol, fecha_registro)
            VALUES (?, ?, ?, ?, NOW())
        `;
        try {
            const resultado = await executeQuery(query, [nombre, email, password, rol]);
            return {
                id: resultado.insertId,
                nombre,
                email,
                rol
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El email ya está registrado');
            }
            throw error;
        }
    }

    // 2. BUSCAR POR EMAIL
    static async buscarPorEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const usuarios = await executeQuery(query, [email]);
        return usuarios.length > 0 ? usuarios[0] : null;
    }

    // 3. BUSCAR POR ID
    static async buscarPorId(id) {
        const query = 'SELECT id, nombre, email, rol, fecha_registro FROM users WHERE id = ?';
        const usuarios = await executeQuery(query, [id]);
        return usuarios.length > 0 ? usuarios[0] : null;
    }

    // 4. TAREA 1: ACTUALIZAR
    static async actualizar(id, datos) {
        const { nombre, email } = datos;
        const query = 'UPDATE users SET nombre = ?, email = ? WHERE id = ?';
        return await executeQuery(query, [nombre, email, id]);
    }

    // 5. TAREA 1: ELIMINAR (Físico)
    static async eliminar(id) {
        const query = 'DELETE FROM users WHERE id = ?';
        return await executeQuery(query, [id]);
    }

    // 6. TAREA 2: LISTAR CON FILTROS Y PAGINACIÓN
    static async obtenerTodos(filtros = {}) {
        let query = 'SELECT id, nombre, email, rol, fecha_registro FROM users WHERE 1=1';
        const params = [];

        // Filtro por Rol
        if (filtros.rol) {
            query += ' AND rol = ?';
            params.push(filtros.rol);
        }

        // Filtro por Fechas (Tarea 2)
        if (filtros.desde && filtros.hasta) {
            query += ' AND fecha_registro BETWEEN ? AND ?';
            params.push(filtros.desde, filtros.hasta);
        }

        // Búsqueda por Nombre o Email (Tarea 2)
        if (filtros.busqueda) {
            query += ' AND (nombre LIKE ? OR email LIKE ?)';
            params.push(`%${filtros.busqueda}%`, `%${filtros.busqueda}%`);
        }

        // Ordenamiento
        const orden = filtros.orden || 'fecha_registro';
        const direccion = filtros.direccion === 'ASC' ? 'ASC' : 'DESC';
        query += ` ORDER BY ${orden} ${direccion}`;

        // Paginación (Corrección de ER_WRONG_ARGUMENTS)
        const limite = parseInt(filtros.limite) || 10;
        const pagina = parseInt(filtros.pagina) || 1;
        const offset = (pagina - 1) * limite;

        // Inyectamos los números directamente para que MySQL no se queje de los argumentos
        query += ` LIMIT ${limite} OFFSET ${offset}`;

        const usuarios = await executeQuery(query, params);

        // Conteo total para Metadatos de Tarea 2
        const countQuery = 'SELECT COUNT(*) as total FROM users';
        const resultadoCount = await executeQuery(countQuery);
        const totalRegistros = resultadoCount[0].total;

        return {
            usuarios,
            paginacion: {
                totalRegistros,
                totalPaginas: Math.ceil(totalRegistros / limite),
                paginaActual: pagina,
                limite
            }
        };
    }
}

module.exports = Usuario;