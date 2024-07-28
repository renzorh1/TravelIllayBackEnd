const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('TravelIllay', 'sa', '12345678', {
  host: 'DESKTOP-4HBA31A\\SQLEXPRESS',  //CAMBIAR A TU HOST (las comillas de la forma como están en 2)
  dialect: 'mssql',
  port: 1433,
  dialectOptions: {
    options: {
      encrypt: false,
    }
  }
});

module.exports = sequelize;


  