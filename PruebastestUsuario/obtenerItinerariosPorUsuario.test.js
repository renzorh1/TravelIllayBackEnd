const request = require('supertest');
const express = require('express');
const Itinerario = require('../models/Itinerario');
const itinerarioRoutes = require('../routes/itinerario');

// Mock de Itinerario
jest.mock('../models/Itinerario', () => ({
  findAll: jest.fn(),
}));

// Crear instancia de Express para pruebas
const app = express();
app.use(express.json());
app.use('/itinerario', itinerarioRoutes);

describe('GET /itinerario/usuario/:usuario_id/itinerarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver los itinerarios de un usuario con éxito', async () => {
    const mockItinerarios = [
      {
        id: 1,
        usuario_id: 1,
        nombre: "Viaje a París",
        fecha_creacion: "2024-11-01",
        es_activo: true,
      },
      {
        id: 2,
        usuario_id: 1,
        nombre: "Viaje a Nueva York",
        fecha_creacion: "2024-10-15",
        es_activo: true,
      },
    ];

    Itinerario.findAll.mockResolvedValue(mockItinerarios);

    const response = await request(app).get('/itinerario/usuario/1/itinerarios');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('itinerarios');
    expect(response.body.itinerarios).toEqual(mockItinerarios);
    expect(response.body).toHaveProperty('message', 'Se encontraron 2 itinerario(s) para el usuario con ID: 1');
    expect(Itinerario.findAll).toHaveBeenCalledWith({
      where: { usuario_id: "1" },
      order: [['fecha_creacion', 'DESC']],
    });
  });

  it('debería devolver un mensaje si no hay itinerarios para el usuario', async () => {
    Itinerario.findAll.mockResolvedValue([]);

    const response = await request(app).get('/itinerario/usuario/2/itinerarios');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'No se encontraron itinerarios para este usuario.');
    expect(Itinerario.findAll).toHaveBeenCalledWith({
      where: { usuario_id: "2" },
      order: [['fecha_creacion', 'DESC']],
    });
  });

  it('debería devolver un error si ocurre un fallo interno', async () => {
    Itinerario.findAll.mockRejectedValue(new Error('Error interno del servidor'));

    const response = await request(app).get('/itinerario/usuario/3/itinerarios');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Error al obtener itinerarios por usuario');
    expect(response.body).toHaveProperty('details', 'Error interno del servidor');
    expect(Itinerario.findAll).toHaveBeenCalledWith({
      where: { usuario_id: "3" },
      order: [['fecha_creacion', 'DESC']],
    });
  });
});
