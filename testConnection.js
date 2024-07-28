const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('TravelIllay', 'sa', '12345678', {
  host: 'localhost', // Cambia a 'DESKTOP-4HBA31A\\SQLEXPRESS' si es necesario
  dialect: 'mssql',
  port: 1433,
  dialectOptions: {
    options: {
      encrypt: false, // Cambia a true si estás en Azure
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
