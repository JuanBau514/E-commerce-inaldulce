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

   static async create({ nickname, lastname, email, password, id_genero, id_rol }) {
    const query = 'INSERT INTO usuario (nombre, apellido, correo, contraseña, id_genero, id_rol) VALUES (?, ?, ?, ?, ?, ?)';
    return db.query(query, [nickname, lastname, email, password, id_genero, id_rol]);
}

    static async findByEmail(correo) {
        const query = 'SELECT * FROM usuario WHERE correo = ?';
        const [rows] = await db.query(query, [correo]);
        return rows.length ? rows[0] : null;
    }

    static async findById(id) {
        const query = 'SELECT * FROM usuario WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows.length ? rows[0] : null;
    }
    static async delete(email) {
        const query = 'DELETE FROM usuario WHERE correo = ?';
        return db.query(query, email);
    }
    static async update({id, nombre, apellido,correo,contraseña,id_genero}) {
        
        
        let query ;
        if(contraseña){
            console.log(`contraseña en el modelo ${contraseña}`);
            query  = 'UPDATE usuario SET nombre = ?, apellido = ?, correo = ?, contraseña = ? ,id_genero = ? WHERE id = ?';
            return db.query(query, [nombre, apellido, correo, contraseña,id_genero, id]);
        }else{
            query  = 'UPDATE usuario SET nombre = ?, apellido = ?, correo = ? ,id_genero = ? WHERE id = ?';
            return db.query(query, [nombre, apellido, correo,id_genero, id]);
        }
        
    }
    
}

module.exports = Usuario;