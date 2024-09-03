const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Actividad = sequelize.define('Actividad', {
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
  Horario: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ImagenUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'Actividades',
  timestamps: false, // Desactiva createdAt y updatedAt si no los necesitas
});

module.exports = Actividad;
