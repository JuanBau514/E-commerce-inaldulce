const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./Routes/userRuta');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS
const corsOptions = {
    origin: ['http://127.0.0.1:5501', 'https://e-commerce-inaldulce.onrender.com'], // Permitir orígenes específicos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware para analizar JSON y datos de formularios
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/api/users', userRoutes);

// Configurar multer para manejar archivos subidos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads'); // Carpeta para subidas
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

// Ruta para manejar subidas de archivos
app.post('/api/users/persona-natural', upload.single('rut'), (req, res) => {
    const { nickname, lastname, email } = req.body;

    if (!nickname || !lastname || !email) {
        return res.status(400).json({ message: 'Faltan datos' });
    }
    res.status(200).json({ message: 'Registro exitoso' });
});

// Ruta para manejar cualquier solicitud de archivo HTML en Views
app.use('/', express.static(path.join(__dirname, 'public', 'Views')));

// Ruta por defecto para servir el archivo principal
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Views', 'userPage.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
