const express = require('express');
const router = express.Router();
const userController = require('../Controllers/usuarioController');

// Ruta para registrar un usuario
router.post('/register', userController.register);

// Ruta para iniciar sesión
router.post('/login', userController.login);

module.exports = router;
