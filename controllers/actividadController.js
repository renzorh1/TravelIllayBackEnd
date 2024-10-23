// actividadController.js
const Actividad = require('../models/Actividad'); // Asegúrate de que la ruta es correcta

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

    // Crear la nueva actividad
    const nuevaActividad = await Actividad.create({
      nombre,
      tipo,
      calificacion: calificacion || null, // Manejar la calificación opcionalmente
      latitud,
      longitud,
      hora_inicio_preferida,
      hora_fin_preferida
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

module.exports = {
  guardarActividad
};
