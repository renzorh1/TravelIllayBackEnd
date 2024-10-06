require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('TravelIllay', 'sa', '12345678', {
  host: 'MSI',
  dialect: 'mssql',
  port: process.env.DB_PORT,
  dialectOptions: {
    options: {
      encrypt: true, // Asegúrate de que está configurado a true para Azure
      trustServerCertificate: true // Ajusta según las necesidades de seguridad
    }
  }
});

console.log('Intentando conectar a la base de datos...');

sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });
