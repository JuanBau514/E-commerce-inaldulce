const Empresa = require('../Models/modeloEmpresa'); // Importa el modelo Empresa
const Usuario = require('../Models/modeloUsuario'); // Importa el modelo Usuario
const db = require('../Models/conection'); // Importa la conexión a la base de datos

exports.registerEmpresa = async (req, res) => {
    console.log('Datos de registro:', req.body);

    const { razon_social, nit, id_rubro, correo, representante, telefono_empresa } = req.body;

    // Verifica que correo y teléfono no sean null o undefined
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
        correo,
        representante.telefono, // Asegúrate de usar el teléfono del representante
        3
    ];

    try {
        const [usuarioResult] = await db.query(usuarioQuery, usuarioValues);
        const userId = usuarioResult.insertId;

        const empresaQuery = `
            INSERT INTO empresa (razon_social, nit, telefono_empresa, correo, id_rubro, cedula_representante_legal)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const empresaValues = [
            razon_social,
            nit,
            telefono_empresa, // Usa el teléfono de la empresa
            correo,
            id_rubro,
            representante.cedula // Usa la cédula del representante
        ];

        await db.query(empresaQuery, empresaValues);
        res.status(201).json({ message: "Empresa registrada con éxito", userId });
    } catch (error) {
        console.error("Error al registrar la empresa:", error);
        res.status(500).json({ message: "Error al registrar la empresa", error });
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
