const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Root2151@',
    database: process.env.DB_NAME || 'marketplace_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

//pool de conexiones
const pool = mysql.createPool(dbConfig);

//funcion para obtener una conexion 

const getConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a la base de datos establecida');
        connection.release(); // Liberar la conexión después de usarla
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1); // Salir del proceso si no se puede conectar a la base de datos    
    }
}


//funcion para ejecutar queries

const executeQuery = async (query, params = []) => {
    try {
        const [rows] = await pool.execute(query, params);
        return rows;
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error; // Lanzar el error para que pueda ser manejado por el controlador
    }
}

module.exports = { pool, getConnection, executeQuery }; 