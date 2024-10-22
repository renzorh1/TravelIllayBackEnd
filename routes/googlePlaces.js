    const express = require('express');
    const router = express.Router();
    const { getNearbyPlaces, getFilteredPlaces, getActivityByName } = require('../controllers/googlePlacesController'); // Asegúrate de que el archivo sea correcto

    // Ruta para obtener lugares cercanos
    router.get('/nearby', getNearbyPlaces);
    router.get('/places', getFilteredPlaces);
    router.get('/activity', getActivityByName);


    module.exports = router;
