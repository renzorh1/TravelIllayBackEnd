// routes/itinerario.js
const express = require('express');
const router = express.Router();
const { crearItinerario, eliminarUltimoItinerario  } = require('../controllers/itinerarioController');

router.post('/crear', crearItinerario);
router.delete('/eliminar/:usuario_id', eliminarUltimoItinerario);


module.exports = router;