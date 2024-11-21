// controllers/itinerarioController.js
const sql = require('mssql');
const config = require('../config/database');
const Usuario = require('../models/Usuario');
const Actividad = require('../models/Actividad');
const Itinerario = require('../models/Itinerario');
const { getFilteredPlaces } = require('./googlePlacesController');
const moment = require('moment'); // Importa moment para manejar el formato de la fecha
const ItinerarioActividad = require('../models/itinerario_actividad'); // Asegúrate de que la ruta sea correcta
// Crear un nuevo itinerario
const crearItinerario = async (req, res) => {
    const { usuario_id, nombre } = req.body;
    const fecha_creacion = moment().toISOString();

    try {
        const nuevoItinerario = await Itinerario.create({
            usuario_id,
            nombre,
            fecha_creacion,
            es_activo: true
        });

        console.log('Itinerario creado:', nuevoItinerario); // Verifica si el ID es correcto

        res.status(201).json({
            message: 'Itinerario creado con éxito',
            itinerario: {
                id: nuevoItinerario.id, // Asegúrate de que este valor esté presente
                usuario_id: nuevoItinerario.usuario_id,
                nombre: nuevoItinerario.nombre,
                fecha_creacion: nuevoItinerario.fecha_creacion,
                es_activo: nuevoItinerario.es_activo
            }
        });
    } catch (error) {
        console.error('Error al crear itinerario:', error);
        res.status(500).json({
            error: 'Error al crear itinerario',
            details: error.message
        });
    }
};

// Eliminar el último itinerario
const eliminarUltimoItinerario = async (req, res) => {
    const { usuario_id } = req.params; // Obtén el usuario_id del parámetro
    console.log('Usuario ID recibido:', usuario_id); // Log para verificar el ID del usuario

    try {
        // Obtener el último itinerario creado por el usuario
        const ultimoItinerario = await Itinerario.findOne({
            where: { usuario_id: usuario_id },
            order: [['fecha_creacion', 'DESC']] // Ordenar por fecha de creación descendente
        });

        // Verificar si se encontró un itinerario
        if (!ultimoItinerario) {
            return res.status(404).json({ error: 'No se encontró itinerario para el usuario' });
        }

        // Eliminar el itinerario encontrado
        const resultado = await Itinerario.destroy({ where: { id: ultimoItinerario.id } });

        if (resultado) {
            res.status(200).json({ message: 'Último itinerario eliminado con éxito' });
        } else {
            res.status(404).json({ error: 'Error al eliminar el itinerario' });
        }
    } catch (error) {
        console.error('Error al eliminar itinerario:', error);
        res.status(500).json({ error: 'Error al eliminar itinerario' });
    }
};

// Obtener el próximo ID de itinerario (último ID + 1)
const obtenerUltimoItinerarioId = async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const ultimoItinerario = await Itinerario.findOne({
            where: { usuario_id: usuario_id },
            order: [['fecha_creacion', 'DESC']] // Ordenar por la fecha más reciente
        });

        // Convertir el último ID a número, sumar 1 y devolverlo
        const proximoId = ultimoItinerario ? parseInt(ultimoItinerario.id, 10) + 1 : 1;
        console.log('Próximo itinerario ID calculado:', proximoId);

        res.status(200).json({
            proximoId: proximoId,
            message: 'Próximo itinerario ID obtenido con éxito'
        });
    } catch (error) {
        console.error('Error al obtener el próximo itinerario ID:', error);
        res.status(500).json({ error: 'Error al obtener el próximo itinerario ID' });
    }
};

const obtenerItinerariosPorUsuario = async (req, res) => {
    const { usuario_id } = req.params; // Obtener el usuario_id de los parámetros

    try {
        // Buscar todos los itinerarios del usuario especificado
        const itinerarios = await Itinerario.findAll({
            where: { usuario_id: usuario_id },
            order: [['fecha_creacion', 'DESC']] // Ordenar por la fecha de creación descendente
        });

        if (itinerarios.length > 0) {
            res.status(200).json({
                itinerarios: itinerarios,
                message: `Se encontraron ${itinerarios.length} itinerario(s) para el usuario con ID: ${usuario_id}`,
            });
        } else {
            res.status(404).json({ message: 'No se encontraron itinerarios para este usuario.' });
        }
    } catch (error) {
        console.error('Error al obtener itinerarios por usuario:', error);
        res.status(500).json({ error: 'Error al obtener itinerarios por usuario', details: error.message });
    }
};

// Eliminar un itinerario por ID
const eliminarItinerario = async (req, res) => {
    const { itinerario_id } = req.params; // ID del itinerario a eliminar

    try {
        // Eliminar todas las actividades asociadas al itinerario
        await ItinerarioActividad.destroy({
            where: { itinerario_id }
        });

        // Eliminar el itinerario
        const resultado = await Itinerario.destroy({
            where: { id: itinerario_id }
        });

        if (resultado) {
            res.status(200).json({ message: 'Itinerario eliminado con éxito' });
        } else {
            res.status(404).json({ error: 'Itinerario no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar itinerario:', error);
        res.status(500).json({ error: 'Error al eliminar itinerario', details: error.message });
    }
};

const crearItinerarioAutomatico = async (req, res) => {
    try {
        const { usuario_id, fecha } = req.body;

        // Paso 1: Obtener usuario y preferencias
        const usuario = await Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        let actividades_favoritas;
        try {
            actividades_favoritas = JSON.parse(usuario.actividades_favoritas);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Error al parsear las actividades favoritas del usuario.',
                details: error.message
            });
        }

        const horaInicioPreferida = usuario.hora_inicio_preferida;
        const horaFinPreferida = usuario.hora_fin_preferida;

        // Paso 2: Buscar lugares usando Google Places
        let actividades = [];
        for (const tipo of actividades_favoritas) {
            try {
                const lugares = await getFilteredPlaces({ query: { types: tipo } });
                actividades = [...actividades, ...lugares];
            } catch (error) {
                console.error('Error al buscar lugares con Google Places:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error al buscar lugares con Google Places',
                    details: error.message
                });
            }
        }

        if (!actividades.length) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron lugares para las preferencias del usuario.'
            });
        }

        // Ordenar actividades por calificación
        actividades.sort((a, b) => b.calificacion - a.calificacion);

        // Paso 3: Crear el itinerario
        let nuevoItinerario;
        try {
            nuevoItinerario = await Itinerario.create({
                usuario_id,
                nombre: `Itinerario del ${fecha || new Date().toISOString().split('T')[0]}`,
                fecha_creacion: new Date(),
                es_activo: true
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al crear el itinerario.',
                details: error.message
            });
        }

        // Paso 4: Asignar actividades al itinerario
        let horaInicio = new Date(`${fecha || new Date().toISOString().split('T')[0]}T${horaInicioPreferida}`);
        const horaFin = new Date(`${fecha || new Date().toISOString().split('T')[0]}T${horaFinPreferida}`);
        const actividadesAsignadas = [];

        for (const actividad of actividades.slice(0, 4)) {
            if (horaInicio >= horaFin) break; // No agregar más actividades si supera el horario final

            actividadesAsignadas.push({
                itinerario_id: nuevoItinerario.id,
                Nombre: actividad.nombre,
                Tipo: actividad.tipo,
                Lugar: actividad.nombre,
                Latitud: actividad.latitud,
                Longitud: actividad.longitud,
                Calificacion: actividad.calificacion,
                HoraInicio: horaInicio.toISOString(),
                HoraFin: new Date(horaInicio.getTime() + 2 * 60 * 60 * 1000).toISOString(),
                ImagenUrl: actividad.imagen || 'No disponible'
            });

            horaInicio = new Date(horaInicio.getTime() + 2 * 60 * 60 * 1000); // Incrementar 2 horas
        }

        // Guardar actividades
        try {
            await ActividadesItinerario.bulkCreate(actividadesAsignadas);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al guardar actividades en el itinerario.',
                details: error.message
            });
        }

        res.status(201).json({
            success: true,
            message: 'Itinerario generado automáticamente.',
            data: {
                itinerario: nuevoItinerario,
                actividades: actividadesAsignadas
            }
        });
    } catch (error) {
        console.error('Error general al crear itinerario automático:', error);
        res.status(500).json({
            success: false,
            message: 'Error general al crear itinerario automático',
            details: error.message
        });
    }
};


const aceptarItinerario = async (req, res) => {
    try {
        const { itinerario_id } = req.body;

        // Buscar el itinerario por su ID
        const itinerario = await Itinerario.findByPk(itinerario_id);
        if (!itinerario) {
            return res.status(404).json({ success: false, message: 'Itinerario no encontrado' });
        }

        // Marcar el itinerario como activo
        itinerario.es_activo = true;
        await itinerario.save();

        res.status(200).json({ success: true, message: 'Itinerario aceptado', data: itinerario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al aceptar el itinerario' });
    }
};

const rechazarItinerario = async (req, res) => {
    try {
        const { itinerario_id } = req.body;

        // Buscar el itinerario por su ID
        const itinerario = await Itinerario.findByPk(itinerario_id);
        if (!itinerario) {
            return res.status(404).json({ success: false, message: 'Itinerario no encontrado' });
        }

        // Eliminar el itinerario
        await itinerario.destroy();

        res.status(200).json({ success: true, message: 'Itinerario rechazado y eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al rechazar el itinerario' });
    }
};

module.exports = { 
    crearItinerario, 
    eliminarUltimoItinerario, 
    obtenerUltimoItinerarioId, 
    obtenerItinerariosPorUsuario, 
    eliminarItinerario,
    crearItinerarioAutomatico,
    aceptarItinerario,
    rechazarItinerario
};