// controllers/itinerarioController.js
const sql = require('mssql');
const config = require('../config/database');
const Itinerario = require('../models/Itinerario'); // Importa el modelo
const moment = require('moment'); // Importa moment para manejar el formato de la fecha

const crearItinerario = async (req, res) => {
    const { usuario_id, nombre } = req.body;
    const fecha_creacion = moment().format('YYYY-MM-DD'); // Asigna la fecha actual en formato de cadena

    try {
        const nuevoItinerario = await Itinerario.create({
            usuario_id,
            nombre,
            fecha_creacion,
            es_activo: true // Default a true
        });
        res.status(201).json({ message: 'Itinerario creado con éxito', itinerario: nuevoItinerario });
    } catch (error) {
        console.error('Error al crear itinerario:', error);
        res.status(500).json({ error: 'Error al crear itinerario' });
    }
};

module.exports = { crearItinerario };
