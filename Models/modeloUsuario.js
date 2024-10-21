// usuario.js
const db = require('./conection');

class Usuario {
    constructor(nombre, apellido, correo, contraseña, id_genero, id_rol) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.contraseña = contraseña;
        this.id_genero = id_genero;
        this.id_rol = id_rol;
    }

    /*
    constructor(id,nombre, apellido, correo, contraseña, id_genero, id_rol) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.contraseña = contraseña;
        this.id_genero = id_genero;
        this.id_rol = id_rol;
    }
    */

   static async create({ cedula,nickname, lastname, email, password, id_genero, id_rol }) {
    const query = 'INSERT INTO usuario (cedula,nombre, apellido, correo, contraseña, id_genero, id_rol) VALUES (?,?, ?, ?, ?, ?, ?)';
    return db.query(query, [cedula,nickname, lastname, email, password, id_genero, id_rol]);
}

    static async findByEmail(correo) {
        const query = 'SELECT * FROM usuario WHERE correo = ?';
        const [rows] = await db.query(query, [correo]);
        return rows.length ? rows[0] : null;
    }

    static async findById(cedula) {
        const query = 'SELECT * FROM usuario WHERE cedula = ?';
        const [rows] = await db.query(query, [cedula]);
        return rows.length ? rows[0] : null;
    }
    static async delete(email) {
        const query = 'DELETE FROM usuario WHERE correo = ?';
        return db.query(query, email);
    }
    static async update({cedula, nombre, apellido,correo,contraseña,id_genero}) {
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
        const query = 'SELECT * FROM usuario';
        return db.query(query);
    }
}

module.exports = Usuario;