
const Itinerario = require('../models/Itinerario'); // Modelo del itinerario
const Actividad = require('../models/Actividad'); // Modelo de la actividad
const ItinerarioActividad = require('../models/Itinerario_Actividad');

// Definir la función para guardar la relación entre itinerario y actividad
const guardarRelacionItinerarioActividad = async (req, res) => {
    console.log("Request Body:", req.body); // Log para depurar el cuerpo de la solicitud
    try {
        const { itinerarioId, actividadId } = req.body;

        // Validar los IDs
        if (!itinerarioId || typeof itinerarioId !== 'number' || itinerarioId < 1) {
            return res.status(400).json({ message: 'itinerarioId es requerido y debe ser un número válido mayor que 0' });
        }

        if (!actividadId || typeof actividadId !== 'number' || actividadId < 1) {
            return res.status(400).json({ message: 'actividadId es requerido y debe ser un número válido mayor que 0' });
        }

        // Verificar que el itinerario exista
        const itinerario = await Itinerario.findByPk(itinerarioId);
        if (!itinerario) {
            return res.status(404).json({ message: `No se encontró el itinerario con id ${itinerarioId}` });
        }

        // Verificar que la actividad exista
        const actividad = await Actividad.findByPk(actividadId);
        if (!actividad) {
            return res.status(404).json({ message: `No se encontró la actividad con id ${actividadId}` });
        }

        // Si ambos existen, crear la nueva relación
        const nuevaRelacion = await ItinerarioActividad.create({ 
            itinerario_id: itinerarioId, 
            actividad_id: actividadId 
        });

        res.status(201).json({ message: 'Relación guardada exitosamente', nuevaRelacion });
    } catch (error) {
        console.error('Error al guardar relación:', error);
        res.status(500).json({ message: 'Error al guardar relación', error: error.message });
    }
};

const obtenerActividadesDeItinerario = async (req, res) => {
    const { itinerarioId } = req.params;

    try {
        const actividades = await ItinerarioActividad.findAll({
            where: { itinerario_id: itinerarioId },
            include: [
                {
                    model: Actividad,
                    as: 'actividad',
                    attributes: ['nombre', 'calificacion', 'hora_inicio_preferida', 'hora_fin_preferida']
                }
            ]
        });

        if (!actividades || actividades.length === 0) {
            return res.status(404).json({ message: `No se encontraron actividades para el itinerario con ID: ${itinerarioId}` });
        }

        // Formatear las horas
        const actividadesFormateadas = actividades.map((actividadRelacion) => {
            const actividad = actividadRelacion.actividad;

            return {
                id: actividadRelacion.id,
                itinerario_id: actividadRelacion.itinerario_id,
                actividad_id: actividadRelacion.actividad_id,
                actividad: {
                    nombre: actividad.nombre,
                    calificacion: actividad.calificacion,
                    hora_inicio_preferida: new Date(actividad.hora_inicio_preferida).toISOString().substr(11, 5), // Extrae solo HH:mm
                    hora_fin_preferida: new Date(actividad.hora_fin_preferida).toISOString().substr(11, 5) // Extrae solo HH:mm
                }
            };
        });

        res.status(200).json({ actividades: actividadesFormateadas });
    } catch (error) {
        console.error('Error al obtener actividades del itinerario:', error);
        res.status(500).json({ message: 'Error al obtener actividades del itinerario', error: error.message });
    }
};

// Exportar la función
module.exports = {
   
    guardarRelacionItinerarioActividad,
    obtenerActividadesDeItinerario

    
};
