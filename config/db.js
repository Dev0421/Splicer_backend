const mysql = require('mysql2');  // Use the promise-based version of mysql2
require('dotenv').config();

// Create a pool (recommended for performance) or a single connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
    return;
  }
  console.log('Connected to database.');
});

module.exports = db;