const Persona = require('../Models/modelopersona');

exports.listarPersonas = async (req, res) => {
  try {
    const personas = await Persona.findAll();
    res.json(personas);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener personas');
  }
};

// (Métodos del controlador para crear, actualizar, eliminar) 