const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('TravelIllay', 'sa', '12345678', {
  host: 'DESKTOP-4HBA31A\\SQLEXPRESS', // O usa 'DESKTOP-4HBA31A\\SQLEXPRESS' si es necesario
  dialect: 'mssql',
  port: 1433,
  dialectOptions: {
    options: {
      encrypt: false,
    }
  }
});

module.exports = sequelize;


  