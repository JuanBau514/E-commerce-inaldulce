const express = require('express');
const usuarioController = require('../Controllers/usuarioController');
const empresaController = require('../Controllers/empresaController');
const rubroController = require('../Controllers/rubroController');

const router = express.Router();

// Rutas de usuarios
router.post('/usuarios', usuarioController.createUsuario);
router.get('/usuarios', usuarioController.getUsuarios);
router.put('/usuarios', usuarioController.updateUsuario);
router.delete('/usuarios/:id', usuarioController.deleteUsuario);

// Ruta de login
router.post('/login', usuarioController.login);

//ruta para enviar correo de registro de empresa
router.post('/enviar-correo', empresaController.enviarCorreo);

// Ruta para el registro de personas naturales
router.post('/persona-natural', usuarioController.createPersonaNatural);

// Rutas de empresas
// router.post('/empresas', empresaController.registerEmpresa);
router.get('/empresas', empresaController.getEmpresas);
router.put('/empresas', empresaController.updateEmpresa);
router.delete('/empresas/:id', empresaController.deleteEmpresa);

// Ruta para obtener todos los rubros
router.get('/rubros', rubroController.getRubros);

module.exports = router;
