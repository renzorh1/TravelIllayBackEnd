const express = require('express');
const router = express.Router();
const { createActividad, getAllActividades, getActividadById, updateActividad, deleteActividad } = require('../controllers/actividadController');

// Ruta para crear una nueva actividad
router.post('/actividades', createActividad);

// Ruta para obtener todas las actividades
router.get('/actividades', getAllActividades);

// Ruta para obtener una actividad por ID
router.get('/actividades/:id', getActividadById);

// Ruta para actualizar una actividad
router.put('/actividades/:id', updateActividad);

// Ruta para eliminar una actividad
router.delete('/actividades/:id', deleteActividad);

module.exports = router;
