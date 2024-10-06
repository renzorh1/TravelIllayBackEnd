const express = require('express');
const router = express.Router();
const itinerarioController = require('../controllers/itinerarioController');

router.post('/guardar', itinerarioController.guardarItinerario);

module.exports = router;
