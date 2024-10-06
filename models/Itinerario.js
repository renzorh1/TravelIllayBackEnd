const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Itinerario = sequelize.define('Itinerario', {
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Lugar: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    HoraInicio: {
        type: DataTypes.STRING,  // Cambiado a STRING
        allowNull: false,
    },
    HoraFin: {
        type: DataTypes.STRING,  // Cambiado a STRING
        allowNull: false,
    },
    UsuarioId: {
        type: DataTypes.BIGINT,  // Asegúrate de que coincida con la columna Id de la tabla Usuarios
        references: {
            model: 'Usuarios',  // Nombre de la tabla Usuarios
            key: 'Id',
        },
    },
}, {
    timestamps: false,  // Elimina createdAt y updatedAt
    tableName: 'Itinerarios',
});

module.exports = Itinerario;