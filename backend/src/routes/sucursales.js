const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Sucursal = require('../models/sucursal');

// GET todas las sucursales
router.get('/', async (req, res) => {
  try {
    console.log('📋 GET /api/sucursales - Obteniendo todas las sucursales');
    
    const sucursales = await Sucursal.findAll({
      order: [['createdAt', 'DESC']] // Más recientes primero
    });
    
    console.log(`✅ Se encontraron ${sucursales.length} sucursales`);
    
    res.json({
      success: true,
      total: sucursales.length,
      data: sucursales
    });
  } catch (error) {
    console.error('❌ Error al obtener sucursales:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// GET sucursal por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 GET /api/sucursales/${id} - Buscando sucursal por ID`);
    
    const sucursal = await Sucursal.findByPk(id);
    
    if (!sucursal) {
      console.log(`❌ Sucursal con ID ${id} no encontrada`);
      return res.status(404).json({
        success: false,
        message: 'Sucursal no encontrada'
      });
    }
    
    console.log('✅ Sucursal encontrada:', sucursal.nombre);
    
    res.json({
      success: true,
      data: sucursal
    });
  } catch (error) {
    console.error('❌ Error al obtener sucursal:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// POST nueva sucursal
router.post('/', async (req, res) => {
  try {
    console.log('🆕 POST /api/sucursales - Creando nueva sucursal');
    console.log('📥 Datos recibidos:', req.body);
    
    const { nombre, direccion, telefono, activo } = req.body;
    
    // Validaciones básicas
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido y debe ser una cadena de texto válida'
      });
    }
    
    if (!direccion || typeof direccion !== 'string' || direccion.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'La dirección es requerida y debe ser una cadena de texto válida'
      });
    }
    
    if (!telefono || typeof telefono !== 'string' || telefono.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El teléfono es requerido y debe ser una cadena de texto válida'
      });
    }
    
    // Preparar datos limpios
    const datosLimpios = {
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      telefono: telefono.trim(),
      activo: activo !== undefined ? Boolean(activo) : true
    };
    
    console.log('🧹 Datos limpios preparados:', datosLimpios);
    
    // Verificar si ya existe una sucursal con el mismo nombre
    const sucursalExistente = await Sucursal.findOne({
      where: { 
        nombre: datosLimpios.nombre
      }
    });
    
    if (sucursalExistente) {
      console.log('❌ Nombre duplicado encontrado');
      return res.status(409).json({
        success: false,
        message: 'Ya existe una sucursal con ese nombre',
        sucursal_existente: {
          id: sucursalExistente.id,
          nombre: sucursalExistente.nombre,
          direccion: sucursalExistente.direccion
        }
      });
    }
    
    // Crear la nueva sucursal
    console.log('💾 Creando sucursal en la base de datos...');
    const nuevaSucursal = await Sucursal.create(datosLimpios);
    
    console.log('✅ Sucursal creada exitosamente:', {
      id: nuevaSucursal.id,
      nombre: nuevaSucursal.nombre
    });
    
    res.status(201).json({
      success: true,
      message: 'Sucursal creada exitosamente',
      data: nuevaSucursal
    });
    
  } catch (error) {
    console.error('❌ Error al crear sucursal:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const errores = error.errors.map(err => ({
        campo: err.path,
        mensaje: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errores: errores
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
});

// PUT actualizar sucursal
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 PUT /api/sucursales/${id} - Actualizando sucursal`);
    console.log('📥 Datos recibidos:', req.body);
    
    const { nombre, direccion, telefono, activo } = req.body;
    
    // Verificar si la sucursal existe
    const sucursal = await Sucursal.findByPk(id);
    if (!sucursal) {
      console.log(`❌ Sucursal con ID ${id} no encontrada para actualizar`);
      return res.status(404).json({
        success: false,
        message: 'Sucursal no encontrada'
      });
    }
    
    // Preparar datos para actualizar (solo campos que llegaron)
    const datosActualizar = {};
    
    if (nombre !== undefined) {
      if (!nombre || nombre.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'El nombre no puede estar vacío'
        });
      }
      datosActualizar.nombre = nombre.trim();
    }
    
    if (direccion !== undefined) {
      if (!direccion || direccion.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'La dirección no puede estar vacía'
        });
      }
      datosActualizar.direccion = direccion.trim();
    }
    
    if (telefono !== undefined) {
      if (!telefono || telefono.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'El teléfono no puede estar vacío'
        });
      }
      datosActualizar.telefono = telefono.trim();
    }
    
    if (activo !== undefined) {
      datosActualizar.activo = Boolean(activo);
    }
    
    // Verificar que al menos se envió un campo para actualizar
    if (Object.keys(datosActualizar).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un campo para actualizar'
      });
    }
    
    console.log('🧹 Datos preparados para actualizar:', datosActualizar);
    
    // Validación específica para el nombre (si se está actualizando)
    if (datosActualizar.nombre && datosActualizar.nombre !== sucursal.nombre) {
      const nombreExistente = await Sucursal.findOne({
        where: { 
          nombre: datosActualizar.nombre,
          id: {
            [Op.ne]: id
          }
        }
      });
      
      if (nombreExistente) {
        console.log('❌ Nombre duplicado en actualización');
        return res.status(409).json({
          success: false,
          message: 'Ya existe otra sucursal con ese nombre'
        });
      }
    }
    
    // Actualizar la sucursal
    console.log('💾 Actualizando en la base de datos...');
    await sucursal.update(datosActualizar);
    
    // Obtener sucursal actualizada
    const sucursalActualizada = await Sucursal.findByPk(id);
    
    console.log('✅ Sucursal actualizada exitosamente');
    
    res.json({
      success: true,
      message: `Sucursal actualizada exitosamente. Campos actualizados: ${Object.keys(datosActualizar).join(', ')}`,
      data: sucursalActualizada
    });
    
  } catch (error) {
    console.error('❌ Error al actualizar sucursal:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const errores = error.errors.map(err => ({
        campo: err.path,
        mensaje: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errores: errores
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// DELETE eliminar sucursal (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /api/sucursales/${id} - Eliminando sucursal`);
    
    // Verificar si la sucursal existe
    const sucursal = await Sucursal.findByPk(id);
    if (!sucursal) {
      console.log(`❌ Sucursal con ID ${id} no encontrada para eliminar`);
      return res.status(404).json({
        success: false,
        message: 'Sucursal no encontrada'
      });
    }
    
    // Eliminar sucursal (soft delete)
    await Sucursal.destroy({
      where: { id: id }
    });
    
    console.log('✅ Sucursal eliminada exitosamente');
    
    res.json({
      success: true,
      message: 'Sucursal eliminada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error al eliminar sucursal:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// PATCH reactivar sucursal eliminada
router.patch('/:id/reactivar', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 PATCH /api/sucursales/${id}/reactivar - Reactivando sucursal`);
    
    // Buscar sucursal eliminada
    const sucursal = await Sucursal.findByPk(id, {
      paranoid: false // Incluir registros eliminados
    });
    
    if (!sucursal) {
      console.log(`❌ Sucursal con ID ${id} no encontrada para reactivar`);
      return res.status(404).json({
        success: false,
        message: 'Sucursal no encontrada'
      });
    }
    
    if (!sucursal.deletedAt) {
      console.log(`❌ Sucursal con ID ${id} ya está activa`);
      return res.status(400).json({
        success: false,
        message: 'La sucursal ya está activa'
      });
    }
    
    // Reactivar sucursal
    await sucursal.restore();
    
    console.log('✅ Sucursal reactivada exitosamente');
    
    res.json({
      success: true,
      message: 'Sucursal reactivada exitosamente',
      data: sucursal
    });
    
  } catch (error) {
    console.error('❌ Error al reactivar sucursal:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;