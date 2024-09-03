const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/user');
const actividadRoutes = require('./routes/actividad');
const googlePlacesRoutes = require('./routes/googlePlaces');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/actividad', actividadRoutes);
app.use('/api/googlePlaces', googlePlacesRoutes);


// Iniciar el Servidor y Conectar a la Base de Datos
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  }); 
}).catch(err => {
  console.error('Error al conectar a la base de datos:', err);
});
