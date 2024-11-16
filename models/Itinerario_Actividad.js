const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Actividad = require('./Actividad'); // Importa el modelo Actividad
const Itinerario = require('./Itinerario'); // Importa el modelo Itinerario

const ItinerarioActividad = sequelize.define('ItinerarioActividad', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    itinerario_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'itinerarios',
            key: 'id'
        }
    },
    actividad_id: {
        type: DataTypes.BIGINT,
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

// Asociaciones
ItinerarioActividad.belongsTo(Actividad, {
    foreignKey: 'actividad_id',
    as: 'actividad' // Alias para acceder a los datos de Actividad
});

ItinerarioActividad.belongsTo(Itinerario, {
    foreignKey: 'itinerario_id',
    as: 'itinerario' // Alias para acceder a los datos de Itinerario
});

module.exports = ItinerarioActividad;
