// Importa el modelo Empresa
const Empresa = require('../Models/modeloEmpresa');
const db = require('../Models/conection');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Cargar variables de entorno

exports.registerEmpresa = async (req, res) => {
    console.log('Datos de registro:', req.body);
    const { razon_social, nit, id_rubro, correo, telefono_empresa, representante } = req.body;

    const telefono = telefono_empresa ? telefono_empresa : null;

    // Validación inicial de datos
    if (!correo) {
        return res.status(400).json({ 
            status: 'error',
            type: 'VALIDATION_ERROR',
            message: "El correo es obligatorio." 
        });
    }

     let connection; // Declarar la conexión aquí

    try {
        // Verificar si el correo ya existe en la base de datos
        const checkEmailQuery = `
            SELECT correo FROM usuario WHERE correo = ?
            UNION
            SELECT correo FROM empresa WHERE correo = ?
        `;
        const [existingEmail] = await db.query(checkEmailQuery, [correo, correo]);
        
        if (existingEmail.length > 0) {
            return res.status(409).json({
                status: 'error',
                type: 'DUPLICATE_EMAIL',
                message: "El correo electrónico ya está registrado."
            });
        }

        // Verificar si el NIT ya existe
        const [existingNIT] = await db.query('SELECT nit FROM empresa WHERE nit = ?', [nit]);
        if (existingNIT.length > 0) {
            return res.status(409).json({
                status: 'error',
                type: 'DUPLICATE_NIT',
                message: "El NIT ya está registrado en el sistema."
            });
        }

        // Configuración del transportador de email
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Verificar la configuración del email
        try {
            await transporter.verify();
        } catch (emailError) {
            console.error("Error al verificar la configuración del email:", emailError);
            return res.status(500).json({
                status: 'error',
                type: 'EMAIL_CONFIG_ERROR',
                message: "Error en la configuración del servidor de correo."
            });
        }

        // Iniciar transacción
        connection = await db.getConnection(); // Obtén una conexión
        await connection.beginTransaction(); // Inicia la transacción

        try {
            // Insertar usuario
            const usuarioQuery = `
                INSERT INTO usuario (cedula, nombre, apellido, correo, telefono, id_rol)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const usuarioValues = [
                representante.cedula,
                representante.nombre,
                representante.apellido,
                correo, 
                telefono,
                3
            ];

            await connection.query(usuarioQuery, usuarioValues);

            // Insertar empresa
            const empresaQuery = `
                INSERT INTO empresa (razon_social, nit, telefono_empresa, correo, id_rubro, cedula_representante_legal)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const empresaValues = [
                razon_social,
                nit,
                telefono,
                correo, 
                id_rubro,
                representante.cedula
            ];

            await connection.query(empresaQuery, empresaValues);

            // Guardar los datos en el archivo Excel
            const filePath = path.join(__dirname, '..', 'registro_empresas.xlsx');
            const workbook = fs.existsSync(filePath) ? xlsx.readFile(filePath) : xlsx.utils.book_new();

            const usuarioData = [
                [representante.cedula, representante.nombre, representante.apellido, correo, telefono]
            ];
            let usuarioSheet = workbook.Sheets["Usuarios"];
            if (!usuarioSheet) {
                usuarioSheet = xlsx.utils.aoa_to_sheet([["Cédula", "Nombre", "Apellido", "Correo", "Teléfono"]]);
                xlsx.utils.sheet_add_aoa(usuarioSheet, usuarioData, { origin: -1 });
                xlsx.utils.book_append_sheet(workbook, usuarioSheet, "Usuarios");
            } else {
                xlsx.utils.sheet_add_aoa(usuarioSheet, usuarioData, { origin: -1 });
            }

            const empresaData = [
                [razon_social, nit, telefono, correo, id_rubro, representante.cedula]
            ];
            let empresaSheet = workbook.Sheets["Empresas"];
            if (!empresaSheet) {
                empresaSheet = xlsx.utils.aoa_to_sheet([["Razón Social", "NIT", "Teléfono", "Correo", "ID Rubro", "Cédula Representante"]]);
                xlsx.utils.sheet_add_aoa(empresaSheet, empresaData, { origin: -1 });
                xlsx.utils.book_append_sheet(workbook, empresaSheet, "Empresas");
            } else {
                xlsx.utils.sheet_add_aoa(empresaSheet, empresaData, { origin: -1 });
            }

            xlsx.writeFile(workbook, filePath);
             // Enviar correo
            const mailOptions = {
                from: `"Tu Empresa" <${process.env.EMAIL}>`,
                to: correo,
                subject: 'Registro de Empresa Exitoso',
                html: `
                    <h1>¡Registro Exitoso!</h1>
                    <p>Hola ${representante.nombre},</p>
                    <p>La empresa ${razon_social} ha sido registrada exitosamente.</p>
                    <h2>Información del registro:</h2>
                    <ul>
                        <li><strong>Razón Social:</strong> ${razon_social}</li>
                        <li><strong>NIT:</strong> ${nit}</li>
                        <li><strong>Teléfono:</strong> ${telefono}</li>
                        <li><strong>Correo:</strong> ${correo}</li>
                        <li><strong>Representante Legal:</strong> ${representante.nombre} ${representante.apellido}</li>
                        <li><strong>Cédula Representante:</strong> ${representante.cedula}</li>
                    </ul>
                    <p>¡Gracias por registrarte!</p>
                `
            };

            await transporter.sendMail(mailOptions);
            await connection.commit(); // Usar connection.commit()
            return res.status(201).json({
                status: 'success',
                message: "Empresa registrada con éxito y correo enviado correctamente."
            });

        } catch (innerError) {
            await connection.rollback(); // Usar connection.rollback()
            throw innerError;
        }

    } catch (error) {
        console.error("Error detallado:", error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                type: 'DUPLICATE_ENTRY',
                message: "Ya existe un registro con estos datos."
            });
        }

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                status: 'error',
                type: 'EMAIL_SERVICE_ERROR',
                message: "Error al conectar con el servidor de correo."
            });
        }

        return res.status(500).json({
            status: 'error',
            type: 'SERVER_ERROR',
            message: "Error en el servidor al procesar la solicitud.",
            detail: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        if (connection) connection.release(); // Asegúrate de liberar la conexión
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
