const db = require('./conection'); // Configura la conexión a la base de datos

class Persona {
  constructor(codigo, id, nombre,edad,cargo, profesion) {
    this.codigo = codigo;
    this.id = id;
    this.nombre = nombre;
    this.edad = edad;
    this.cargo = cargo;
    this.profesion = profesion;
  }

  static async findAll() { // Metodo que ejecuta la consulta a la base de datos sobre la tabla personas
    try {
      const [rows] = await db.execute('SELECT * FROM personas');
      return rows;
    } catch (err) {
      throw err; 
    }
  }

  // metodo para contar 1 +1 
  static async countAll() {
    try {
      const [rows] = await db.execute('SELECT COUNT(*) as total FROM personas');
      return rows[0].total;
    } catch (err) {
      throw err;
    }
  }

}

module.exports = Persona; 