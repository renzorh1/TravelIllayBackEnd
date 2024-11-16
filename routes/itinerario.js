// routes/itinerario.js
const express = require('express');
const router = express.Router();
const itinerarioController = require('../controllers/itinerarioController');
const eliminarItinerario = require('../controllers/itinerarioController');
// Crear un nuevo itinerario
router.post('/crear', itinerarioController.crearItinerario);

// Eliminar el último itinerario de un usuario
router.delete('/eliminar-ultimo/:usuario_id', itinerarioController.eliminarUltimoItinerario);

// Obtener el último ID de itinerario de un usuario
router.get('/ultimo-id/:usuario_id', itinerarioController.obtenerUltimoItinerarioId);

// Nueva ruta para obtener itinerarios por usuario
router.get('/usuario/:usuario_id/itinerarios', itinerarioController.obtenerItinerariosPorUsuario);

// Eliminar un itinerario por ID
router.delete('/:itinerario_id', itinerarioController.eliminarItinerario);

module.exports = router;
