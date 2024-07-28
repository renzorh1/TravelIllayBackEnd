const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('TravelIllay', 'sa', '12345678', {
  host: 'localhost', 
  dialect: 'mssql',
  port: 1433,
  dialectOptions: {
    options: {
      encrypt: false,
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
