const request = require('supertest');
const express = require('express');
const googlePlacesRoutes = require('../routes/googlePlaces');
const { getNearbyPlaces, getFilteredPlaces, getActivityByName } = require('../controllers/googlePlacesController');

// Crear una aplicación Express para pruebas
const app = express();
app.use(express.json());
app.use('/api/googleplaces', googlePlacesRoutes);

// Mock de las funciones en googlePlacesController
jest.mock('../controllers/googlePlacesController', () => ({
  getFilteredPlaces: jest.fn(),
  getNearbyPlaces: jest.fn(),
  getActivityByName: jest.fn(),
}));


describe('Google Places API - Pruebas para getFilteredPlaces', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks antes de cada prueba
  });

  // Prueba: Obtener lugares filtrados por tipos válidos
  it('GET /api/googleplaces/places?types=restaurant,park - Debería devolver lugares filtrados correctamente', async () => {
    const mockFilteredPlaces = [
      {
        nombre: 'Restaurante 1',
        calificacion: 4.5,
        tipo: 'restaurant',
        latitud: -12.0464,
        longitud: -77.0428,
        hora_inicio_preferida: '1970-01-01T07:46:00',
        hora_fin_preferida: '1970-01-01T07:46:00',
      },
      {
        nombre: 'Parque Central',
        calificacion: 4.0,
        tipo: 'park',
        latitud: -12.0564,
        longitud: -77.0328,
        hora_inicio_preferida: '1970-01-01T07:46:00',
        hora_fin_preferida: '1970-01-01T07:46:00',
      },
    ];

    // Mock del controlador
    getFilteredPlaces.mockImplementation((req, res) => res.status(200).json(mockFilteredPlaces));

    const res = await request(app).get('/api/googleplaces/places?types=restaurant,park');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockFilteredPlaces);
    expect(getFilteredPlaces).toHaveBeenCalledTimes(1);
  });

  // Prueba: Sin parámetros de tipo, debería devolver resultados predeterminados
  it('GET /api/googleplaces/places - Debería devolver lugares con tipos predeterminados', async () => {
    const mockDefaultPlaces = [
      {
        nombre: 'Biblioteca Nacional',
        calificacion: 4.3,
        tipo: 'library',
        latitud: -12.0464,
        longitud: -77.0428,
        hora_inicio_preferida: '1970-01-01T07:46:00',
        hora_fin_preferida: '1970-01-01T07:46:00',
      },
    ];

    getFilteredPlaces.mockImplementation((req, res) => res.status(200).json(mockDefaultPlaces));

    const res = await request(app).get('/api/googleplaces/places');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockDefaultPlaces);
    expect(getFilteredPlaces).toHaveBeenCalledTimes(1);
  });

  // Prueba: Manejo de tipos inválidos
  it('GET /api/googleplaces/places?types=invalidType - Debería devolver un error', async () => {
    getFilteredPlaces.mockImplementation((req, res) =>
      res.status(400).json({ message: 'Debes especificar al menos un tipo válido.' })
    );

    const res = await request(app).get('/api/googleplaces/places?types=invalidType');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Debes especificar al menos un tipo válido.');
    expect(getFilteredPlaces).toHaveBeenCalledTimes(1);
  });

  // Prueba: Manejo de errores internos
  it('GET /api/googleplaces/places - Debería manejar errores correctamente', async () => {
    getFilteredPlaces.mockImplementation((req, res) =>
      res.status(500).json({ message: 'Error al obtener lugares filtrados', error: 'Error simulado' })
    );

    const res = await request(app).get('/api/googleplaces/places');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Error al obtener lugares filtrados');
    expect(res.body).toHaveProperty('error', 'Error simulado');
    expect(getFilteredPlaces).toHaveBeenCalledTimes(1);
  });
});
