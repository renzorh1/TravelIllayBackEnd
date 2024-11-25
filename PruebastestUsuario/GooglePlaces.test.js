const request = require('supertest');
const express = require('express');
const googlePlacesRoutes = require('../routes/googlePlaces');

// Crear una aplicación Express para pruebas
const app = express();
app.use(express.json());
app.use('/api/googleplaces', googlePlacesRoutes);

// Mock de la función `getAllPlacesByType`
jest.mock('../controllers/googlePlacesController', () => ({
  getNearbyPlaces: jest.fn(),
  getFilteredPlaces: jest.fn(),
  getActivityByName: jest.fn(),
}));

const { getNearbyPlaces, getFilteredPlaces, getActivityByName } = require('../controllers/googlePlacesController');

describe('Google Places API', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
  });

  // Prueba: Obtener lugares cercanos
  it('GET /api/googleplaces/nearby - Debería devolver lugares cercanos correctamente', async () => {
    // Datos simulados
    const mockPlaces = [
      {
        nombre: 'Lugar 1',
        calificacion: 4.5,
        tipo: 'restaurant',
        latitud: -12.0464,
        longitud: -77.0428,
        hora_inicio_preferida: '1970-01-01T07:46:00',
        hora_fin_preferida: '1970-01-01T07:46:00',
      },
      {
        nombre: 'Lugar 2',
        calificacion: 3.9,
        tipo: 'park',
        latitud: -12.0564,
        longitud: -77.0328,
        hora_inicio_preferida: '1970-01-01T07:46:00',
        hora_fin_preferida: '1970-01-01T07:46:00',
      },
    ];

    // Simula el comportamiento de la función
    getNearbyPlaces.mockImplementation((req, res) => res.status(200).json(mockPlaces));

    const res = await request(app).get('/api/googleplaces/nearby');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockPlaces);
    expect(getNearbyPlaces).toHaveBeenCalledTimes(1);
  });

  // Prueba: Obtener lugares filtrados por tipo
  it('GET /api/googleplaces/places?types=restaurant - Debería devolver lugares filtrados por tipo', async () => {
    const mockFilteredPlaces = [
      {
        nombre: 'Restaurante 1',
        calificacion: 4.2,
        tipo: 'restaurant',
        latitud: -12.0464,
        longitud: -77.0428,
        hora_inicio_preferida: '1970-01-01T07:46:00',
        hora_fin_preferida: '1970-01-01T07:46:00',
      },
    ];

    getFilteredPlaces.mockImplementation((req, res) => res.status(200).json(mockFilteredPlaces));

    const res = await request(app).get('/api/googleplaces/places?types=restaurant');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockFilteredPlaces);
    expect(getFilteredPlaces).toHaveBeenCalledTimes(1);
  });

  // Prueba: Obtener actividad por nombre
  it('GET /api/googleplaces/activity?name=Lugar%201 - Debería devolver la actividad correspondiente al nombre', async () => {
    const mockActivity = {
      nombre: 'Lugar 1',
      calificacion: 4.5,
      tipo: 'restaurant',
      latitud: -12.0464,
      longitud: -77.0428,
      hora_inicio_preferida: '1970-01-01T07:46:00',
      hora_fin_preferida: '1970-01-01T07:46:00',
    };

    getActivityByName.mockImplementation((req, res) => res.status(200).json(mockActivity));

    const res = await request(app).get('/api/googleplaces/activity?name=Lugar%201');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockActivity);
    expect(getActivityByName).toHaveBeenCalledTimes(1);
  });

  // Prueba: Manejo de errores en `getNearbyPlaces`
  it('GET /api/googleplaces/nearby - Debería manejar errores correctamente', async () => {
    getNearbyPlaces.mockImplementation((req, res) =>
      res.status(500).json({ message: 'Error al obtener lugares cercanos' })
    );

    const res = await request(app).get('/api/googleplaces/nearby');

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Error al obtener lugares cercanos');
    expect(getNearbyPlaces).toHaveBeenCalledTimes(1);
  });
});
