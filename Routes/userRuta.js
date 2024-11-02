const express = require('express');
const usuarioController = require('../Controllers/usuarioController');
const empresaController = require('../Controllers/empresaController');
const productoController = require('../Controllers/productoController');
const rubroController = require('../Controllers/rubroController');
const multer = require('multer');
const upload = multer({ dest: '../uploads' }); // Directorio temporal para archivos

const router = express.Router();

// Ruta de registro
router.post('/registrarPersonaNatural', upload.single('rut'), usuarioController.createPersonaNatural);
//ruta para enviar correo de registro de empresa
router.post('/enviar-correo', empresaController.enviarCorreo);

// Rutas de usuarios
router.post('/usuarios', usuarioController.createUsuario);
router.get('/usuarios', usuarioController.getUsuarios);
router.put('/usuarios', usuarioController.updateUsuario);
router.post('/createAdmin', usuarioController.createAdmin);
router.delete('/usuarios/:id', usuarioController.deleteUsuario);
// Obtener usuario por cédula
router.get('/usuarios/:cedula', usuarioController.getUsuarioByCedula); // Asegúrate de que esta ruta esté correctamente definida

// Rutas para productos
router.get('/productos', productoController.getProductos);
router.put('/productos', productoController.updateProducto);
router.post('/productos', productoController.crearProducto);
router.post('/establecerProductoParaEdicion', productoController.asignarProductoEditar);
router.get('/productoUnidad', productoController.getProducto);
router.delete('/productos', productoController.deleteProducto);

// Ruta de login
router.post('/login', usuarioController.login);

// Rutas de empresas
// router.post('/empresas', empresaController.registerEmpresa);
router.get('/empresas', empresaController.getEmpresas);
router.put('/empresas', empresaController.updateEmpresa);
router.delete('/empresas/:id', empresaController.deleteEmpresa);

// Ruta para obtener todos los rubros
router.get('/rubros', rubroController.getRubros);

module.exports = router;