const express = require('express');
const router = express.Router();
const userController = require('../Controllers/usuarioController');

// Ruta para registrar un usuario
router.post('/register', userController.register);
router.post('/registerAdmin', userController.registerAdmin);
// Ruta para iniciar sesión
router.post('/login', userController.login);
router.get('/usuario', userController.getAdminInfo);
router.get('/usuarios', userController.obtenerTodo);
router.delete('/eliminarUsuario', userController.eliminarUsuario);
router.put('/modificarUsuario', userController.modificarUsuario);


module.exports = router;
