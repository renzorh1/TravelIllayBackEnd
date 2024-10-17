//*Manejar solicitudes y respuestas para el recurso de actividades
const Actividad = require('../models/ActividadItinerario'); //Modelo de BD para el recurso de actividades
const axios = require('axios');//Biblioteca para realizar solicitudes HTTP a la API de Google Places

// Coordenadas de Lima, Perú
const limaLocation = {
  lat: -12.0464,
  lng: -77.0428
};

// Radio en metros
const radius = 10000; // 10 km

// Tu clave de API
const API_KEY = 'AIzaSyDr1xH61ZEU3KeMKtAiK_BxbsH7tPNtR-U';

// Crear una nueva actividad
const createActividad = async (req, res) => {
  try {
    const { Nombre, Tipo, Lugar, Latitud, Longitud, Calificacion, Horario, ImagenUrl } = req.body;
    
    const actividad = await Actividad.create({
      Nombre,
      Tipo,
      Lugar,
      Latitud,
      Longitud,
      Calificacion,
      Horario,
      ImagenUrl
    });

    res.status(201).json({ success: true, message: "Actividad creada exitosamente", data: actividad });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al crear actividad" });
  }
};

// Obtener todas las actividades, incluyendo lugares cercanos de Google Places
const getAllActividades = async (req, res) => {
  try {
    // Obtener actividades de la base de datos
    const actividades = await Actividad.findAll();

    // Obtener lugares cercanos de Google Places
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: `${limaLocation.lat},${limaLocation.lng}`,
        radius: radius,
        key: API_KEY
      }
    });

    const googlePlaces = response.data.results;

    // Combinar actividades de la base de datos con lugares cercanos
    const combinedData = [
      ...actividades.map(actividad => ({
        id: actividad.id,
        nombre: actividad.Nombre,
        tipo: actividad.Tipo,
        lugar: actividad.Lugar,
        latitud: actividad.Latitud,
        longitud: actividad.Longitud,
        calificacion: actividad.Calificacion,
      horario: actividad.Horario,
        imagenUrl: actividad.ImagenUrl
      })),
      ...googlePlaces.map(place => ({
        id: place.place_id,
        nombre: place.name,
        tipo: place.types.join(', '),
        lugar: place.vicinity,
        latitud: place.geometry.location.lat,
        longitud: place.geometry.location.lng,
        calificacion: place.rating,
        horario: place.opening_hours ? (place.opening_hours.open_now ? 'Abierto' : 'Cerrado') : 'No disponible',
        imagenUrl: place.icon
      }))
    ];

    res.status(200).json({ success: true, data: combinedData });
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({ success: false, message: "Error al obtener actividades" });
  }
};

// Obtener una actividad por ID
const getActividadById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const actividad = await Actividad.findByPk(id);
    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }

    res.status(200).json({ success: true, data: actividad });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener actividad" });
  }
};

// Actualizar una actividad
const updateActividad = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const { Nombre, Tipo, Lugar, Latitud, Longitud, Calificacion, Horario, ImagenUrl } = req.body;
    const actividad = await Actividad.findByPk(id);

    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }

    actividad.Nombre = Nombre || actividad.Nombre;
    actividad.Tipo = Tipo || actividad.Tipo;
    actividad.Lugar = Lugar || actividad.Lugar;
    actividad.Latitud = Latitud || actividad.Latitud;
    actividad.Longitud = Longitud || actividad.Longitud;
    actividad.Calificacion = Calificacion || actividad.Calificacion;
    actividad.Horario = Horario || actividad.Horario;
    actividad.ImagenUrl = ImagenUrl || actividad.ImagenUrl;

    await actividad.save();

    res.status(200).json({ success: true, message: "Actividad actualizada exitosamente", data: actividad });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al actualizar actividad" });
  }
};

// Eliminar una actividad
const deleteActividad = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const actividad = await Actividad.findByPk(id);
    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }

    await actividad.destroy();

    res.status(200).json({ success: true, message: "Actividad eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al eliminar actividad" });
  }
};

module.exports = {
  createActividad,
  getAllActividades,
  getActividadById,
  updateActividad,
  deleteActividad
};
