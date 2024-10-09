const express = require('express');
const router = express.Router();
const { obtenerActividades } = require('../controllers/gestorActividades');

// Definir la ruta para obtener actividades
router.get('/obtener', obtenerActividades);

module.exports = router;
