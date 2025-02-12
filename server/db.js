const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Change if needed
    password: '',  // Your MySQL password
    database: 'mydatabase'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = db;
