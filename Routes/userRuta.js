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

// Rutas de empresas
router.post('/empresas', empresaController.registerEmpresa);
router.get('/empresas', empresaController.getEmpresas);
router.put('/empresas', empresaController.updateEmpresa);
router.delete('/empresas/:id', empresaController.deleteEmpresa);

//Ruta para manejo del login
router.post('/login', usuarioController.login);

// Ruta para obtener todos los rubros
router.get('/rubros', rubroController.getRubros);

module.exports = router;
