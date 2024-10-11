const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUser, getUser, getUserPreferences, updateUserActivities, updateUserSchedule} = require('../controllers/userController');

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


// Rutas para actualizar las actividades favoritas y el horario del usuario
router.put('/user/update/activities/:id', updateUserActivities); // Actualizar actividades favoritas por ID

router.put('/user/update/schedule/:id', updateUserSchedule);     // Actualizar horario por ID



module.exports = router;
