const { executeQuery } = require('../config/database');

class Producto {
    // 1. Crear un producto
    static async crear(datos) {
        const { nombre, descripcion, precio, stock, categoria, usuario_id } = datos;
        const query = `
            INSERT INTO products (nombre, descripcion, precio, stock, categoria, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const resultado = await executeQuery(query, [nombre, descripcion, precio, stock, categoria, usuario_id]);
        return { id: resultado.insertId, ...datos };
    }

    // 2. Obtener todos los productos (con el nombre del vendedor)
    static async obtenerTodos() {
        const query = `
            SELECT p.*, u.nombre AS vendedor 
            FROM products p
            JOIN users u ON p.usuario_id = u.id
            ORDER BY p.fecha_creacion DESC
        `;
        return await executeQuery(query);
    }

    // 3. Obtener un producto por su ID
    static async obtenerPorId(id) {
        const query = 'SELECT * FROM products WHERE id = ?';
        const resultados = await executeQuery(query, [id]);
        return resultados[0];
    }

    // 4. Actualizar un producto (solo si eres el dueño)
    static async actualizar(id, datos, usuario_id) {
        const { nombre, descripcion, precio, stock, categoria } = datos;
        const query = `
            UPDATE products 
            SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ?
            WHERE id = ? AND usuario_id = ?
        `;
        const resultado = await executeQuery(query, [nombre, descripcion, precio, stock, categoria, id, usuario_id]);
        return resultado.affectedRows > 0;
    }

    // 5. Eliminar un producto
    static async eliminar(id, usuario_id) {
        const query = 'DELETE FROM products WHERE id = ? AND usuario_id = ?';
        const resultado = await executeQuery(query, [id, usuario_id]);
        return resultado.affectedRows > 0;
    }
}

module.exports = Producto;