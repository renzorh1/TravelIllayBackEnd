const sql = require('mssql');
const config = require('../config/database');
const Usuario = require('../models/Usuario');
const Actividad = require('../models/Actividad');
const Itinerario = require('../models/Itinerario');
const moment = require('moment');
const ItinerarioActividad = require('../models/Itinerario_Actividad');
const axios = require('axios');

// Coordenadas de Lima, Perú
const limaLocation = {
    lat: -12.0464,
    lng: -77.0428
};

// Radio en metros
const radius = 10000; // 10 km

// Tu clave de API de Google
const API_KEY = 'AIzaSyArsAuOR7CjgswV3dfbosbjsqAvfc8m0ws';

// Función para hacer la solicitud a Google Places con un manejo básico de paginación
const fetchPlacesByType = async (type, nextPageToken = null) => {
    const params = {
        location: `${limaLocation.lat},${limaLocation.lng}`,
        radius: radius,
        key: API_KEY,
        type: type,
        pagetoken: nextPageToken || undefined,
        limit: 10
    };

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', { params });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener lugares de tipo ${type}:`, error.message);
        throw new Error(`No se pudo obtener lugares de tipo ${type}`);
    }
};

// Función para obtener todos los lugares de un tipo específico en paralelo (limitando las solicitudes)
const getAllPlacesByType = async (types) => {
    if (!Array.isArray(types)) {
        throw new Error('Se esperaba un arreglo de tipos de actividad');
    }

    try {
        const typesToFetch = types.slice(0, 5); // Limitar a 5 tipos de actividades
        const promises = typesToFetch.map(type => fetchPlacesByType(type));
        const results = await Promise.all(promises);
        return results.flatMap(result => result.results); // Aplanar los resultados
    } catch (error) {
        console.error('Error al obtener lugares:', error.message);
        throw new Error('Error al obtener lugares');
    }
};

const crearItinerarioAutomatico = async (req, res) => {
    const { usuario_id, fecha } = req.body;

    if (!usuario_id || !fecha) {
        return res.status(400).json({ error: 'Faltan parámetros necesarios: usuario_id o fecha.' });
    }
    

    try {
        // Verificar si el usuario existe
        const usuario = await Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Crear el itinerario
        const nuevoItinerario = await Itinerario.create({
            usuario_id,
            nombre: "Itinerario Automático",
            fecha_creacion: moment().toISOString(),
            es_activo: true
        });

        // Definir rango de horas para actividades
        const inicioRango = Math.floor(Math.random() * (10 - 6 + 1)) + 6; // Rango de 6 a 10 horas
        const finRango = Math.floor(Math.random() * (22 - 18 + 1)) + 18; // Rango de 18 a 22 horas
        const horaInicioRango = `${inicioRango}:00:00`;
        const horaFinRango = `${finRango}:00:00`;

        // Obtener todos los lugares en paralelo
        const types = ["restaurant", "park", "museum", "library"];
        const allPlaces = await getAllPlacesByType(types);
        const tiposValidos = ['restaurant', 'park', 'museum', 'library'];

        const transformedResults = allPlaces.map(place => {
            const tipo = place.types.find(t => tiposValidos.includes(t));
            return {
                nombre: place.name || 'Nombre no disponible',
                calificacion: place.rating || 3.3,
                tipo: tipo,
                latitud: place.geometry.location.lat,
                longitud: place.geometry.location.lng
            };
        });

        const filteredResults = transformedResults.filter(result => result.tipo);
        if (filteredResults.length < 4) {
            return res.status(404).json({ error: 'No hay suficientes actividades disponibles para completar el itinerario' });
        }

        // Generar horarios de actividades
        const horarios = [];
        const totalActividades = 4;
        const intervalo = Math.floor((finRango - inicioRango) * 60 / totalActividades); // Dividir el rango entre actividades
        let horaActual = moment(`${fecha}T${horaInicioRango}`, 'YYYY-MM-DDTHH:mm:ss');

        for (let i = 0; i < totalActividades; i++) {
            const siguienteHora = horaActual.clone().add(intervalo, 'minutes');
            horarios.push({
                horaInicio: horaActual.format('HH:mm:ss'),
                horaFin: siguienteHora.format('HH:mm:ss')
            });
            horaActual = siguienteHora;
        }

        horarios[0].horaInicio = horaInicioRango; // Asegurar que la primera actividad comience al inicio exacto
        horarios[totalActividades - 1].horaFin = horaFinRango; // Asegurar que la última termine al final exacto

        // Crear actividades
        const setAddedActivities = new Set();
        const createdActivities = [];

        for (let i = 0; i < totalActividades; i++) {
            const randomActivity = filteredResults[Math.floor(Math.random() * filteredResults.length)];
            if (setAddedActivities.has(randomActivity.nombre)) continue;

            setAddedActivities.add(randomActivity.nombre);

            const actividadGuardada = await Actividad.create({
                nombre: randomActivity.nombre,
                calificacion: randomActivity.calificacion,
                tipo: randomActivity.tipo,
                latitud: randomActivity.latitud,
                longitud: randomActivity.longitud,
                hora_inicio_preferida: horarios[i].horaInicio,
                hora_fin_preferida: horarios[i].horaFin
            });

            const nuevaRelacion = await ItinerarioActividad.create({
                itinerario_id: nuevoItinerario.id,
                actividad_id: actividadGuardada.id,
                horario_asignado: horarios[i].horaInicio
            });

            createdActivities.push({
                itinerario_id: nuevaRelacion.itinerario_id,
                actividad_id: nuevaRelacion.actividad_id,
                horario_asignado: nuevaRelacion.horario_asignado
            });
        }

        res.status(201).json({
            message: 'Itinerario automático creado con 4 actividades.',
            itinerario: nuevoItinerario,
            actividades: createdActivities
        });
    } catch (error) {
        console.error('Error al crear itinerario automático:', error.message);
        res.status(500).json({ error: `Error al crear itinerario automático: ${error.message}` });
    }
};

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

const cambiarNombreItinerario = async (req, res) => {
    console.log('Controlador alcanzado'); // Para verificar si llega aquí
    const { itinerario_id } = req.params;
    const { nuevo_nombre } = req.body;

    try {
        const itinerario = await Itinerario.findByPk(itinerario_id);

        if (!itinerario) {
            return res.status(404).json({ success: false, message: 'Itinerario no encontrado' });
        }

        itinerario.nombre = nuevo_nombre;
        await itinerario.save();

        res.status(200).json({
            success: true,
            message: 'Nombre del itinerario actualizado',
            data: itinerario,
        });
    } catch (error) {
        console.error('Error al cambiar el nombre del itinerario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar el nombre del itinerario',
            details: error.message,
        });
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
    rechazarItinerario,
    cambiarNombreItinerario
};