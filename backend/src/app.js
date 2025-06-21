const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const sucursalesRoutes = require('./routes/sucursales');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas
app.use('/api/sucursales', sucursalesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'API de Sucursales - SomosCrédito',
        version: '1.0.0',
        endpoints: {
            sucursales: '/api/sucursales'
        }
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error global:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

module.exports = app;