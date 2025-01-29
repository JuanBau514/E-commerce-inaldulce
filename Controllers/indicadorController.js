const Indicador = require('../Models/modeloIndicador')


const obtnerInformacion = async (req,res) =>{
    try {
        const {mes,annio} = req.body;

        const resultado = await Indicador.realizarConsulta(mes,annio);
        console.log(resultado)
        res.status(200).json(resultado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al realizar las queries' });
    }

}

obtnerInformacion(10,2024);

