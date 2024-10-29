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
    origin: '*',  // Permitir todos los orígenes para pruebas
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Ruta del archivo Excel
    const excelPath = path.join(__dirname, 'registro_persona_natural.xlsx');

    // Crear o abrir el archivo Excel
    let workbook;
    if (fs.existsSync(excelPath)) {
        workbook = xlsx.readFile(excelPath);
    } else {
        workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet([]);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'PersonasNaturales');
    }

    const worksheet = workbook.Sheets['PersonasNaturales'];
    const data = xlsx.utils.sheet_to_json(worksheet);
    data.push({ nickname, lastname, email, archivo: req.file.filename });

    const newWorksheet = xlsx.utils.json_to_sheet(data);
    workbook.Sheets['PersonasNaturales'] = newWorksheet;
    xlsx.writeFile(workbook, excelPath);

    res.status(201).json({ message: 'Registro de persona natural exitoso y archivo guardado' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        timestamp: new Date(),
        server: 'running'
    });
});

// Middleware para manejar errores al final de las rutas
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Error interno del servidor'
    });
});

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rutas
app.use('/api/users', userRoutes);

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});
