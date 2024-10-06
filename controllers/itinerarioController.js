const Itinerario = require('../models/Itinerario');

exports.guardarItinerario = async (req, res) => {
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