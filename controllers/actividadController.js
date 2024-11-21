// actividadController.js
const Actividad = require('../models/Actividad'); // Asegúrate de que la ruta es correcta
const ItinerarioActividad = require('../models/Itinerario_Actividad'); // Asegúrate de usar la ruta y el nombre correctos
const RelacionItinerarioActividad = require('../models/Itinerario_Actividad'); // Reemplaza con la ruta correcta

const guardarActividad = async (req, res) => {
  try {
    const {
      nombre,
      tipo,
      calificacion,
      latitud,
      longitud,
      hora_inicio_preferida,
      hora_fin_preferida
    } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!nombre || !tipo || latitud === undefined || longitud === undefined) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    // Validar que el tipo sea uno de los valores permitidos
    const tiposPermitidos = ['library', 'museum', 'park', 'restaurant'];
    if (!tiposPermitidos.includes(tipo.toLowerCase())) {
      return res.status(400).json({ message: 'El tipo de actividad no es válido. Debe ser uno de los siguientes: "library", "museum", "park", "restaurant".' });
    }

    // Función para convertir una cadena ISO 8601 a un formato adecuado para SQL Server
    const formatToSQLDateTime = (isoTime) => {
      if (!isoTime) return null;
      return isoTime.replace('T', ' ').split('Z')[0]; // Convierte a formato 'YYYY-MM-DD HH:MM:SS'
    };

    // Convertir las horas de inicio y fin al formato adecuado
    const horaInicio = formatToSQLDateTime(hora_inicio_preferida);
    const horaFin = formatToSQLDateTime(hora_fin_preferida);

    // Validar que las horas sean correctas
    if (!horaInicio || !horaFin) {
      return res.status(400).json({ message: 'Las horas deben tener un formato válido.' });
    }

    // Crear la nueva actividad
    const nuevaActividad = await Actividad.create({
      nombre,
      tipo,
      calificacion: calificacion || null, // Manejar la calificación opcionalmente
      latitud,
      longitud,
      hora_inicio_preferida: horaInicio,
      hora_fin_preferida: horaFin
    });

    // Devolver la actividad creada
    res.status(201).json({
      id: nuevaActividad.id, // Retornar el ID de la actividad creada
      nombre: nuevaActividad.nombre,
      tipo: nuevaActividad.tipo,
      calificacion: nuevaActividad.calificacion,
      latitud: nuevaActividad.latitud,
      longitud: nuevaActividad.longitud,
      hora_inicio_preferida: nuevaActividad.hora_inicio_preferida,
      hora_fin_preferida: nuevaActividad.hora_fin_preferida
    });
  } catch (error) {
    console.error('Error al guardar actividad:', error);
    res.status(500).json({ message: 'Error al guardar la actividad', error: error.message });
  }
};

const eliminarActividad = async (req, res) => {
  try {
    const { actividadId } = req.params; // ID de la actividad a eliminar

    // Eliminar las relaciones en la tabla itinerario_actividades
    await ItinerarioActividad.destroy({
      where: { actividad_id: actividadId },
    });

    // Luego, eliminar la actividad
    const resultado = await Actividad.destroy({
      where: { id: actividadId },
    });

    if (resultado) {
      res.status(200).json({ message: 'Actividad eliminada con éxito' });
    } else {
      res.status(404).json({ message: 'Actividad no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar actividad:', error);
    res.status(500).json({
      message: 'Error al eliminar la actividad',
      error: error.message,
    });
  }
};

// Backend: Asegúrate de que la relación esté bien configurada
const obtenerActividadesConId = async (req, res) => {
  try {
    const { itinerarioId } = req.params;

    // Verificar que el itinerarioId es válido
    if (!itinerarioId) {
      return res.status(400).json({ message: 'Itinerario ID es obligatorio.' });
    }

    const relaciones = await RelacionItinerarioActividad.findAll({
      where: { itinerario_id: itinerarioId },
      include: [
        {
          model: Actividad,
          as: 'actividad',
        },
      ],
    });

    if (!relaciones || relaciones.length === 0) {
      return res.status(404).json({ message: 'No se encontraron actividades para este itinerario.' });
    }

    const actividades = relaciones.map((relacion) => relacion.actividad);

    res.status(200).json(actividades);
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({ message: 'Error al obtener actividades.', error: error.message });
  }
};

module.exports = {
  guardarActividad,
  eliminarActividad,
  obtenerActividadesConId
};
