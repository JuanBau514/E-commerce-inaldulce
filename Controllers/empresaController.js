// Importa el modelo Empresa
const Empresa = require('../Models/modeloEmpresa');


exports.registerEmpresa = async (req, res) => {
    try {
        const { nit, razon_social, correo, telefono, id_rubro, cedula_representante_legal, representante } = req.body;

        // Crear instancia de la empresa y guardar
        const empresa = new Empresa(nit, razon_social, correo, telefono, id_rubro, cedula_representante_legal);
        await empresa.save();

        // Registrar representante legal como usuario
        const usuarioRepresentante = {
            cedula: cedula_representante_legal,
            nombre: representante.nombre,
            apellido: representante.apellido,
            correo: representante.correo,
            id_genero: representante.id_genero,
            id_rol: 2, // Asumimos que el rol 2 es representante
            nit_empresa: nit
        };
        await Usuario.saveRepresentanteLegal(usuarioRepresentante);

        res.status(201).json({ message: 'Empresa y representante registrados con éxito' });
    } catch (error) {
        console.error('Error al registrar empresa:', error.message);
        res.status(500).json({ message: 'Error interno al registrar empresa' });
    }
};

// Crear empresa
exports.createEmpresa = async (req, res) => {
    try {
        const { nit, razon_social, correo, telefono, id_rubro, cedula_representante_legal } = req.body;
        const empresa = new Empresa(nit, razon_social, correo, telefono, id_rubro, cedula_representante_legal);
        await empresa.save();
        res.status(201).json({ message: 'Empresa registrada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar empresa' });
    }
};

// Obtener todas las empresas
exports.getEmpresas = async (req, res) => {
    try {
        const empresas = await Empresa.getAll();
        res.status(200).json(empresas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener empresas' });
    }
};

// Actualizar empresa
exports.updateEmpresa = async (req, res) => {
    try {
        const { id, nit, razon_social, correo, telefono, id_rubro, cedula_representante_legal } = req.body;
        const empresa = new Empresa(nit, razon_social, correo, telefono, id_rubro, cedula_representante_legal);
        empresa.id = id;
        await empresa.update();
        res.status(200).json({ message: 'Empresa actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar empresa' });
    }
};

// Eliminar empresa
exports.deleteEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        await Empresa.delete(id);
        res.status(200).json({ message: 'Empresa eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar empresa' });
    }
};
