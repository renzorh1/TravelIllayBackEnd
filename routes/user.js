const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUser, getUser, getUserPreferences, getUserBasicInfo } = require('../controllers/userController');

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para actualizar el perfil del usuario
router.put('/update', updateUser);

// Ruta para obtener los datos del usuario actual
router.get('/user/:id', getUser);


// Ruta para obtener solo las preferencias del usuario
router.get('/user/:id/preferences', getUserPreferences);

// Ruta para obtener solo la información básica del usuario (excepto preferencias)
router.get('/user/:id/basicinfo', getUserBasicInfo);

module.exports = router;
