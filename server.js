  // * Archivo principal de aplicación web, utilizando el framework Express.js
  // Se configuran los middleware necesarios, define rutas y conecta a una base de datos utilizando Sequelize

  // Se importan dependencias
  const express = require('express'); // Framework Express.js
  const bodyParser = require('body-parser'); // middleware para parsear solicitudes HTTP con cuerpos en formato JSON y URL-encoded
  const sequelize = require('./config/database'); // instancia de Sequelize configurada en otro archivo
  // archivos que definen las rutas para los recursos
  const userRoutes = require('./routes/user');
  const googlePlacesRoutes = require('./routes/googlePlaces');
  const itinerarioRoutes = require('./routes/itinerario');
  const actividadController = require('./routes/actividad');
  const ItinerarioActividadRoutes = require('./routes/itinerario_actividad');
  const itinerarioActividadRoutes = require('./routes/itinerario_actividad'); // Ruta correcta al archivo de rutas

  



  const app = express(); // se crea nueva instancia de la aplicación Express.
  const PORT = process.env.PORT || 3000; // Se establece el puerto en el que se ejecutará la aplicación.

  // Middleware
  app.use(bodyParser.json()); // habilita el parsing de solicitudes HTTP con cuerpos y formatos JSON.
  app.use(bodyParser.urlencoded({ extended: true })); // habilita el parsing de solicitudes HTTP con cuerpos y formato URL-encoded.
  app.use(express.json());

  // Rutas
  app.use('/api/users', userRoutes);
  app.use('/api/googlePlaces', googlePlacesRoutes);
  // Usar las rutas de itinerarios
  app.use('/api/itinerarios', itinerarioRoutes);
  app.use('/api', itinerarioActividadRoutes);
  app.use('/api/actividad', actividadController);


  app.use('/api/itinerarioactividad', ItinerarioActividadRoutes); // Usar las rutas para itinerario_actividad


  // Iniciar el Servidor y Conectar a la Base de Datos
  sequelize.sync().then(() => {
    app.listen(PORT, () => { // Inicia el servidor en el puerto configurado y registra un mensaje de éxito en la consola
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    }); 
  }).catch(err => { // En caso de error se llama a la base de datos
    console.error('Error al conectar a la base de datos:', err);
  });







