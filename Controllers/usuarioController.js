const bcrypt = require('bcrypt');
const Usuario = require('../Models/modeloUsuario');  // Modelo de usuario
const jwt = require('jsonwebtoken');

// Registrar usuario
exports.register = async (req, res) => {
    const { nickname, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya está registrado' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo usuario
        await Usuario.create({ nickname, email, password: hashedPassword });

        return res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
};

// Iniciar sesión
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });  // Respuesta JSON
        }

        const isMatch = await bcrypt.compare(password, user[0].password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });  // Respuesta JSON
        }

        const token = jwt.sign({ id: user[0].id, nickname: user[0].nickname }, 'secreto', {
            expiresIn: '1h',
        });

        return res.status(200).json({ token, message: 'Inicio de sesión exitoso' });  // Respuesta JSON
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor' });  // Respuesta JSON en caso de error
    }
};
