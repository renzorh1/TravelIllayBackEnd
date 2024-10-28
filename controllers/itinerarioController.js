// controllers/itinerarioController.js
const Itinerario = require('../models/Itinerario'); // Importa el modelo
const moment = require('moment'); // Importa moment para manejar el formato de la fecha

// Crear un nuevo itinerario
const crearItinerario = async (req, res) => {
    const { usuario_id, nombre } = req.body;
    const fecha_creacion = moment().toISOString();

    try {
        const nuevoItinerario = await Itinerario.create({
            usuario_id,
            nombre,
            fecha_creacion,
            es_activo: true
        });

        console.log('Itinerario creado:', nuevoItinerario); // Verifica si el ID es correcto

        res.status(201).json({
            message: 'Itinerario creado con éxito',
            itinerario: {
                id: nuevoItinerario.id, // Asegúrate de que este valor esté presente
                usuario_id: nuevoItinerario.usuario_id,
                nombre: nuevoItinerario.nombre,
                fecha_creacion: nuevoItinerario.fecha_creacion,
                es_activo: nuevoItinerario.es_activo
            }
        });
    } catch (error) {
        console.error('Error al crear itinerario:', error);
        res.status(500).json({
            error: 'Error al crear itinerario',
            details: error.message
        });
    }
};

// Eliminar el último itinerario
const eliminarUltimoItinerario = async (req, res) => {
    const { usuario_id } = req.params; // Obtén el usuario_id del parámetro
    console.log('Usuario ID recibido:', usuario_id); // Log para verificar el ID del usuario

    try {
        // Obtener el último itinerario creado por el usuario
        const ultimoItinerario = await Itinerario.findOne({
            where: { usuario_id: usuario_id },
            order: [['fecha_creacion', 'DESC']] // Ordenar por fecha de creación descendente
        });

        // Verificar si se encontró un itinerario
        if (!ultimoItinerario) {
            return res.status(404).json({ error: 'No se encontró itinerario para el usuario' });
        }

        // Eliminar el itinerario encontrado
        const resultado = await Itinerario.destroy({ where: { id: ultimoItinerario.id } });

        if (resultado) {
            res.status(200).json({ message: 'Último itinerario eliminado con éxito' });
        } else {
            res.status(404).json({ error: 'Error al eliminar el itinerario' });
        }
    } catch (error) {
        console.error('Error al eliminar itinerario:', error);
        res.status(500).json({ error: 'Error al eliminar itinerario' });
    }
};

module.exports = { crearItinerario, eliminarUltimoItinerario };
