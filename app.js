const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // funciona para permitir solicitudes desde cualquier origen
const userRoutes = require('./Routes/userRuta');

const app = express();
const port = 3000;

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(cors({
  origin: 'http://127.0.0.1:5501'  // Permitir solicitudes solo desde este origen
}));

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/users', userRoutes);

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
