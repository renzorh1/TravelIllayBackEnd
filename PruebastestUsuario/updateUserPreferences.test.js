const request = require('supertest');
const express = require('express');
const Usuario = require('../models/Usuario');
const userRoutes = require('../routes/user');

// Mock de Usuario
jest.mock('../models/Usuario', () => ({
  findByPk: jest.fn(),
}));

// Crear instancia de Express para pruebas
const app = express();
app.use(express.json());
app.use('/', userRoutes);

describe('PUT /user/update/preferences/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería actualizar las preferencias de un usuario con éxito', async () => {
    const mockUser = {
      id: 1,
      actividades_favoritas: JSON.stringify(["restaurant", "park"]),
      hora_inicio_preferida: "09:00:00",
      hora_fin_preferida: "18:00:00",
      save: jest.fn().mockResolvedValue(true), // Simula que la operación save() fue exitosa
    };

    const updatedPreferences = {
      actividades_favoritas: ["gym", "cinema"],
      hora_inicio_preferida: "08:00:00",
      hora_fin_preferida: "17:00:00",
    };

    Usuario.findByPk.mockResolvedValue(mockUser);

    const response = await request(app)
      .put('/user/update/preferences/1')
      .send(updatedPreferences);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Preferencias actualizadas con éxito');
    expect(response.body.actividades_favoritas).toEqual(updatedPreferences.actividades_favoritas);
    expect(response.body.hora_inicio_preferida).toBe(updatedPreferences.hora_inicio_preferida);
    expect(response.body.hora_fin_preferida).toBe(updatedPreferences.hora_fin_preferida);
    expect(Usuario.findByPk).toHaveBeenCalledWith(1);
    expect(mockUser.actividades_favoritas).toBe(JSON.stringify(updatedPreferences.actividades_favoritas));
    expect(mockUser.hora_inicio_preferida).toBe(updatedPreferences.hora_inicio_preferida);
    expect(mockUser.hora_fin_preferida).toBe(updatedPreferences.hora_fin_preferida);
    expect(mockUser.save).toHaveBeenCalled();
  });

  it('debería devolver un error si el usuario no existe', async () => {
    Usuario.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .put('/user/update/preferences/999')
      .send({
        actividades_favoritas: ["gym"],
        hora_inicio_preferida: "08:00:00",
        hora_fin_preferida: "17:00:00",
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Usuario no encontrado');
    expect(Usuario.findByPk).toHaveBeenCalledWith(999);
  });

  it('debería devolver un error si ocurre un fallo interno', async () => {
    Usuario.findByPk.mockRejectedValue(new Error('Error interno'));

    const response = await request(app)
      .put('/user/update/preferences/1')
      .send({
        actividades_favoritas: ["gym"],
        hora_inicio_preferida: "08:00:00",
        hora_fin_preferida: "17:00:00",
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Error al actualizar preferencias');
    expect(response.body).toHaveProperty('error', 'Error interno');
  });

  it('debería manejar correctamente la ausencia de parámetros opcionales', async () => {
    const mockUser = {
      id: 1,
      actividades_favoritas: JSON.stringify(["restaurant", "park"]),
      hora_inicio_preferida: "09:00:00",
      hora_fin_preferida: "18:00:00",
      save: jest.fn().mockResolvedValue(true), // Simula que la operación save() fue exitosa
    };

    Usuario.findByPk.mockResolvedValue(mockUser);

    const response = await request(app).put('/user/update/preferences/1').send({});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Preferencias actualizadas con éxito');
    expect(response.body.actividades_favoritas).toBeUndefined(); // No se proporcionó nuevo valor
    expect(response.body.hora_inicio_preferida).toBe(mockUser.hora_inicio_preferida); // Conserva el valor actual
    expect(response.body.hora_fin_preferida).toBe(mockUser.hora_fin_preferida); // Conserva el valor actual
    expect(mockUser.save).toHaveBeenCalled();
  });
});
