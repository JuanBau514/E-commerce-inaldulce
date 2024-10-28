const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  
const userRoutes = require('./Routes/userRuta');

const app = express();
const port = 3000;

// Configurar CORS para permitir solicitudes desde orígenes específicos
const corsOptions = {
    origin: ['http://127.0.0.1:5501', 'http://localhost:5501', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,  // Permitir credenciales (cookies, etc.)
    optionsSuccessStatus: 200  // Para navegadores antiguos
};

// Aplicar el middleware CORS
app.use(cors(corsOptions));

// Middleware para logging de solicitudes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Aumentar el límite del tamaño del payload
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        timestamp: new Date(),
        server: 'running'
    });
});

// Middleware para manejar errores
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
