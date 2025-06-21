const Sucursal = require('../models/sucursal');
const { Op } = require('sequelize');

const sucursalController = {
    // Obtener todas las sucursales
    obtenerTodas: async (req, res) => {
        try {
            const { activo, ciudad, estado } = req.query;
            
            // Construir filtros dinámicos
            const filtros = {};
            if (activo !== undefined) {
                filtros.activo = activo === 'true';
            }
            if (ciudad) {
                filtros.direccion = { [Op.like]: `%${ciudad}%` };
            }
            if (estado) {
                filtros.direccion = { [Op.like]: `%${estado}%` };
            }

            const sucursales = await Sucursal.findAll({
                where: filtros,
                order: [['nombre', 'ASC']]
            });

            res.json({
                success: true,
                data: sucursales,
                total: sucursales.length
            });
        } catch (error) {
            console.error('Error al obtener sucursales:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Obtener sucursal por ID
    obtenerPorId: async (req, res) => {
        try {
            const { id } = req.params;
            
            const sucursal = await Sucursal.findByPk(id);
            
            if (!sucursal) {
                return res.status(404).json({
                    success: false,
                    message: 'Sucursal no encontrada'
                });
            }

            res.json({
                success: true,
                data: sucursal
            });
        } catch (error) {
            console.error('Error al obtener sucursal:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Crear nueva sucursal
    crear: async (req, res) => {
        try {
            const nuevaSucursal = await Sucursal.create(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Sucursal creada exitosamente',
                data: nuevaSucursal
            });
        } catch (error) {
            console.error('Error al crear sucursal:', error);
            
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de validación incorrectos',
                    errors: error.errors.map(err => ({
                        campo: err.path,
                        mensaje: err.message
                    }))
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Actualizar sucursal
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            
            const sucursal = await Sucursal.findByPk(id);
            
            if (!sucursal) {
                return res.status(404).json({
                    success: false,
                    message: 'Sucursal no encontrada'
                });
            }

            await sucursal.update(req.body);
            
            res.json({
                success: true,
                message: 'Sucursal actualizada exitosamente',
                data: sucursal
            });
        } catch (error) {
            console.error('Error al actualizar sucursal:', error);
            
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de validación incorrectos',
                    errors: error.errors.map(err => ({
                        campo: err.path,
                        mensaje: err.message
                    }))
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Eliminar sucursal (soft delete)
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            
            const sucursal = await Sucursal.findByPk(id);
            
            if (!sucursal) {
                return res.status(404).json({
                    success: false,
                    message: 'Sucursal no encontrada'
                });
            }

            // Desactivar en lugar de eliminar físicamente
            await sucursal.update({ 
                activo: false
            });
            
            res.json({
                success: true,
                message: 'Sucursal desactivada exitosamente'
            });
        } catch (error) {
            console.error('Error al desactivar sucursal:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    // Reactivar sucursal
    reactivar: async (req, res) => {
        try {
            const { id } = req.params;
            
            const sucursal = await Sucursal.findByPk(id);
            
            if (!sucursal) {
                return res.status(404).json({
                    success: false,
                    message: 'Sucursal no encontrada'
                });
            }

            await sucursal.update({ 
                activo: true
            });
            
            res.json({
                success: true,
                message: 'Sucursal reactivada exitosamente',
                data: sucursal
            });
        } catch (error) {
            console.error('Error al reactivar sucursal:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
};

module.exports = sucursalController;