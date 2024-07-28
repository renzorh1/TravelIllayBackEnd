const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUser, getUser } = require('../controllers/userController');

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para actualizar el perfil del usuario
router.put('/update', updateUser);

// Ruta para obtener los datos del usuario actual
router.get('/user/:id', getUser); // Ruta actualizada para obtener usuario por ID

module.exports = router;    
