const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sucursal = sequelize.define('Sucursal', {
  // Campo ID (se crea automáticamente)
  
  // Nombre de la sucursal
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: 'El nombre es obligatorio' },
      notEmpty: { msg: 'El nombre no puede estar vacío' },
      len: {
        args: [3, 100],
        msg: 'El nombre debe tener entre 3 y 100 caracteres'
      }
    }
  },
  
  // Dirección física (cambiado de ubicacion a direccion)
  direccion: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notNull: { msg: 'La dirección es obligatoria' },
      notEmpty: { msg: 'La dirección no puede estar vacía' },
      len: {
        args: [5, 200],
        msg: 'La dirección debe tener entre 5 y 200 caracteres'
      }
    }
  },
  
  // Número de teléfono
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      notNull: { msg: 'El teléfono es obligatorio' },
      notEmpty: { msg: 'El teléfono no puede estar vacío' },
      is: {
        args: /^[0-9()+\-\s]{7,15}$/,
        msg: 'Formato de teléfono inválido'
      }
    }
  },
  
  // Estado activo (cambiado de activa a activo)
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    validate: {
      notNull: { msg: 'El estado es obligatorio' }
    }
  }
}, {
  // Opciones adicionales
  tableName: 'sucursales', // Nombre exacto de la tabla en la base de datos
  timestamps: true, // Habilita createdAt y updatedAt
  paranoid: true, // Habilita eliminación (soft delete)
  
  // Configuración para SQL Server
  schema: 'dbo', // Esquema predeterminado en SQL Server
  freezeTableName: true, // Evita la pluralización automática
});

// Hooks
Sucursal.addHook('beforeCreate', (sucursal) => {
  // Normalizar teléfono antes de guardar
  if (sucursal.telefono) {
    sucursal.telefono = sucursal.telefono.replace(/[^\d+]/g, '');
  }
});

Sucursal.addHook('beforeUpdate', (sucursal) => {
  // Normalizar teléfono antes de actualizar
  if (sucursal.changed('telefono')) {
    sucursal.telefono = sucursal.telefono.replace(/[^\d+]/g, '');
  }
});

module.exports = Sucursal;