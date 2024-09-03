const express = require('express');
const router = express.Router();
const { getNearbyPlaces } = require('../controllers/googlePlacesController'); // Asegúrate de que el archivo sea correcto

// Ruta para obtener lugares cercanos
router.get('/nearby', getNearbyPlaces);

module.exports = router;
