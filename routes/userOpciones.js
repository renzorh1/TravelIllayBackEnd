const express = require('express');
const router = express.Router();
const {actualizarActividadesFavoritas, actualizarHorarioPreferido, actualizarIdiomaPreferido} = require('../controllers/userOpcionesController');

// Cambio de preferencias | actividades favoritas
router.put('/:id/actividades', actualizarActividadesFavoritas);

// Cambio de idiomas
router.put('/:id/horario', actualizarHorarioPreferido);

//Cambio de horario de itinerario automatico
router.put('/:id/idioma', actualizarIdiomaPreferido);

module.exports = router;