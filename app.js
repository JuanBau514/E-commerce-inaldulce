const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  
const userRoutes = require('./Routes/userRuta');

const app = express();
const port = 3000;

const corsOptions = {
    origin: '*',  // Permitir todos los orígenes para pruebas
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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
