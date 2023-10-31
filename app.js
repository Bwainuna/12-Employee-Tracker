const mysql = require('mysql2');
const inquirer = require('inquirer');

// The database connection parameters
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'NongKhai2541#',
  database: 'employee_db',
});

// Connects to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.message);
    return;
  }
  console.log('Connected to the database');
});
