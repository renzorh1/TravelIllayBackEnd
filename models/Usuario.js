const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'Id'
  },
  Nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Celular: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  Correo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  Contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'Contraseña'
  },
  Preferencias: {
    type: Sequelize.TEXT, // Este campo debe manejar objetos JSON directamente
    allowNull: false,
    defaultValue: {
      actividades_favoritas: [],
      horario_preferido: {
        inicio: "00:00",
        fin: "00:00"
      },
      idioma_preferido: "es"
    }
  },
}, {
  tableName: 'Usuarios',
  timestamps: false, // Esto desactiva createdAt y updatedAt
});

module.exports = Usuario;