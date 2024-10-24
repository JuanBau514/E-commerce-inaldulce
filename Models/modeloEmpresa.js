const db = require('./conection');

class Empresa {
    constructor(nit, razon_social, correo, telefono, rubro, id_representante_legal, cedula_representante_legal) {
        this.nit = nit;
        this.razon_social = razon_social;
        this.correo = correo;
        this.telefono = telefono;
        this.rubro = rubro;
        this.id_representante_legal = id_representante_legal;
        this.cedula_representante_legal = cedula_representante_legal;
    }

    static async create({ nit, razon_social, correo, telefono, rubro, id_representante_legal, cedula_representante_legal }) {
        const query = 'INSERT INTO empresa (nit, razon_social, correo, telefono, rubro, id_representante_legal, cedula_representante_legal) VALUES (?, ?, ?, ?, ?, ?, ?)';
        return db.query(query, [nit, razon_social, correo, telefono, rubro, id_representante_legal, cedula_representante_legal]);
    }

    static async findById(nit) {
        const query = 'SELECT * FROM empresa WHERE nit = ?';
        const [rows] = await db.query(query, [nit]);
        return rows.length ? rows[0] : null;
    }

    static async delete(nit) {
        const query = 'DELETE FROM empresa WHERE nit = ?';
        return db.query(query, [nit]);
    }

    static async update({ nit, razon_social, correo, telefono, rubro, id_representante_legal, cedula_representante_legal }) {
        const query = 'UPDATE empresa SET razon_social = ?, correo = ?, telefono = ?, rubro = ?, id_representante_legal = ?, cedula_representante_legal = ? WHERE nit = ?';
        return db.query(query, [razon_social, correo, telefono, rubro, id_representante_legal, cedula_representante_legal, nit]);
    }

    static async getAll() {
        const query = 'SELECT * FROM empresa';
        return db.query(query);
    }
}

module.exports = Empresa;
