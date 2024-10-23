// Actividades.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de que 'sequelize' esté correctamente configurado

const Actividad = sequelize.define('Actividad', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  calificacion: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  latitud: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  longitud: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  hora_inicio_preferida: {
    type: DataTypes.TIME,
    allowNull: true
  },
  hora_fin_preferida: {
    type: DataTypes.TIME,
    allowNull: true
  }
}, {
  tableName: 'actividades',  // Asegúrate de que coincide con el nombre de tu tabla en la base de datos
  timestamps: false          // Si no usas las columnas 'createdAt' y 'updatedAt'
});

module.exports = Actividad;
