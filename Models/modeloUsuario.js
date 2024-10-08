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

   static async create({ nickname, lastname, email, password, id_genero }) {
    const query = 'INSERT INTO usuario (nombre, apellido, correo, contraseña, id_genero, id_rol) VALUES (?, ?, ?, ?, ?, ?)';
    return db.query(query, [nickname, lastname, email, password, id_genero, 1]); // Establece 1 como id de rol por defecto
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
}

module.exports = Usuario;