const mysql = require('mysql2');

// Create a MySQL connection pool
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',  // MySQL host
    user: process.env.DB_USER || 'root',       // MySQL username
    password: process.env.DB_PASSWORD || 'had%CYM3#schcs',   // MySQL password
    database: process.env.DB_NAME || 'travelagency' // Database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = db;
