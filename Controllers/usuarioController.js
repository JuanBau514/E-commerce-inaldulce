const bcrypt = require('bcryptjs');
const Usuario = require('../Models/modeloUsuario');  // Modelo de usuario
const jwt = require('jsonwebtoken');
const db = require('../Models/conection');

// Código en tu controlador para registrar administradores
exports.registerAdmin = async (req, res) => {
    const { nickname, lastname, email, password, id_genero } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya está registrado' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Asegúrate de asignar el rol correcto aquí
        await Usuario.create({
            nickname,
            lastname,
            email,
            password: hashedPassword,
            id_genero,
            id_rol: 1  // Asegúrate de que este es el rol de Administrador
        });

        return res.status(201).json({ message: 'Administrador registrado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.register = async (req, res) => {
    const { nickname, lastname, email, password, id_genero } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya está registrado' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo usuario con el rol de Cliente
        await Usuario.create({ 
            nickname,               
            lastname,              
            email,                  
            password: hashedPassword,
            id_genero,
            id_rol: 2  // Establecer el rol de Cliente
        });

        return res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario en la base de datos
        const [user] = await db.query('SELECT * FROM usuario WHERE correo = ?', [email]);
        if (!user || user.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si la contraseña está definida
        if (!user[0].contraseña) {
            return res.status(500).json({ message: 'Error del servidor: Contraseña no encontrada' });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user[0].contraseña);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Crear token JWT
        const token = jwt.sign({ id: user[0].id, nickname: user[0].nombre, role: user[0].id_rol }, 'secreto', {
            expiresIn: '1h',
        });

        return res.status(200).json({ token, role: user[0].id_rol, message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
};