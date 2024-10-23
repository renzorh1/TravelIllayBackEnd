const axios = require('axios');

// Coordenadas de Lima, Perú
const limaLocation = {
  lat: -12.0464,
  lng: -77.0428
};

// Radio en metros
const radius = 10000; // 10 km

// Tu clave de API
const API_KEY = 'AIzaSyDr1xH61ZEU3KeMKtAiK_BxbsH7tPNtR-U';

// Mapeo de tipos
const typeMapping = {
  restaurant: 'Restaurante',
  park: 'Parque',
  museum: 'Museo',
  library: 'Librería',
};

// Función para hacer la solicitud a Google Places
const fetchPlacesByType = async (type, nextPageToken = null) => {
  const params = {
    location: `${limaLocation.lat},${limaLocation.lng}`,
    radius: radius,
    key: API_KEY,
    type: type,
    pagetoken: nextPageToken || undefined,
  };

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', { params });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener lugares de tipo ${type}:`, error);
    throw error;
  }
};

// Función para obtener todos los lugares de un tipo específico
const getAllPlacesByType = async (type) => {
  let allResults = [];
  let nextPageToken = null;

  do {
    const data = await fetchPlacesByType(type, nextPageToken);
    allResults = [...allResults, ...data.results];
    nextPageToken = data.next_page_token;

    if (nextPageToken) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo
    }
  } while (nextPageToken);

  return allResults;
};

// Función principal para obtener lugares cercanos
const getNearbyPlaces = async (req, res) => {
  try {
    const types = ['restaurant', 'park', 'museum', 'library'];
    let allPlaces = [];

    // Obtener lugares para cada tipo
    for (const type of types) {
      const placesByType = await getAllPlacesByType(type);
      allPlaces = [...allPlaces, ...placesByType];
    }

    console.log("Todas las actividades:", allPlaces); // Verifica la respuesta aquí

    const transformedResults = allPlaces.map(place => {
      const typeInSpanish = place.types.find(t => types.includes(t));
      return {
        nombre: place.name || 'Nombre no disponible',
        calificacion: place.rating || 3.3,
        tipo: typeInSpanish ? typeMapping[typeInSpanish] : null, // Usa el mapeo aquí
        latitud: place.geometry.location.lat,
        longitud: place.geometry.location.lng
      };
    });

    // Filtrar resultados para eliminar aquellos sin tipo
    const filteredResults = transformedResults.filter(result => result.tipo !== null);

    // Ordenar los resultados alfabéticamente por nombre
    filteredResults.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Enviar la respuesta transformada
    res.status(200).json(filteredResults);
  } catch (error) {
    console.error('Error al obtener lugares cercanos:', error);
    res.status(500).json({ message: 'Error al obtener lugares cercanos', error: error.message });
  }
};

const getFilteredPlaces = async (req, res) => {
  try {
    // Obtener el parámetro 'types' de la consulta (puede ser uno o varios tipos)
    const { types } = req.query;

    // Validar si el parámetro 'types' fue enviado y separarlo en un array
    const requestedTypes = types ? types.split(',') : ['restaurant', 'park', 'museum', 'library'];
    
    // Validar que los tipos solicitados sean válidos
    const validTypes = requestedTypes.filter(type => Object.keys(typeMapping).includes(type));

    if (validTypes.length === 0) {
      return res.status(400).json({ message: 'Debes especificar al menos un tipo válido.' });
    }

    let allPlaces = [];

    // Obtener lugares para cada tipo solicitado
    for (const type of validTypes) {
      const placesByType = await getAllPlacesByType(type);
      allPlaces = [...allPlaces, ...placesByType];
    }

    console.log("Todas las actividades:", allPlaces); // Verifica la respuesta aquí

    const transformedResults = allPlaces.map(place => {
      const typeInSpanish = place.types.find(t => validTypes.includes(t));
      return {
        nombre: place.name || 'Nombre no disponible',
        calificacion: place.rating || 3.3,
        tipo: typeInSpanish ? typeMapping[typeInSpanish] : null,
        latitud: place.geometry.location.lat,
        longitud: place.geometry.location.lng
      };
    });

    // Filtrar resultados para eliminar aquellos sin tipo
    const filteredResults = transformedResults.filter(result => result.tipo !== null);

    // Ordenar los resultados alfabéticamente por nombre
    filteredResults.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Enviar la respuesta transformada
    res.status(200).json(filteredResults);
  } catch (error) {
    console.error('Error al obtener lugares filtrados:', error);
    res.status(500).json({ message: 'Error al obtener lugares filtrados', error: error.message });
  }
};

const getActivityByName = async (req, res) => {
  try {
    const { name } = req.query; // Obtener el nombre de la actividad de la consulta

    if (!name) {
      return res.status(400).json({ message: 'El nombre de la actividad es obligatorio.' });
    }

    // Obtener todas las actividades como lo haces actualmente
    const types = ['restaurant', 'park', 'museum', 'library'];
    let allPlaces = [];

    for (const type of types) {
      const placesByType = await getAllPlacesByType(type);
      allPlaces = [...allPlaces, ...placesByType];
    }

    // Filtrar la actividad por el nombre proporcionado
    const activity = allPlaces.find(place => place.name.toLowerCase() === name.toLowerCase());

    if (!activity) {
      return res.status(404).json({ message: 'Actividad no encontrada.' });
    }

    // Transformar los datos de la actividad encontrada
    const transformedResult = {
      nombre: activity.name || 'Nombre no disponible',
      calificacion: activity.rating || 3.3,
      tipo: typeMapping[activity.types.find(t => types.includes(t))] || null,
      latitud: activity.geometry.location.lat,
      longitud: activity.geometry.location.lng
    };

    // Enviar la actividad encontrada como respuesta
    res.status(200).json(transformedResult);
  } catch (error) {
    console.error('Error al obtener actividad por nombre:', error);
    res.status(500).json({ message: 'Error al obtener actividad por nombre', error: error.message });
  }
};

module.exports = {
  getNearbyPlaces,
  getFilteredPlaces,
  getActivityByName
};
