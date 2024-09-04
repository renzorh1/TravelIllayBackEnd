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

const getNearbyPlaces = async (req, res) => {
  try {
    const { type } = req.query; // Tipo de lugar (restaurante, parque, etc.)

    if (!type) {
      return res.status(400).json({ message: 'El tipo de lugar es requerido' });
    }

    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: `${limaLocation.lat},${limaLocation.lng}`,
        radius: radius,
        type: type,
        key: API_KEY
      }
    });

    res.status(200).json(response.data.results);
  } catch (error) {
    console.error('Error al obtener lugares cercanos:', error);
    res.status(500).json({ message: 'Error al obtener lugares cercanos', error: error.message });
  }
};

module.exports = {
  getNearbyPlaces
};
