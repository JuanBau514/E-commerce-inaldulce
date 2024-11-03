// models/modeloRoles.js
const db = require('./conection');

class Rol {
    static async getAll() {
        try {
            const query = 'SELECT * FROM rol ORDER BY id_rol';
            const [roles] = await db.query(query);
            return roles;
        } catch (error) {
            console.error('Error en getAll roles:', error);
            throw error;
        }
    }
}

module.exports = Rol;