const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table'); // For formatting and displaying tables

// The database connection parameters
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'NongKhai2541#',
  database: 'employee_db',
});

// Connect to the database
db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ' + err.message);
      return;
    }
    console.log('Connected to the database');
    startApp();
  });
  
  // Define the main application function
  function startApp() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'menuChoice',
          message: 'What would you like to do?',
          choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit',
          ],
        },
      ])
      .then((answers) => {
        switch (answers.menuChoice) {
          case 'View all departments':
            viewDepartments();
            break;
          case 'View all roles':
            viewRoles();
            break;
          case 'View all employees':
            viewEmployees();
            break;
          case 'Add a department':
            addDepartment();
            break;
          case 'Add a role':
            addRole();
            break;
          case 'Add an employee':
            addEmployee();
            break;
          case 'Update an employee role':
            updateEmployeeRole();
            break;
          case 'Exit':
            db.end();
            console.log('Disconnected from the database');
            break;
        }
      });
  }