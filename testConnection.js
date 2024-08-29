require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
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
