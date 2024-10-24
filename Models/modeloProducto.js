const db = require('./conection');

class Producto {
    constructor(codigo_producto, nombre, descripcion, precio, url_imagen, cantidad_disponible) {
        this.codigo_producto = codigo_producto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.url_imagen = url_imagen;
        this.cantidad_disponible = cantidad_disponible;
    }

    static async create({ codigo_producto, nombre, descripcion, precio, url_imagen, cantidad_disponible }) {
        const query = 'INSERT INTO producto (codigo_producto, nombre, descripcion, precio, url_imagen, cantidad_disponible) VALUES (?, ?, ?, ?, ?, ?)';
        return db.query(query, [codigo_producto, nombre, descripcion, precio, url_imagen, cantidad_disponible]);
    }

    static async findById(codigo_producto) {
        const query = 'SELECT * FROM producto WHERE codigo_producto = ?';
        const [rows] = await db.query(query, [codigo_producto]);
        return rows.length ? rows[0] : null;
    }

    static async delete(codigo_producto) {
        const query = 'DELETE FROM producto WHERE codigo_producto = ?';
        return db.query(query, [codigo_producto]);
    }

    static async update({ codigo_producto, nombre, descripcion, precio, url_imagen, cantidad_disponible }) {
        const query = 'UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, url_imagen = ?, cantidad_disponible = ? WHERE codigo_producto = ?';
        return db.query(query, [nombre, descripcion, precio, url_imagen, cantidad_disponible, codigo_producto]);
    }

    static async getAll() {
        const query = 'SELECT * FROM producto';
        return db.query(query);
    }
}

module.exports = Producto;
