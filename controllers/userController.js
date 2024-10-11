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
    const actividadesFavoritas = ["Restaurantes", "Parques", "Museos", "Librería"];
    
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

    // Extraer solo las actividades_favoritas, hora_inicio_preferida y hora_fin_preferida
    const { actividades_favoritas, hora_inicio_preferida, hora_fin_preferida } = user;
    
    // Responder con solo los campos requeridos
    res.status(200).json({ 
      actividades_favoritas: JSON.parse(actividades_favoritas),  // Asegúrate de que se parsea correctamente
      hora_inicio_preferida, 
      hora_fin_preferida 
    });
  } catch (error) {
    console.error('Error al obtener preferencias del usuario:', error);
    res.status(500).json({ message: 'Error al obtener preferencias del usuario', error: error.message });
  }
};


// Controlador para actualizar las actividades favoritas del usuario
const updateUserActivities = async (req, res) => {
  try {
    const { actividad } = req.body; // Tomamos las actividades nuevas
    const id = parseInt(req.params.id, 10); // Obtenemos el ID del usuario desde los parámetros de la URL

    // Buscar al usuario por id
    const user = await Usuario.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Parsear las actividades nuevas, separarlas por comas y eliminar espacios
    let nuevasActividades = actividad.split(',').map(a => a.trim());

    // Reemplazar las actividades actuales por las nuevas
    user.actividades_favoritas = JSON.stringify(nuevasActividades);
    await user.save(); // Guardar los cambios en la base de datos

    // Responder con éxito y las nuevas actividades
    res.status(200).json({
      message: 'Actividades actualizadas con éxito',
      actividades_favoritas: nuevasActividades
    });
  } catch (error) {
    console.error('Error al actualizar actividades:', error);
    res.status(500).json({ message: 'Error al actualizar actividades', error: error.message });
  }
};



// Controlador para actualizar el horario preferido del usuario
const updateUserSchedule = async (req, res) => {
  try {
    const { hora_inicio_preferida, hora_fin_preferida } = req.body; // Recibe los horarios nuevos
    const id = parseInt(req.params.id, 10); // Obtenemos el ID del usuario desde los parámetros de la URL

    const user = await Usuario.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar horario de inicio y fin
    if (hora_inicio_preferida) {
      user.hora_inicio_preferida = hora_inicio_preferida;
    }

    if (hora_fin_preferida) {
      user.hora_fin_preferida = hora_fin_preferida;
    }

    await user.save();

    res.status(200).json({
      message: 'Horario actualizado correctamente',
      hora_inicio_preferida: user.hora_inicio_preferida,
      hora_fin_preferida: user.hora_fin_preferida
    });
  } catch (error) {
    console.error('Error al actualizar el horario:', error);
    res.status(500).json({ message: 'Error al actualizar el horario', error: error.message });
  }
};





module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getUser,
  getUserPreferences,
  updateUserActivities,
  updateUserSchedule
};
