const bcrypt = require('bcryptjs');
const Usuario = require('../Models/modeloUsuario');  // Modelo de usuario
const jwt = require('jsonwebtoken');
const db = require('../Models/conection');

require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

// Configuración del escritor de CSV
const csvWriter = createObjectCsvWriter({
    path: './usuarios_registrados.csv',
    header: [
        { id: 'cedula', title: 'Cédula' },
        { id: 'nickname', title: 'Nombre' },
        { id: 'lastname', title: 'Apellido' },
        { id: 'email', title: 'Correo Electrónico' },
        { id: 'id_genero', title: 'Género' },
        { id: 'id_rol', title: 'Rol' }
    ],
    append: true
});

// Función para guardar en CSV
const guardarEnCSV = async (usuario) => {
    try {
        await csvWriter.writeRecords([usuario]);
        console.log('Datos guardados en CSV exitosamente');
    } catch (error) {
        console.error('Error al escribir en CSV:', error);
    }
};

// Configuración de Nodemailer para enviar correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
    }
});

// Función para enviar correo
const enviarCorreo = (email, nickname) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Registro exitoso - Verificación rápida',
        text: `Hola ${nickname},\n\nTu registro ha sido exitoso. Para hacer la verificación más rápida, por favor adjunta los documentos necesarios respondiendo a este correo.\n\nGracias.\nEquipo de soporte`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar correo:', error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
};

// Controlador de registro
exports.registrarUsuario = async (req, res) => {
    const { cedula, nickname, lastname, email, password, id_genero, id_rol } = req.body;

    // Guardar en la base de datos o realizar alguna validación

    // Guardar en CSV
    await guardarEnCSV({ cedula, nickname, lastname, email, id_genero, id_rol });

    // Enviar correo
    enviarCorreo(email, nickname);

    res.status(201).json({ message: 'Usuario registrado, guardado en CSV y correo enviado' });
};

// Código en tu controlador para registrar administradores
exports.registerAdmin = async (req, res) => {
    const { cedula,nickname, lastname, email, password, id_genero } = req.body;

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
            cedula,
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
    const { cedula,nickname, lastname, email, password, id_genero } = req.body;

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
            cedula,
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
        const token = jwt.sign({ cedula: user[0].cedula, nickname: user[0].nombre, role: user[0].id_rol }, 'secreto', {
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
        
        const user = await Usuario.findById(decoded.cedula);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.status(200).json({
            cedula: user.cedula,
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
    const { cedula, nombre, apellido, correo, contrasenaAcutal, contrasenaNueva,id_genero} = req.body;  // Extraer los nuevos datos del usuario
    try {
        // Buscar al usuario en la base de datos por su ID
        const user = await Usuario.findById(cedula);
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
                cedula:cedula,
                nombre: nombre, 
                apellido: apellido,
                correo: correo,
                contraseña: nuevaContraseña, 
                id_genero:1
            });
            return res.status(200).json({ message: 'Usuario modificado correctamente' });
        }

        await Usuario.update({
            cedula:cedula,
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