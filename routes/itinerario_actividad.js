const express = require('express');
const router = express.Router();
const { guardarRelacionItinerarioActividad } = require('../controllers/Itinerario_ActividadController');

// Definir la ruta para guardar la relación entre itinerario y actividad
router.post('/guardarelacion', guardarRelacionItinerarioActividad);

module.exports = router;
