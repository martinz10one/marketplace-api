const Producto = require('../models/producto');
const { generarDescripcionConIA } = require('../services/aiService'); // Importamos la IA

// 1. Crear producto con asistencia de IA
const crear = async (req, res) => {
    try {
        let { nombre, descripcion, precio, stock, categoria } = req.body;
        const usuario_id = req.usuario.id; 

        // LÓGICA INTELIGENTE:
        // Si el usuario NO envía descripción, la IA la genera automáticamente
        if (!descripcion || descripcion.trim() === "") {
            console.log(`Generando descripción automática para: ${nombre}...`);
            const sugerenciaIA = await generarDescripcionConIA(nombre);
            descripcion = sugerenciaIA.descripcion;
            
            // Si tampoco envió categoría, usamos la que sugiere la IA
            if (!categoria) {
                categoria = sugerenciaIA.categoria;
            }
        }

        const nuevoProducto = await Producto.crear({
            nombre, 
            descripcion, 
            precio, 
            stock, 
            categoria, 
            usuario_id
        });

        res.status(201).json({
            error: false,
            mensaje: 'Producto creado exitosamente (IA Asistida)',
            data: nuevoProducto
        });
    } catch (error) {
        res.status(500).json({ error: true, mensaje: error.message });
    }
};

// 2. Obtener todos los productos
const obtenerTodos = async (req, res) => {
    try {
        const productos = await Producto.obtenerTodos();
        res.status(200).json({ error: false, data: productos });
    } catch (error) {
        res.status(500).json({ error: true, mensaje: error.message });
    }
};

// 3. Obtener un producto por ID
const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.obtenerPorId(id);
        if (!producto) {
            return res.status(404).json({ error: true, mensaje: "Producto no encontrado" });
        }
        res.status(200).json({ error: false, data: producto });
    } catch (error) {
        res.status(500).json({ error: true, mensaje: error.message });
    }
};

// Exportamos las funciones actualizadas
module.exports = { 
    crear, 
    obtenerTodos, 
    obtenerPorId 
};