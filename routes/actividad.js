// routes/actividadRoutes.js
const express = require('express');
const router = express.Router();
const actividadController = require('../controllers/actividadController');

// Ruta para guardar actividad
router.post('/Guardaractividades', actividadController.guardarActividad);

router.delete('/eliminar/:actividadId', actividadController.eliminarActividad);
module.exports = router;
