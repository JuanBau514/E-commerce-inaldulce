const db = require('./conection');

class Usuario {
    constructor(nickname, email, password) {
        this.nickname = nickname;
        this.email = email;
        this.password = password;
    }

    // Método para registrar un usuario
    static async create({ nickname, email, password }) {
        const query = 'INSERT INTO usuarios (nickname, email, password) VALUES (?, ?, ?)';
        return db.query(query, [nickname, email, password]);
    }

    // Método para encontrar un usuario por email
    static async findByEmail(email) {
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        const [rows] = await db.query(query, [email]);
        return rows.length ? rows[0] : null;
    }

    // Método para encontrar un usuario por id
    static async findById(id) {
        const query = 'SELECT * FROM usuarios WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows.length ? rows[0] : null;
    }
}

module.exports = Usuario;
