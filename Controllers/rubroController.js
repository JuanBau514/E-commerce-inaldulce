const Rubro = require('../Models/modeloRubro'); 

class RubroController {
    static async getRubros(req, res) {
        try {
            const rubros = await Rubro.getAll();
            //console.log('Rubros obtenidos:', rubros);
            res.status(200).json(rubros);
        } catch (error) {
            console.error('Error al obtener rubros:', error);
            res.status(500).json({ message: 'Error al obtener rubros' });
        }
    }
}


module.exports = RubroController;
