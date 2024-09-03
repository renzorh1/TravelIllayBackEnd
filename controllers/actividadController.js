const Actividad = require('../models/Actividad');

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

// Obtener todas las actividades
const getAllActividades = async (req, res) => {
  try {
    const actividades = await Actividad.findAll();
    res.status(200).json({ success: true, data: actividades });
  } catch (error) {
    console.error(error);
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
