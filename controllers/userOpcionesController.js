const Usuario = require('../models/Usuario');

// Convertir la cadena JSON de la base de datos en un objeto
const obtenerPreferenciasComoObjeto = (usuario) => {
    if (typeof usuario.Preferencias === 'string') {
        return JSON.parse(usuario.Preferencias); // Convertir la cadena a objeto JSON
    }
    return usuario.Preferencias;
};

// Actualizar las actividades favoritas
const actualizarActividadesFavoritas = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10); 
        const { actividades_favoritas } = req.body; 

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Obtener Preferencias como objeto
        const preferencias = obtenerPreferenciasComoObjeto(usuario);

        // Actualizar las actividades favoritas
        preferencias.actividades_favoritas = actividades_favoritas;

        // Guardar Preferencias como cadena JSON
        usuario.Preferencias = JSON.stringify(preferencias);

        // Guardar los cambios en la base de datos
        await usuario.save();

        res.status(200).json({ success: true, data: preferencias });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar las actividades favoritas' });
    }
};

// Actualizar el horario preferido
const actualizarHorarioPreferido = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { inicio, fin } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Obtener Preferencias como objeto
        const preferencias = obtenerPreferenciasComoObjeto(usuario);

        // Actualizar el horario preferido
        preferencias.horario_preferido = { inicio, fin };

        // Guardar Preferencias como cadena JSON
        usuario.Preferencias = JSON.stringify(preferencias);

        // Guardar los cambios en la base de datos
        await usuario.save();

        res.status(200).json({ success: true, data: preferencias });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar el horario preferido' });
    }
};

// Actualizar el idioma preferido
const actualizarIdiomaPreferido = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { idioma_preferido } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Obtener Preferencias como objeto
        const preferencias = obtenerPreferenciasComoObjeto(usuario);

        // Actualizar el idioma preferido
        preferencias.idioma_preferido = idioma_preferido;

        // Guardar Preferencias como cadena JSON
        usuario.Preferencias = JSON.stringify(preferencias);

        // Guardar los cambios en la base de datos
        await usuario.save();

        res.status(200).json({ success: true, data: preferencias });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar el idioma preferido' });
    }
};

module.exports = {
    actualizarActividadesFavoritas,
    actualizarHorarioPreferido,
    actualizarIdiomaPreferido
};