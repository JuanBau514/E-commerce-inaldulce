const Usuario = require('../Models/modeloUsuario'); // Importa el modelo Usuario
const bcrypt = require('bcryptjs');
const db = require('../Models/conection'); // Importa la conexión a la base de datos
const nodemailer = require('nodemailer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function handleExcel(nickname, lastname, email, rutFile) {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, 'registro_personas_naturales.xlsx');
    const workbook = fs.existsSync(filePath) ? 
        xlsx.readFile(filePath) : 
        xlsx.utils.book_new();

    const usuarioData = [[
        nickname, 
        lastname, 
        email, 
        rutFile.filename,
        new Date().toISOString()
    ]];

    let usuarioSheet = workbook.Sheets["Personas Naturales"];
    if (!usuarioSheet) {
        usuarioSheet = xlsx.utils.aoa_to_sheet([
            ["Nickname", "Lastname", "Email", "RUT Archivo", "Fecha Registro"]
        ]);
        xlsx.utils.book_append_sheet(workbook, usuarioSheet, "Personas Naturales");
    }
    
    xlsx.utils.sheet_add_aoa(usuarioSheet, usuarioData, { origin: -1 });
    xlsx.writeFile(workbook, filePath);
}

// Obtener usuario por cédula
exports.getUsuarioByCedula = async (req, res) => {
    try {
        const { cedula } = req.params;

        // Validar que la cédula existe y tiene un formato válido
        if (!cedula) {
            console.log('Cédula no proporcionada');
            return res.status(400).json({ 
                success: false,
                message: 'Cédula no proporcionada' 
            });
        }

        // Validar que la cédula solo contiene números
        if (!/^\d+$/.test(cedula)) {
            console.log('Formato de cédula inválido');
            return res.status(400).json({ 
                success: false,
                message: 'Formato de cédula inválido' 
            });
        }

        console.log(`Buscando usuario con cédula: ${cedula}`);
        const usuario = await Usuario.findByCedula(cedula);

        // Log para debugging
        console.log('Resultado de la búsqueda:', usuario);

        if (!usuario) {
            console.log(`No se encontró usuario con cédula: ${cedula}`);
            return res.status(404).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }

        // Si todo está bien, devolver el usuario
        return res.status(200).json({
            success: true,
            data: usuario
        });

    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error al obtener usuario',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
        });
    }
};

exports.createPersonaNatural = async (req, res) => {
    try {
        const { nickname, lastname, email } = req.body;
        const rutFile = req.file;

        if (!nickname || !lastname || !email || !rutFile) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        // Configuración de nodemailer
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Detalles del correo
        const mailOptions = {
            from: process.env.EMAIL,
            to: 'tecnicoinaldulces@gmail.com', // Reemplaza con el correo de destino
            subject: 'Nuevo Registro de Persona Natural',
            html: `
                <h1>Nuevo Registro de Persona Natural</h1>
                <ul>
                    <li><strong>Nombre:</strong> ${nickname}</li>
                    <li><strong>Apellido:</strong> ${lastname}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Fecha de Registro:</strong> ${new Date().toLocaleString()}</li>
                </ul>
            `,
            attachments: [
                {
                    filename: rutFile.originalname,
                    path: rutFile.path,
                    contentType: rutFile.mimetype
                }
            ]
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Registro exitoso. Se ha enviado un correo de confirmación." });

    } catch (error) {
        console.error("Error al enviar correo:", error);
        res.status(500).json({ message: "Error al procesar el registro. Por favor, intente nuevamente." });
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
        const { cedula, nombre, apellido, correo, telefono, id_genero, nit_empresa, contrasenaNueva } = req.body;
        
        // Validación de campos requeridos
        if (!cedula || !nombre || !apellido || !correo) {
            return res.status(400).json({ 
                success: false, 
                message: 'Faltan campos requeridos' 
            });
        }

        console.log('Actualizando usuario:', { cedula, nombre, apellido, correo });
        
        const usuario = await Usuario.findByCedula(cedula);
        
        if (!usuario) {
            return res.status(404).json({ 
                success: false, 
                message: 'Usuario no encontrado' 
            });
        }

        let queryParams = [
            nombre,
            apellido,
            correo,
            telefono || null,
            id_genero || usuario.id_genero,
            nit_empresa || null
        ];

        let query = `
            UPDATE usuario 
            SET nombre = ?, 
                apellido = ?, 
                correo = ?, 
                telefono = ?,
                id_genero = ?,
                nit_empresa = ?
        `;

        // Si hay contraseña nueva, agregarla a la actualización
        if (contrasenaNueva) {
            const hashedPassword = await bcrypt.hash(contrasenaNueva, 10);
            query += `, contraseña = ?`;
            queryParams.push(hashedPassword);
        }

        query += ` WHERE cedula = ?`;
        queryParams.push(cedula);

        await db.query(query, queryParams);

        res.status(200).json({ 
            success: true,
            message: 'Usuario actualizado con éxito' 
        });

    } catch (error) {
        console.error('Error en updateUsuario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al actualizar usuario',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
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

        // Crear token JWT (descomentar si es necesario)
        // const token = jwt.sign({ cedula: user[0].cedula, nickname: user[0].nombre, role: user[0].id_rol }, 'secreto', {
        //     expiresIn: '1h',
        // });
        
        return res.status(200).json({ cedula:user[0].cedula , role: user[0].id_rol, message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.createAdmin = async (req, res) => {
    try {
        const { cedula, nombre, apellido, correo, contraseña, id_genero, id_rol } = req.body;

        // Validar datos requeridos
        if (!cedula || !nombre || !apellido || !correo || !contraseña || !id_rol) {
            return res.status(400).json({ 
                success: false, 
                message: 'Todos los campos son requeridos' 
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crear usuario
        await Usuario.create({
            cedula,
            nombre,
            apellido,
            correo,
            contraseña: hashedPassword,
            id_genero,
            id_rol
        });

        res.status(201).json({ 
            success: true, 
            message: 'Usuario creado exitosamente' 
        });

    } catch (error) {
        console.error('Error en createAdmin:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear usuario',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
};