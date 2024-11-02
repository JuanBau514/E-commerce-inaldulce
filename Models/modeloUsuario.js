// usuario.js
const db = require('./conection');

class Usuario {
    constructor({ cedula, nombre, apellido, correo, telefono, id_genero = null, id_rol, nit_empresa }) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.telefono = telefono;
        this.id_genero = id_genero;
        this.id_rol = id_rol;
        this.nit_empresa = nit_empresa;
    }

    async saveRepresentanteLegal() {
        const query = `
            INSERT INTO usuario (cedula, nombre, apellido, correo, telefono, id_genero, id_rol, nit_empresa)
            VALUES ('${this.cedula}', '${this.nombre}', '${this.apellido}', '${this.correo}', '${this.telefono}', ${this.id_genero || 'NULL'}, ${this.id_rol}, '${this.nit_empresa}')
        `;
        return await db.query(query);
    }

    // modeloUsuario.js - Actualizar el método create
        static async create({ cedula, nombre, apellido, correo, contraseña, id_genero, id_rol }) {
            const query = `
                INSERT INTO usuario (cedula, nombre, apellido, correo, contraseña, id_genero, id_rol) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            return db.query(query, [cedula, nombre, apellido, correo, contraseña, id_genero, id_rol]);
        }
    
        static async findByEmail(correo) {
            const query = 'SELECT * FROM usuario WHERE correo = ?';
            const [rows] = await db.query(query, [correo]);
            return rows.length ? rows[0] : null;
        }
    
        static async findByCedula(cedula) {
        try {
            console.log('Ejecutando consulta para cédula:', cedula);
            
            const query = 'SELECT * FROM usuario WHERE cedula = ?';
            const [rows] = await db.query(query, [cedula]);
            
            console.log('Resultado de la consulta:', rows);

            // Si no hay resultados, retornar null
            if (!rows || rows.length === 0) {
                console.log('No se encontraron resultados');
                return null;
            }

            // Retornar el primer resultado
            const userData = rows[0];
            console.log('Usuario encontrado:', userData);
            
            return userData;

        } catch (error) {
            console.error('Error en findByCedula:', error);
            throw new Error(`Error al buscar usuario por cédula: ${error.message}`);
        }
    }

        static async delete(cedula) {
            const query = 'DELETE FROM usuario WHERE cedula = ?';
            return db.query(query, cedula);
        }
        async update({cedula, nombre, apellido,correo,contraseña,id_genero}) {
            let query ;
            if(contraseña){
                console.log(`contraseña en el modelo ${contraseña}`);
                query  = 'UPDATE usuario SET nombre = ?, apellido = ?, correo = ?, contraseña = ? ,id_genero = ? WHERE cedula = ?';
                return db.query(query, [nombre, apellido, correo, contraseña,id_genero, cedula]);
            }else{
                query  = 'UPDATE usuario SET nombre = ?, apellido = ?, correo = ? ,id_genero = ? WHERE cedula = ?';
                return db.query(query, [nombre, apellido, correo,id_genero, cedula]);
            }
            
        } 
        
        static async getAll(){
            const query = `SELECT cedula,nombre,apellido,g.genero,u.correo,rol,u.nit_empresa, e.razon_social
                FROM usuario u LEFT JOIN empresa e
                                ON (u.nit_empresa = e.nit)
                    INNER JOIN rol r
                        ON (u.id_rol = r.id_rol)
                    LEFT JOIN genero g
                    ON u.id_genero = g.id_genero; `
            return db.query(query);
        }

}


module.exports = Usuario;
