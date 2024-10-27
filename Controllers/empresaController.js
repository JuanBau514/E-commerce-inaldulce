// Importa el modelo Empresa
const Empresa = require('../Models/modeloEmpresa');
const db = require('../Models/conection');

exports.registerEmpresa = async (req, res) => {
    console.log('Datos de registro:', req.body);
    const { razon_social, nit, id_rubro, correo, representante } = req.body;

    // Asegúrate de que el representante tenga un teléfono definido
    const telefono = representante && representante.telefono ? representante.telefono : null; 

    // Verifica que correo no sea null o undefined
    if (!correo) {
        return res.status(400).json({ message: "El correo es obligatorio." });
    }

    const usuarioQuery = `
        INSERT INTO usuario (cedula, nombre, apellido, correo, telefono, id_rol)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const usuarioValues = [
        representante.cedula,
        representante.nombre,
        representante.apellido,
        correo, // Asegúrate de usar el correo correcto
        telefono,
        3
    ];

    try {
        const [usuarioResult] = await db.query(usuarioQuery, usuarioValues);
        const userId = usuarioResult.insertId;

        const empresaQuery = `
            INSERT INTO empresa (razon_social, nit, telefono_empresa, correo, id_rubro, id_representante)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const empresaValues = [
            razon_social,
            nit,
            telefono,
            correo, // Asegúrate de que se guarde correctamente
            id_rubro,
            userId
        ];

        await db.query(empresaQuery, empresaValues);
        res.status(201).json({ message: "Empresa registrada con éxito", userId });
    } catch (error) {
        console.error("Error al registrar la empresa:", error);
        res.status(500).json({ message: "Error al registrar la empresa", error });
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
