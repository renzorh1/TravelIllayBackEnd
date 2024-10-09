const express = require('express');
const router = express.Router();
const {selectItinerario, createManualItinerario, createAutomaticItinerario} = require('../controllers/itinerarioController');
const { obtenerItinerariosPorUsuario } = require('../controllers/itinerarioController');
router.post('/select', selectItinerario);

// Ruta para la creacion manual de itinerario
router.post('/manual', createManualItinerario);

// Ruta para la creacion automatica de itinerario
router.post('/automatico', createAutomaticItinerario);

module.exports = router;

router.get('/usuario/:usuarioId', obtenerItinerariosPorUsuario);