// usuario.js
const db = require('./conection');

class Usuario {

    constructor(cedula, nombre, apellido, correo, contraseña, id_genero, id_rol, nit_empresa) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.contraseña = contraseña;
        this.id_genero = id_genero;
        this.id_rol = id_rol;
        this.nit_empresa = nit_empresa;
    }

    async save() {
        const query = `INSERT INTO usuarios (cedula, nombre, apellido, correo, contraseña, id_genero, id_rol, nit_empresa) VALUES ('${this.cedula}', '${this.nombre}', '${this.apellido}', '${this.correo}', '${this.contraseña}', ${this.id_genero}, ${this.id_rol}, '${this.nit_empresa}')`;
        return await db.query(query);
    }

    static async saveRepresentanteLegal({ cedula, nombre, apellido, correo, telefono, id_genero, id_rol, nit_empresa }) {
        const query = `INSERT INTO usuarios (cedula, nombre, apellido, correo, telefono, id_genero, id_rol, nit_empresa)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [cedula, nombre, apellido, correo, telefono, id_genero, id_rol, nit_empresa];
        return db.query(query, values);
    }

    static async getAll() {
        return await db.query('SELECT * FROM usuarios');
    }

    async update() {
        const query = `UPDATE usuarios SET cedula = '${this.cedula}', nombre = '${this.nombre}', apellido = '${this.apellido}', correo = '${this.correo}', contraseña = '${this.contraseña}', id_genero = ${this.id_genero}, id_rol = ${this.id_rol}, nit_empresa = '${this.nit_empresa}' WHERE id = ${this.id}`;
        return await db.query(query);
    }

    static async delete(id) {
        return await db.query(`DELETE FROM usuarios WHERE id = ${id}`);
    }

}

module.exports = Usuario;