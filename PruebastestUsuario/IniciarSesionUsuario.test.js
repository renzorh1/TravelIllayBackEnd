const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario'); // Asegúrate de que la ruta sea correcta
const userRoutes = require('../routes/user'); // Asegúrate de que la ruta sea correcta
const request = require('supertest');
const express = require('express');

// Mock de bcrypt y Usuario
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashedPassword'), // Simulamos que bcrypt.hash retorna 'hashedPassword'
}));

jest.mock('../models/Usuario', () => ({
  findOne: jest.fn(), // Aquí mockeamos solo la función que usas en tu login
}));

// Crear una instancia de Express para las pruebas
const app = express();
app.use(express.json());
app.use('/', userRoutes); // Usar las rutas necesarias

describe('POST /login', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
  });

  it('debería iniciar sesión con éxito', async () => {
    const mockRequestBody = {
      correo: 'juan.perez@example.com',
      contrasena: 'password123',
    };

    // Mock de Usuario.findOne
    const mockUser = {
      id: 1,
      nombre: 'Juan Pérez',
      correo: 'juan.perez@example.com',
      contrasena: 'hashedPassword', // Simulamos la contraseña 'hashedPassword'
    };

    Usuario.findOne.mockResolvedValue(mockUser);

    // Mock de bcrypt.compare
    bcrypt.compare.mockResolvedValue(true); // Simula que las contraseñas coinciden

    const response = await request(app).post('/login').send(mockRequestBody);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.message).toBe('Login exitoso');
    expect(response.body).toHaveProperty('id', mockUser.id);
    expect(response.body).toHaveProperty('nombre', mockUser.nombre);
    expect(response.body).toHaveProperty('correo', mockUser.correo);
    expect(Usuario.findOne).toHaveBeenCalledWith({
      where: { correo: mockRequestBody.correo },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(mockRequestBody.contrasena, mockUser.contrasena);
  });

  it('debería devolver un error si faltan datos requeridos', async () => {
    const mockRequestBody = {
      correo: 'juan.perez@example.com',
      // Falta la contraseña
    };

    const response = await request(app).post('/login').send(mockRequestBody);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.message).toBe('Faltan datos requeridos');
    expect(Usuario.findOne).not.toHaveBeenCalled();
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it('debería devolver un error si las credenciales son inválidas', async () => {
    const mockRequestBody = {
      correo: 'juan.perez@example.com',
      contrasena: 'password123',
    };

    // Mock de Usuario.findOne
    Usuario.findOne.mockResolvedValue(null); // No se encuentra el usuario

    const response = await request(app).post('/login').send(mockRequestBody);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.message).toBe('Credenciales inválidas');
    expect(Usuario.findOne).toHaveBeenCalledWith({
      where: { correo: mockRequestBody.correo },
    });
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it('debería devolver un error si la contraseña no coincide', async () => {
    const mockRequestBody = {
      correo: 'juan.perez@example.com',
      contrasena: 'password123',
    };

    // Mock de Usuario.findOne
    const mockUser = {
      id: 1,
      nombre: 'Juan Pérez',
      correo: 'juan.perez@example.com',
      contrasena: 'hashedPassword', // Contraseña incorrecta en la base de datos
    };

    Usuario.findOne.mockResolvedValue(mockUser);

    // Mock de bcrypt.compare
    bcrypt.compare.mockResolvedValue(false); // Simula que las contraseñas no coinciden

    const response = await request(app).post('/login').send(mockRequestBody);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.message).toBe('Credenciales inválidas');
    expect(Usuario.findOne).toHaveBeenCalledWith({
      where: { correo: mockRequestBody.correo },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(mockRequestBody.contrasena, mockUser.contrasena);
  });

  it('debería devolver un error si ocurre un fallo interno', async () => {
    const mockRequestBody = {
      correo: 'juan.perez@example.com',
      contrasena: 'password123',
    };

    // Simular un error interno en la base de datos
    Usuario.findOne.mockRejectedValue(new Error('Error al buscar usuario'));

    const response = await request(app).post('/login').send(mockRequestBody);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.message).toBe('Error al loguear usuario');
    expect(response.body).toHaveProperty('error', 'Error al buscar usuario');
  });
});


/*
const loginUser = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;   #1

    if (!correo || !contrasena) {   #2
      return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });#3
    }

    const user = await Usuario.findOne({ where: { correo } }); #4

    if (!user) { #5
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' }); #6
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena); #7

    if (!isMatch) { #8
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' }); #9
    }

    res.status(200).json({   #10
      success: true,
      message: 'Login exitoso',
      id: user.id,
      nombre: user.nombre, 
      correo: user.correo
    });
  } catch (error) { 
    console.error('Error al loguear usuario:', error);#11
  
    res.status(500).json({ success: false, message: 'Error al loguear usuario', error: error.message }); #12
  }
};

*/
