const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const registerUser = async (req, res) => {
  try {
    const { nombre, numero_celular, correo, contrasena } = req.body;

    // Validar que la contraseña esté presente
    if (!contrasena) {
      return res.status(400).json({ success: false, message: "La contraseña es requerida." });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear preferencias predeterminadas
    const actividadesFavoritas = ["restaurant", "park", "museum", "library"];

    // Crear nuevo usuario
    const newUser = await Usuario.create({
      nombre,
      numero_celular,
      correo,
      contrasena: hashedPassword,
      actividades_favoritas: JSON.stringify(actividadesFavoritas), // Convertir a JSON
      // Los valores de hora_inicio_preferida y hora_fin_preferida serán los predeterminados del modelo
      idioma_preferencia: "Español", // Valor predeterminado
    });

    // Responder con éxito
    res.status(201).json({ success: true, message: "Usuario registrado exitosamente", data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al registrar usuario", error: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Verificar que los datos requeridos están presentes
    if (!correo || !contrasena) {
      return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
    }

    const user = await Usuario.findOne({ where: { correo } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // Devuelve el ID junto con el mensaje y otras posibles informaciones
    res.status(200).json({ 
      success: true,
      message: 'Login exitoso',
      id: user.id,
      nombre: user.nombre, // Si deseas incluir más información
      correo: user.correo // Si deseas incluir más información
    });
  } catch (error) {
    console.error('Error al loguear usuario:', error);
    res.status(500).json({ success: false, message: 'Error al loguear usuario', error: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const { id, nombre, numero_celular, correo, contrasena } = req.body;
    const user = await Usuario.findByPk(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Solo actualizar los campos proporcionados
    if (nombre) {
      user.nombre = nombre;
    }

    if (numero_celular) {
      user.numero_celular = numero_celular;
    }

    if (correo) {
      user.correo = correo;
    }

    if (contrasena) {
      user.contrasena = await bcrypt.hash(contrasena, 10);
    }

    await user.save();

    res.status(200).json({ success: true, message: 'Usuario actualizado exitosamente', data: user });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
  }
};


const getUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Asegura que el id sea un número entero

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const user = await Usuario.findByPk(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.status(200).json({ success: true, message: 'Usuario encontrado', data: user });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ success: false, message: 'Error al obtener usuario', error: error.message });
  }
};



// Obtener solo las preferencias del usuario
const getUserPreferences = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const user = await Usuario.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { actividades_favoritas, hora_inicio_preferida, hora_fin_preferida } = user;

    res.status(200).json({
      actividades_favoritas: actividades_favoritas ? JSON.parse(actividades_favoritas) : [], // Asegura que sea un array
      hora_inicio_preferida,
      hora_fin_preferida,
    });
  } catch (error) {
    console.error('Error al obtener preferencias del usuario:', error);
    res.status(500).json({ message: 'Error al obtener preferencias del usuario', error: error.message });
  }
};



// Controlador para actualizar tanto actividades como horarios del usuario
const updateUserPreferences = async (req, res) => {
  try {
      const id = parseInt(req.params.id, 10);
      const { actividades_favoritas, hora_inicio_preferida, hora_fin_preferida } = req.body;

      const user = await Usuario.findByPk(id);
      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      if (actividades_favoritas) {
          user.actividades_favoritas = JSON.stringify(actividades_favoritas); // Convertir la lista de actividades a JSON
      }
      if (hora_inicio_preferida) {
          user.hora_inicio_preferida = hora_inicio_preferida;
      }
      if (hora_fin_preferida) {
          user.hora_fin_preferida = hora_fin_preferida;
      }

      await user.save();

      res.status(200).json({
          message: 'Preferencias actualizadas con éxito',
          actividades_favoritas: actividades_favoritas,
          hora_inicio_preferida: user.hora_inicio_preferida,
          hora_fin_preferida: user.hora_fin_preferida
      });
  } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      res.status(500).json({ message: 'Error al actualizar preferencias', error: error.message });
  }
};




module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getUser,
  getUserPreferences,
  updateUserPreferences
};
