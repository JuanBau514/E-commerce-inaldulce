const express = require('express'); // librearia para crear el servidor
const bodyParser = require('body-parser'); 
const personaRoutes = require('./Routes/personaRuta'); // Ruta donde consumiremos la info de las personas en la API

const app = express();
const port = 3000;

// bodyParse funciona como un formateador de datos, los datos en la base de datos llegan como objetos que javascript entiende como JSON

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

// Configura las rutas
app.use('/personas', personaRoutes);


app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});