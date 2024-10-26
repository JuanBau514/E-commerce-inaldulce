const Empresa = require('../Models/modeloEmpresa'); // Importa el modelo Empresa
const Usuario = require('../Models/modeloUsuario'); // Importa el modelo Usuario

exports.registerEmpresa = async (req, res) => {
    try {
        const { nit, razon_social, correo, telefono, id_rubro, cedula_representante_legal, representante } = req.body;

        // 1. Registrar la empresa
        const empresa = new Empresa(nit, razon_social, correo, telefono, id_rubro, cedula_representante_legal);
        await empresa.save();

        // 2. Registrar al representante legal como usuario
        const usuarioRepresentante = {
            cedula: cedula_representante_legal,
            nombre: representante.nombre,
            apellido: representante.apellido,
            correo, // Utiliza el mismo correo de la empresa
            telefono, // Utiliza el mismo teléfono de la empresa
            id_genero: representante.id_genero,
            id_rol: 2, // Asume que el rol 2 es el rol de representante legal
            nit_empresa: nit
        };
        await Usuario.saveRepresentanteLegal(usuarioRepresentante);

        res.status(201).json({ message: 'Empresa y representante registrados con éxito' });
    } catch (error) {
        console.error('Error al registrar empresa:', error.message);
        res.status(500).json({ message: 'Error interno al registrar empresa' });
    }
};


// Crear usuario
exports.createUsuario = async (req, res) => {
    try {
        const { cedula, nombre, apellido, correo, contraseña, id_genero, id_rol, nit_empresa } = req.body;
        const usuario = new Usuario(cedula, nombre, apellido, correo, contraseña, id_genero, id_rol, nit_empresa);
        await usuario.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// Obtener todos los usuarios
exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.getAll();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Actualizar usuario
exports.updateUsuario = async (req, res) => {
    try {
        const { id, cedula, nombre, apellido, correo, contraseña, id_genero, id_rol, nit_empresa } = req.body;
        const usuario = new Usuario(cedula, nombre, apellido, correo, contraseña, id_genero, id_rol, nit_empresa);
        usuario.id = id;
        await usuario.update();
        res.status(200).json({ message: 'Usuario actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

// Eliminar usuario
exports.deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await Usuario.delete(id);
        res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};
