// usuario.js
const db = require('./conection');

class Usuario {
    constructor({ cedula, nombre, apellido, correo, telefono, id_genero = null, id_rol, nit_empresa }) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.telefono = telefono;
        this.id_genero = id_genero; // Permite que sea null
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
}


module.exports = Usuario;