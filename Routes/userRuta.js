const express = require('express');
const router = express.Router();
const userController = require('../Controllers/registroController');

// Ruta para registrar usuarios (empresa o persona natural)
router.post('/register', userController.registerUser);

// Ruta para obtener todos los usuarios registrados
//router.get('/users', userController.getAllUsers);

// Ruta para eliminar un usuario por correo
//router.delete('/users/:email', userController.deleteUser);

// Ruta para obtener un usuario por correo
//router.get('/users/:email', userController.getUserByEmail);

module.exports = router;
