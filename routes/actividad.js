//Define las rutas para el recurso de actividades en una aplicación web utilizando el framework Express.js Utililza un controlador para manejar las solicitudes y respuestas.
const express = require('express'); //Framework Express.js
const router = express.Router(); //Objeto que se utiliza para definir rutas de la aplicación
const { createActividad, getAllActividades, getActividadById, updateActividad, deleteActividad } = require('../controllers/actividadController');
//Objeto que contiene las funciones que manejan las solicitudes y respuestas para el recurso de actividades

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
