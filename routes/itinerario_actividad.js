const express = require('express');
const router = express.Router();
const { guardarRelacionItinerarioActividad } = require('../controllers/Itinerario_ActividadController');
const { obtenerActividadesDeItinerario } = require('../controllers/Itinerario_ActividadController'); 
// Definir la ruta para guardar la relación entre itinerario y actividad
router.post('/guardarelacion', guardarRelacionItinerarioActividad);

router.post('/agregar', guardarRelacionItinerarioActividad);

router.get('/itinerarios/:itinerarioId/actividades', obtenerActividadesDeItinerario);




module.exports = router;
