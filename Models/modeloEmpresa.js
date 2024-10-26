const db = require('./conection');

class Empresa {
    constructor(nit, razon_social, correo, telefono, id_rubro, cedula_representante_legal) {
        this.nit = nit;
        this.razon_social = razon_social;
        this.correo = correo;
        this.telefono = telefono;
        this.id_rubro = id_rubro;
        this.cedula_representante_legal = cedula_representante_legal;
    }

    async save() {
        const query = `INSERT INTO empresa (nit, razon_social, correo, telefono, id_rubro, cedula_representante_legal)
                       VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
            this.nit,
            this.razon_social,
            this.correo,
            this.telefono,
            this.id_rubro,
            this.cedula_representante_legal
        ];
        return db.query(query, values);
    }


    static async getAll() {
        return await db.query('SELECT * FROM empresas');
    }

    static async getById(id) {
        return await db.query(`SELECT * FROM empresas WHERE id = ${id}`);
    }

    async update() {
        const query = `UPDATE empresas SET nit = '${this.nit}', razon_social = '${this.razon_social}', correo = '${this.correo}', telefono = '${this.telefono}', id_rubro = ${this.id_rubro}, cedula_representante_legal = '${this.cedula_representante_legal}' WHERE id = ${this.id}`;
        return await db.query(query);
    }

    static async delete(id) {
        return await db.query(`DELETE FROM empresas WHERE id = ${id}`);
    }
}

module.exports = Empresa;
