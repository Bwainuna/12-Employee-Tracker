const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// Create a connection pool instead of using createConnection
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "NongKhai2541#",
    database: "employee_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database: " + err.message);
        return;
    }
    console.log("Connected to the database");
    startApp();
});

function startApp() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "menuChoice",
                message: "What would you like to do?",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update an employee role",
                    "Exit",
                ],
            },
        ])
        .then((answers) => {
            switch (answers.menuChoice) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    updateEmployeeRole();
                    break;
                case "Exit":
                    db.end();
                    console.log("Disconnected from the database");
                    break;
            }
        });
}

function viewDepartments() {
    const query = "SELECT id, name FROM department";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching departments: " + err.message);
            return;
        }
        console.log("\nDepartments:");
        console.table(results);
        startApp();
    });
}

function viewRoles() {
    const query = "SELECT id, title, salary, department_id FROM role";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching roles: " + err.message);
            return;
        }
        console.log("\nRoles:");
        console.table(results);
        startApp();
    });
}

function viewEmployees() {
    const query =
        "SELECT employee.id, first_name, last_name, title, salary, department.name AS department " +
        "FROM employee " +
        "LEFT JOIN role ON employee.role_id = role.id " +
        "LEFT JOIN department ON role.department_id = department.id";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching employees: " + err.message);
            return;
        }
        console.log("\nEmployees:");
        console.table(results);
        startApp();
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "Enter the department name:",
            },
        ])
        .then((answers) => {
            const query = "INSERT INTO department (name) VALUES (?)";
            db.query(query, [answers.name], (err) => {
                if (err) {
                    console.error("Error adding department: " + err.message);
                } else {
                    console.log("Department added successfully!");
                }
                startApp();
            });
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "title",
                message: "Enter the role title:",
            },
            {
                type: "input",
                name: "salary",
                message: "Enter the role salary:",
            },
            {
                type: "input",
                name: "department_id",
                message: "Enter the department ID for this role:",
            },
        ])
        .then((answers) => {
            const query =
                "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
            db.query(
                query,
                [answers.title, answers.salary, answers.department_id],
                (err) => {
                    if (err) {
                        console.error("Error adding role: " + err.message);
                    } else {
                        console.log("Role added successfully!");
                    }
                    startApp();
                }
            );
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "first_name",
                message: "Enter the employee first name:",
            },
            {
                type: "input",
                name: "last_name",
                message: "Enter the employee last name:",
            },
            {
                type: "input",
                name: "role_id",
                message: "Enter the role ID for this employee:",
            },
            {
                type: "input",
                name: "manager_id",
                message:
                    "Enter the manager ID for this employee (leave blank if none):",
            },
        ])
        .then((answers) => {
            const query =
                "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
            db.query(
                query,
                [
                    answers.first_name,
                    answers.last_name,
                    answers.role_id,
                    answers.manager_id || null,
                ],
                (err) => {
                    if (err) {
                        console.error("Error adding employee: " + err.message);
                    } else {
                        console.log("Employee added successfully!");
                    }
                    startApp();
                }
            );
        });
}

function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "employee_id",
                message: "Enter the ID of the employee to update:",
            },
            {
                type: "input",
                name: "new_role_id",
                message: "Enter the new role ID for this employee:",
            },
        ])
        .then((answers) => {
            const query = "UPDATE employee SET role_id = ? WHERE id = ?";
            db.query(query, [answers.new_role_id, answers.employee_id], (err) => {
                if (err) {
                    console.error("Error updating employee role: " + err.message);
                } else {
                    console.log("Employee role updated successfully!");
                }
                startApp();
            });
        });
}
