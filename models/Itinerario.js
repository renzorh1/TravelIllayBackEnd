const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Itinerario = sequelize.define('Itinerario', {
    id: {
        type: DataTypes.INTEGER, // Cambiado a INTEGER
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER, // Cambiado a INTEGER
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_creacion: {
        type: DataTypes.DATE, // Cambiado a DataTypes.DATE
        allowNull: false
    },
    es_activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'itinerarios',
    timestamps: false
});

module.exports = Itinerario;
