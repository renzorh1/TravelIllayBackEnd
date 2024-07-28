const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  NumeroCelular: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Correo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Contrasena: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Usuarios',
  timestamps: false // Desactiva los timestamps automáticos
});

async function registerUser(req, res) {
  const { Nombre, NumeroCelular, Correo, Contrasena } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(Contrasena, 10);
    const newUser = await Usuario.create({ Nombre, NumeroCelular, Correo, Contrasena: hashedPassword });
    res.status(201).json({ message: 'Usuario registrado exitosamente', newUser });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
}

async function loginUser(req, res) {
  const { Correo, Contrasena } = req.body;

  try {
    const user = await Usuario.findOne({ where: { Correo } });
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log('Contraseña ingresada:', Contrasena);
    console.log('Contraseña almacenada:', user.Contrasena);

    const isMatch = await bcrypt.compare(Contrasena, user.Contrasena);
    if (!isMatch) {
      console.log('Las contraseñas no coinciden');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Devolver el ID del usuario junto con el mensaje
    res.status(200).json({ message: 'Login exitoso', id: user.id });
  } catch (error) {
    console.error('Error al loguear usuario:', error);
    res.status(500).json({ message: 'Error al loguear usuario', error: error.message });
  }
}

async function updateUser(req, res) {
  const { id, Nombre, NumeroCelular, Correo, Contrasena } = req.body;

  try {
      const user = await Usuario.findByPk(id);
      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const hashedPassword = Contrasena ? await bcrypt.hash(Contrasena, 10) : user.Contrasena;

      user.Nombre = Nombre || user.Nombre;
      user.NumeroCelular = NumeroCelular || user.NumeroCelular;
      user.Correo = Correo || user.Correo;
      user.Contrasena = hashedPassword;

      await user.save();

      res.status(200).json({ message: 'Perfil actualizado exitosamente', user });
  } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
  }
}

async function getUser(req, res) {
  const { id } = req.params; // Obtener ID desde los parámetros de la URL

  try {
    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
}


module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getUser
};