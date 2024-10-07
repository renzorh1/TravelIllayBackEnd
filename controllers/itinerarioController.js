const Itinerario = require('../models/Itinerario');

const createManualItinerario = async (req, res) => {
    try {
        const { Nombre, Lugar, HoraInicio, HoraFin, UsuarioId } = req.body;
        const nuevoItinerario = await Itinerario.create({
            Nombre,
            Lugar,
            HoraInicio, // Ahora es cadena
            HoraFin,    // Ahora es cadena
            UsuarioId
        });
        res.status(201).json({ success: true, data: nuevoItinerario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al guardar itinerario' });
    }
};

const createAutomaticItinerario = (req, res) => {
    const { Nombre, Lugar, HoraInicio, HoraFin, UsuarioId } = req.body;
    try{
        res.json({
            mensaje: 'Se ha creado el Itinerario',
        });
    } catch (error) {
        res.status(400).json({ error: 'Tipo de itinerario Automatico no funciona en estos momentos.' });
    }
};

const selectItinerario = (req, res) => {
    console.log(req.body); // Depuración
    const { tipo } = req.body;

    if (tipo === 'manual') {
        res.json({
            mensaje: 'Redirigiendo al flujo de creación manual de itinerario',
            siguienteRuta: '/api/itinerario/manual'
        });
    } else if (tipo === 'automatico') {
        res.json({
            mensaje: 'Redirigiendo al flujo de creación automática de itinerario',
            siguienteRuta: '/api/itinerario/automatico'
        });
    } else {
        res.status(400).json({ error: 'Tipo de itinerario no válido. Debe ser "manual" o "automatico".' });
    }
};


module.exports = {
    createManualItinerario,
    createAutomaticItinerario,
    selectItinerario
  };