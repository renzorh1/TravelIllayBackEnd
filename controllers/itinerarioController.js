// controllers/itinerarioController.js
const Itinerario = require('../models/Itinerario'); // Importa el modelo
const moment = require('moment'); // Importa moment para manejar el formato de la fecha
const ItinerarioActividad = require('../models/itinerario_actividad'); // Asegúrate de que la ruta sea correcta
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

// Obtener el próximo ID de itinerario (último ID + 1)
const obtenerUltimoItinerarioId = async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const ultimoItinerario = await Itinerario.findOne({
            where: { usuario_id: usuario_id },
            order: [['fecha_creacion', 'DESC']] // Ordenar por la fecha más reciente
        });

        // Convertir el último ID a número, sumar 1 y devolverlo
        const proximoId = ultimoItinerario ? parseInt(ultimoItinerario.id, 10) + 1 : 1;
        console.log('Próximo itinerario ID calculado:', proximoId);

        res.status(200).json({
            proximoId: proximoId,
            message: 'Próximo itinerario ID obtenido con éxito'
        });
    } catch (error) {
        console.error('Error al obtener el próximo itinerario ID:', error);
        res.status(500).json({ error: 'Error al obtener el próximo itinerario ID' });
    }
};

const obtenerItinerariosPorUsuario = async (req, res) => {
    const { usuario_id } = req.params; // Obtener el usuario_id de los parámetros

    try {
        // Buscar todos los itinerarios del usuario especificado
        const itinerarios = await Itinerario.findAll({
            where: { usuario_id: usuario_id },
            order: [['fecha_creacion', 'DESC']] // Ordenar por la fecha de creación descendente
        });

        if (itinerarios.length > 0) {
            res.status(200).json({
                itinerarios: itinerarios,
                message: `Se encontraron ${itinerarios.length} itinerario(s) para el usuario con ID: ${usuario_id}`,
            });
        } else {
            res.status(404).json({ message: 'No se encontraron itinerarios para este usuario.' });
        }
    } catch (error) {
        console.error('Error al obtener itinerarios por usuario:', error);
        res.status(500).json({ error: 'Error al obtener itinerarios por usuario', details: error.message });
    }
};

// Eliminar un itinerario por ID
const eliminarItinerario = async (req, res) => {
    const { itinerario_id } = req.params; // ID del itinerario a eliminar

    try {
        // Eliminar todas las actividades asociadas al itinerario
        await ItinerarioActividad.destroy({
            where: { itinerario_id }
        });

        // Eliminar el itinerario
        const resultado = await Itinerario.destroy({
            where: { id: itinerario_id }
        });

        if (resultado) {
            res.status(200).json({ message: 'Itinerario eliminado con éxito' });
        } else {
            res.status(404).json({ error: 'Itinerario no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar itinerario:', error);
        res.status(500).json({ error: 'Error al eliminar itinerario', details: error.message });
    }
};

module.exports = { crearItinerario, eliminarUltimoItinerario, obtenerUltimoItinerarioId, obtenerItinerariosPorUsuario, eliminarItinerario };
