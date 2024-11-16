// controllers/gestorActividades.js
const ActividadItinerario = require('../models/ActividadItinerario');

const obtenerActividades = async (req, res) => {
  try {
    const actividades = await ActividadItinerario.findAll({
      attributes: ['Id', 'Nombre', 'Tipo', 'Lugar', 'Calificacion', 'HoraInicio', 'HoraFin']
    });
    res.json(actividades);
  } catch (error) {
    console.error("Error al obtener actividades:", error);
    res.status(500).json({ error: "Error al obtener actividades" });
  }
};

module.exports = {
  obtenerActividades
};