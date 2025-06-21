const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mssql',
        dialectOptions: {
            options: {
                encrypt: false, // true para Azure SQL
                trustServerCertificate: true // true para desarrollo local
            }
        },
        logging: console.log, // Muestra las consultas SQL en consola
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: true
        }
    }
);

// Probar la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('✗ No se pudo conectar a la base de datos:', error.message);
    }
};

testConnection();

module.exports = sequelize;