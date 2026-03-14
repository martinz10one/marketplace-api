const express= require('express');
const cors = require('cors');
const morgan = require('morgan');
const {pool, getConnection, executeQuery} = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');

const usuarioRoutes = require('./src/routes/usuarioRoutes');
const productoRoutes = require('./src/routes/productoRoutes');

require('dotenv').config();
getConnection();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true}));
app.use('/api/auth', authRoutes);


//middleware para archovos estaticos
app.use('/uploads', express.static('uploads'));

// Rutas
app.get('/', (req, res) => {
    res.json({
        message: 'marketplace API',
        version: '1.0.0',
        documentation: '/api-docs'
    });
});

app.use('/api/usuarios', usuarioRoutes);

app.use('/api/productos', productoRoutes);


//manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: true,
        message:'endpoint no encontrado'
    });
});

//middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: 'endpoint no encontrado'
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
    console.log(`logs:${process.env.NODE_ENV || 'development'}`);
    
});

