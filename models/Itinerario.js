// models/Itinerario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Conexión de la base de datos

const Itinerario = sequelize.define('Itinerario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_creacion: {
        type: DataTypes.STRING, // Define como String
        allowNull: false
    },
    es_activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'Itinerarios',
    timestamps: false // Deshabilita timestamps automáticos
});

module.exports = Itinerario;
