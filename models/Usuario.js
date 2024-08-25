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
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('Preferencias');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('Preferencias', JSON.stringify(value));
    }
  },
}, {
  tableName: 'Usuarios',
  timestamps: false, // Esto desactiva createdAt y updatedAt
});

module.exports = Usuario;