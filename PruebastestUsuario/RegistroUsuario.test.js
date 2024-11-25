const express = require('express');
const request = require('supertest');
const Usuario = require('../models/Usuario'); // Importa correctamente el modelo
const bcrypt = require('bcrypt');
const userRoutes = require('../routes/user'); // Asegúrate de que esta ruta apunta a tu archivo de rutas

// Mock del modelo Usuario
jest.mock('../models/Usuario', () => ({
    create: jest.fn(),
}));

// Crear una instancia de Express para las pruebas
const app = express();
app.use(express.json());
app.use('/', userRoutes); // Agrega las rutas necesarias

describe('POST /register', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería registrar un usuario con éxito', async () => {
        const mockRequestBody = {
            nombre: 'Juan Pérez',
            numero_celular: '987654321',
            correo: 'juan.perez@example.com',
            contrasena: 'password123',
        };

        const hashedPassword = await bcrypt.hash(mockRequestBody.contrasena, 10);

        // Mock de Usuario.create
        Usuario.create.mockResolvedValue({
            id: 1,
            nombre: mockRequestBody.nombre,
            numero_celular: mockRequestBody.numero_celular,
            correo: mockRequestBody.correo,
            contrasena: hashedPassword,
            actividades_favoritas: JSON.stringify(["restaurant", "park", "museum", "library"]),
            idioma_preferencia: 'Español',
        });

        const response = await request(app).post('/register').send(mockRequestBody);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.message).toBe('Usuario registrado exitosamente');
        expect(Usuario.create).toHaveBeenCalledWith({
            nombre: mockRequestBody.nombre,
            numero_celular: mockRequestBody.numero_celular,
            correo: mockRequestBody.correo,
            contrasena: expect.any(String), // Comprobamos que la contraseña sea un hash
            actividades_favoritas: JSON.stringify(["restaurant", "park", "museum", "library"]),
            idioma_preferencia: 'Español',
        });
    });

    it('debería devolver un error si falta la contraseña', async () => {
        const mockRequestBody = {
            nombre: 'Juan Pérez',
            numero_celular: '987654321',
            correo: 'juan.perez@example.com',
            // Falta la contraseña
        };

        const response = await request(app).post('/register').send(mockRequestBody);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.message).toBe('La contraseña es requerida.');
        expect(Usuario.create).not.toHaveBeenCalled();
    });

    it('debería devolver un error si ocurre un fallo interno', async () => {
        const mockRequestBody = {
            nombre: 'Juan Pérez',
            numero_celular: '987654321',
            correo: 'juan.perez@example.com',
            contrasena: 'password123',
        };

        // Simular un error interno
        Usuario.create.mockRejectedValue(new Error('Error al guardar en la base de datos'));

        const response = await request(app).post('/register').send(mockRequestBody);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.message).toBe('Error al registrar usuario');
        expect(response.body).toHaveProperty('error', 'Error al guardar en la base de datos');
    });
});

