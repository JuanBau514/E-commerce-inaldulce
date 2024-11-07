const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  
const userRoutes = require('./Routes/userRuta');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx'); 
const app = express();
const port = 3000;

const corsOptions = {
    origin: 'http://127.0.0.1:5501',  // Permitir el origen específico
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200
};

// Aplicar CORS antes de las rutas
app.use(cors(corsOptions));

// Middleware para analizar JSON y datos de formularios
app.use(express.json( { limit: '50mb' } ));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rutas
app.use('/api/users', userRoutes);

// Configurar multer para manejar archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads'); // Carpeta donde se guardan los archivos
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Ruta para el registro de personas naturales
app.post('/api/users/persona-natural', upload.single('rut'), (req, res) => {
    const { nickname, lastname, email } = req.body;

    // Validación simple
    if (!nickname || !lastname || !email) {
        return res.status(400).json({ message: 'Faltan datos' });
    }
    res.status(200).json({ message: 'Registro exitoso' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});