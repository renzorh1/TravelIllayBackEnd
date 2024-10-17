const express = require('express');
const router = express.Router();
const { getNearbyPlaces, getFilteredPlaces } = require('../controllers/googlePlacesController'); // Asegúrate de que el archivo sea correcto

// Ruta para obtener lugares cercanos
router.get('/nearby', getNearbyPlaces);
router.get('/places', getFilteredPlaces);


module.exports = router;
