const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItinerarioActividad = sequelize.define('ItinerarioActividad', {
    id: {
        type: DataTypes.BIGINT, // Cambiado a BIGINT para mantener consistencia
        autoIncrement: true,
        primaryKey: true
    },
    itinerario_id: {
        type: DataTypes.BIGINT, // Cambiado a BIGINT
        allowNull: false,
        references: {
            model: 'itinerarios',
            key: 'id'
        }
    },
    actividad_id: {
        type: DataTypes.BIGINT, // Cambiado a BIGINT
        allowNull: false,
        references: {
            model: 'actividades',
            key: 'id'
        }
    }
}, {
    tableName: 'itinerario_actividades',
    timestamps: false
});

module.exports = ItinerarioActividad;
