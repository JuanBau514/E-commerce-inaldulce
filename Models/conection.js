const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Inaldulce',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const db = pool.promise();

module.exports = db;