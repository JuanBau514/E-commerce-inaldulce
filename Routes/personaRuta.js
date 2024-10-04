const express = require('express');
const router = express.Router();
const personaController = require('../Controllers/personaControlador');

// Define las rutas y asocia a los métodos del controlador
router.get('/', personaController.listarPersonas);
// ... (Rutas para crear, actualizar, eliminar)

module.exports = router;