// models/ActividadItinerario.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ActividadItinerario = sequelize.define('ActividadItinerario', {
  Id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  Nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Tipo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['Restaurantes', 'Parques', 'Museos', 'Eventos', 'Clubes']]
    }
  },
  Lugar: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Latitud: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  Longitud: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  Calificacion: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
  },
  HoraInicio: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  HoraFin: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  ImagenUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'ActividadesItinerario',
  timestamps: false
});

module.exports = ActividadItinerario;
