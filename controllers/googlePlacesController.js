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
          name: place.name || 'Nombre no disponible',
          rating: place.rating || 3.3,
          type: typeInSpanish ? typeMapping[typeInSpanish] : null, // Usa el mapeo aquí
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
      };
    });

    // Filtrar resultados para eliminar aquellos sin tipo
    const filteredResults = transformedResults.filter(result => result.type !== null);

    // Ordenar los resultados alfabéticamente por nombre
    filteredResults.sort((a, b) => a.name.localeCompare(b.name));

    // Enviar la respuesta transformada
    res.status(200).json(filteredResults);
  } catch (error) {
    console.error('Error al obtener lugares cercanos:', error);
    res.status(500).json({ message: 'Error al obtener lugares cercanos', error: error.message });
  }
};

module.exports = {
  getNearbyPlaces
};
