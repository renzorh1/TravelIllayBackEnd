// routes/itinerario.js
const express = require('express');
const router = express.Router();
const { crearItinerario } = require('../controllers/itinerarioController');

router.post('/crear', crearItinerario);

module.exports = router;