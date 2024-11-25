const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/user'); // Asegúrate de que la ruta sea correcta
const Usuario = require('../models/Usuario'); // Asegúrate de que la ruta sea correcta

// Mock de Usuario
jest.mock('../models/Usuario', () => ({
  findByPk: jest.fn(),
}));

// Crear una instancia de Express para las pruebas
const app = express();
app.use(express.json());
app.use('/', userRoutes); // Usar las rutas necesarias

describe('GET /user/:id/preferences', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
  });

  it('debería devolver las preferencias del usuario con éxito', async () => {
    const mockUser = {
      id: 1,
      actividades_favoritas: JSON.stringify(["restaurant", "park", "museum", "library"]),
      hora_inicio_preferida: '08:00:00',
      hora_fin_preferida: '18:00:00',
    };

    // Mock de Usuario.findByPk
    Usuario.findByPk.mockResolvedValue(mockUser);

    const response = await request(app).get('/user/1/preferences');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('actividades_favoritas');
    expect(response.body.actividades_favoritas).toEqual(["restaurant", "park", "museum", "library"]);
    expect(response.body).toHaveProperty('hora_inicio_preferida', mockUser.hora_inicio_preferida);
    expect(response.body).toHaveProperty('hora_fin_preferida', mockUser.hora_fin_preferida);
    expect(Usuario.findByPk).toHaveBeenCalledWith(1);
  });

  it('debería devolver un error si el ID es inválido', async () => {
    const response = await request(app).get('/user/abc/preferences'); // ID no numérico

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'ID inválido');
    expect(Usuario.findByPk).not.toHaveBeenCalled();
  });

  it('debería devolver un error si el usuario no existe', async () => {
    Usuario.findByPk.mockResolvedValue(null); // Usuario no encontrado

    const response = await request(app).get('/user/1/preferences');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Usuario no encontrado');
    expect(Usuario.findByPk).toHaveBeenCalledWith(1);
  });

  it('debería manejar errores internos correctamente', async () => {
    // Simular un error en la base de datos
    Usuario.findByPk.mockRejectedValue(new Error('Error al obtener el usuario'));

    const response = await request(app).get('/user/1/preferences');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Error al obtener preferencias del usuario');
    expect(response.body).toHaveProperty('error', 'Error al obtener el usuario');
  });
});
