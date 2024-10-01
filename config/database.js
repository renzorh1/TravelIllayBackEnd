//*Conexión a una base de datos de Microsoft SQL server (MSSQL) utilizando la bliblioteca de mapeo objeto-relacional (ORM) sequelize*
require('dotenv').config(); //Cargar variables de entorno desde archivo '.env' en el proceso de Node.js. Almacenar información sensible
const { Sequelize } = require('sequelize'); //Importa biblioteca Sequelize

//*Creación de intancia*
//Creamos una instancia con los siguientes parámetros establecidos
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mssql',
  port: process.env.DB_PORT,
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  },
  logging: console.log // Esto mostrará las consultas SQL en la consola
});

// Prueba la conexión
sequelize.authenticate() //Método para probal la conexión a BD
  .then(() => console.log('Conexión a la base de datos establecida correctamente.'))
  .catch(err => console.error('No se pudo conectar a la base de datos:', err));

module.exports = sequelize; //Instancia sequelize se exporta como módulo