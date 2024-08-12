require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mssql',
  port: process.env.DB_PORT,
  dialectOptions: {
    options: {
      encrypt: true, // Asegúrate de que está configurado a true para Azure
      trustServerCertificate: false // Ajusta según las necesidades de seguridad
    }
  }
});

module.exports = sequelize;
