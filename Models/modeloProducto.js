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

    static async create(nombre, descripcion, precio, url_imagen, cantidad_disponible) {
        const query = 'INSERT INTO producto (nombre, descripcion, precio, url_imagen, cantidad_disponible) VALUES (?, ?, ?, ?, ?)';
        return db.query(query, [nombre, descripcion, precio, url_imagen, cantidad_disponible]);
    }

    static async findByCode(codigo_producto) {
        const query = 'SELECT * FROM producto WHERE codigo_producto = ?';
        const [rows] = await db.query(query, [codigo_producto]);
        return rows.length ? rows[0] : null;
    }

    static async delete(codigo_producto) {
        const query = 'DELETE FROM producto WHERE codigo_producto = ?';
        return db.query(query, [codigo_producto]);
    }

    static async update(codigo_producto_viejo, codigo_producto_nuevo, nombre, descripcion, precio, url_imagen, cantidad_disponible ) {
        const query = 'UPDATE producto SET codigo_producto = ?, nombre = ?, descripcion = ?, precio = ?, url_imagen = ?, cantidad_disponible = ? WHERE codigo_producto = ?';
        return db.query(query, [codigo_producto_nuevo,nombre, descripcion, precio, url_imagen, cantidad_disponible, codigo_producto_viejo]);
    }

    static async getAll() {
        const query = 'SELECT * FROM producto';
        return db.query(query);
    }
}

module.exports = Producto;
