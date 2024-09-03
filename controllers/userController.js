const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const registerUser = async (req, res) => {
  try {
    const { Nombre, Celular, Correo, Contrasena } = req.body;

    // Hashear contraseña y crear preferencias
    const hashedPassword = await bcrypt.hash(Contrasena, 10);
    const preferencias = {
      actividades_favoritas: ["Restaurantes", "Parques", "Museos", "Eventos", "Clubes"],
      horario_preferido: {
        inicio: "00:00",
        fin: "00:00"
      },
      idioma_preferido: "es"
    };
    const preferenciasJSON = JSON.stringify(preferencias);

    // Crear nuevo usuario
    const newUser = await Usuario.create({
      Nombre,
      Celular,
      Correo,
      Contrasena: hashedPassword,
      Preferencias: preferenciasJSON
    });

    // Responder con éxito
    res.status(201).json({ success: true, message: "Usuario registrado exitosamente", data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al registrar usuario" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { Correo, Contrasena } = req.body;
    const user = await Usuario.findOne({ where: { Correo } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(Contrasena, user.Contrasena);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Devuelve el ID junto con el mensaje
    res.status(200).json({ message: 'Login exitoso', id: user.Id }); // Asegúrate de que 'Id' sea el campo correcto en tu modelo
  } catch (error) {
    console.error('Error al loguear usuario:', error);
    res.status(500).json({ message: 'Error al loguear usuario', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id, Nombre, Celular, Correo, Contrasena, Preferencias } = req.body;
    const user = await Usuario.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.Nombre = Nombre;
    user.Celular = Celular;
    user.Correo = Correo;

    if (Contrasena && Contrasena !== '******') {
      user.Contrasena = await bcrypt.hash(Contrasena, 10);
    }

    if (Preferencias) {
      user.Preferencias = Preferencias;
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};



const getUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Asegura que el id sea un número entero

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const user = await Usuario.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};

// Obtener solo las preferencias del usuario
const getUserPreferences = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Asegura que el id sea un número entero

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const user = await Usuario.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { Preferencias } = user;
    res.status(200).json({ Preferencias });
  } catch (error) {
    console.error('Error al obtener preferencias del usuario:', error);
    res.status(500).json({ message: 'Error al obtener preferencias del usuario', error: error.message });
  }
};

// Obtener todos los datos del usuario (excepto las preferencias)
const getUserBasicInfo = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Asegura que el id sea un número entero

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const user = await Usuario.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { Id, Nombre, Celular, Correo, Contrasena } = user;
    res.status(200).json({ Id, Nombre, Celular, Correo, Contrasena });
  } catch (error) {
    console.error('Error al obtener información básica del usuario:', error);
    res.status(500).json({ message: 'Error al obtener información básica del usuario', error: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getUser,
  getUserPreferences, // Exporta el nuevo método
  getUserBasicInfo // Exporta el nuevo método
};

