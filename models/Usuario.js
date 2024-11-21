const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'contrasena'
  },
  numero_celular: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  idioma_preferencia: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['Español', 'Inglés']],
    },
  },
  actividades_favoritas: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: JSON.stringify(["restaurant", "park", "museum", "library"]),
  },

  hora_inicio_preferida: {
    type: DataTypes.TIME, // Cambiado a TIME
    allowNull: true,
  },
  hora_fin_preferida: {
    type: DataTypes.TIME, // Cambiado a TIME
    allowNull: true,
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

module.exports = Usuario;
