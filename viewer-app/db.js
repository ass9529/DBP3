// Aparna Sobhirala - 1002059529
// Tanmayee Siddineni - 1002053045


const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'viewer_db'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Failed to connect to MySQL:', err.message);
    process.exit(1); // stop the server if DB fails
  } else {
    console.log('✅ Connected to MySQL database!');
  }
});

module.exports = connection;

