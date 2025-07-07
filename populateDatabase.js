const axios = require('axios');
const { Sequelize, DataTypes } = require('sequelize');

// Configura tu conexión a la base de datos
const sequelize = new Sequelize('TravelIllay', 'sa', '12345678', {
  host: 'DESKTOP-4HBA31A\\SQLEXPRESS',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true,
    }
  }
});

// Definir el modelo de ActividadItinerario
const ActividadItinerario = sequelize.define('ActividadItinerario', {
  Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  Nombre: { type: DataTypes.STRING },
  Tipo: { type: DataTypes.STRING },
  Lugar: { type: DataTypes.STRING },
  Latitud: { type: DataTypes.FLOAT },
  Longitud: { type: DataTypes.FLOAT },
  Calificacion: { type: DataTypes.DECIMAL(2, 1) },
  HoraInicio: { type: DataTypes.STRING },
  HoraFin: { type: DataTypes.STRING },
  ItinerarioId: { type: DataTypes.INTEGER }
}, {
  tableName: 'ActividadesItinerario',
  timestamps: false
});

// Función para generar una hora aleatoria entre las 9:00 y las 23:59
function generarHorasAleatorias() {
  const horaInicio = Math.floor(Math.random() * (23 - 9 + 1)) + 9;
  const minutosInicio = Math.floor(Math.random() * 60);
  const horaFin = horaInicio + 1;
  const minutosFin = Math.floor(Math.random() * 60);

  return {
    HoraInicio: `${horaInicio.toString().padStart(2, '0')}:${minutosInicio.toString().padStart(2, '0')}`,
    HoraFin: `${horaFin.toString().padStart(2, '0')}:${minutosFin.toString().padStart(2, '0')}`
  };
}

// Función para poblar la base de datos con un máximo de 5 actividades por tipo
const populateDatabase = async (type) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/googlePlaces/nearby?type=${type}`);
    const places = response.data.slice(0, 5); // Limita los resultados a 5

    for (const place of places) {
      const nombre = place.name;
      const lugar = place.vicinity;
      const latitud = place.geometry.location.lat;
      const longitud = place.geometry.location.lng;
      const calificacion = place.rating || (Math.random() * (5 - 3) + 3).toFixed(1); // Calificación aleatoria entre 3.0 y 5.0
      const { HoraInicio, HoraFin } = generarHorasAleatorias();
      const itinerarioId = 1; // Reemplaza con el ID de itinerario real si tienes uno

      await ActividadItinerario.create({
        Nombre: nombre,
        Tipo: type,
        Lugar: lugar,
        Latitud: latitud,
        Longitud: longitud,
        Calificacion: calificacion,
        HoraInicio: HoraInicio,
        HoraFin: HoraFin,
        ItinerarioId: itinerarioId,
      });
    }

    console.log(`Datos de tipo ${type} insertados exitosamente`);
  } catch (error) {
    console.error("Error al poblar la base de datos:", error);
  }
};

// Ejecutar el poblamiento para cada tipo con un límite de 5 resultados
const main = async () => {
  await populateDatabase('park');
  await populateDatabase('restaurant');
  await populateDatabase('point_of_interest');
  await populateDatabase('tourist_attraction');
  await populateDatabase('museum');
  await populateDatabase('library');
  await sequelize.close();
};

main();
