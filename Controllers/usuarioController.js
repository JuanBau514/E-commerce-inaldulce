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

        console.log(password);
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

exports.getAdminInfo = async (req, res) => {
    const token = req.headers['authorization'];

    // Verificar si el token existe
    if (!token) {
        return res.status(403).json({ message: 'Token requerido' });
    }

    try {
        const bearerToken = token.split(' ')[1];

        
        const decoded = jwt.verify(bearerToken, 'secreto'); 
        
        const user = await Usuario.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.status(200).json({
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            correo: user.correo,
            genero: user.id_genero,
            contraseña:user.contraseña
        });

    } catch (error) {
        console.error('Error en la verificación del token:', error);
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

exports.eliminarUsuario = async (req, res) => {
    const { correo } = req.body;  // Extraer el correo del cuerpo de la solicitud

    try {
        // Buscar al usuario en la base de datos por el correo
        const user = await Usuario.findByEmail(correo);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Eliminar al usuario de la base de datos
        await Usuario.delete(correo);

        return res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
}

exports.modificarUsuario = async (req, res) => {
    const { id, nombre, apellido, correo, contrasenaAcutal, contrasenaNueva,id_genero} = req.body;  // Extraer los nuevos datos del usuario
    try {
        // Buscar al usuario en la base de datos por su ID
        const user = await Usuario.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if(contrasenaAcutal && contrasenaNueva){

            const isMatch = await bcrypt.compare(contrasenaAcutal, user.contraseña);
            if (!isMatch) {
                return res.status(400).json({ message: 'Contraseña incorrecta' });
            }            

            const nuevaContraseña = await bcrypt.hash(contrasenaNueva,10);


            await Usuario.update({
                id:id,
                nombre: nombre, 
                apellido: apellido,
                correo: correo,
                contraseña: nuevaContraseña, 
                id_genero:1
            });
            return res.status(200).json({ message: 'Usuario modificado correctamente' });
        }

        await Usuario.update({
            id:id,
            nombre: nombre, 
            apellido: apellido,
            correo: correo,
            id_genero:id_genero
        });

        return res.status(200).json({ message: 'Usuario modificado correctamente' });
    } catch (error) {
        console.error(error);
        console.error('ALGO SALIO SUPER MAL');
        return res.status(500).json({ message: 'Error del servidor' });
    }
}

exports.obtenerTodo = async (req, res) =>{
    const usuarios = await Usuario.getAll()
    return res.status(200).json(usuarios);
}