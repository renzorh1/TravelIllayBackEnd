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
    allowNull: true, // Permitir nulo si no se proporciona
  },
  idioma_preferencia: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['Español', 'Inglés']], // Validación para restringir los valores
    },
  },
  actividades_favoritas: {
    type: DataTypes.TEXT, // Cambiar a TEXT para almacenar JSON
    allowNull: false,
    defaultValue: JSON.stringify(["Restaurantes", "Parques", "Museos", "Librería"]), // Valor predeterminado como JSON
  },
  hora_inicio_preferida: {
    type: DataTypes.STRING(5), // Cambiar a STRING(5) para "00:00"
    allowNull: true, // Permitir nulo si no se proporciona
    defaultValue: "07:00", // Valor predeterminado cambiado a "07:00"
  },
  hora_fin_preferida: {
    type: DataTypes.STRING(5), // Cambiar a STRING(5) para "00:00"
    allowNull: true, // Permitir nulo si no se proporciona
    defaultValue: "22:00", // Valor predeterminado cambiado a "22:00"
  },
}, {
  tableName: 'usuarios', // Asegúrate de que coincide con el nombre de la tabla en la base de datos
  timestamps: false, // Desactiva createdAt y updatedAt
});

module.exports = Usuario;
