const mysql = require('mysql2');
const inquire = require('inquirer');


require('dotenv').config();

// Database connection setup
async function connectToDB() {
    const dbConnection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'employee_mgmt_db'
    });

    console.log(`Connection established with ID ${dbConnection.threadId}`);
    return dbConnection;
}

async function startApp() {
    const db = await connectToDB();
    displayWelcome();
    await promptUser(db);
}

function displayWelcome() {
     console.log("*       EMPLOYEE MANAGEMENT SYSTEM     *");
     console.log("****************************************");
}

async function promptUser(db) {
    const action = await inquire.prompt({
        type: 'list',
        name: 'action',
        message: 'Select an operation:',
        choices: [
            'List Departments',
            'List Roles',
            'List Employees',
            'Create Department',
            'Create Role',
            'Create Employee',
            'Edit Employee Role',
            'Change Employee Manager',
            'Employees by Department',
            'Remove Department',
            'Remove Role',
            'Remove Employee',
            'Department Budgets',
            'Exit'
        ]
    });

    switch (action.choice) {
        case 'List Departments':
            await listDepartments(db);
            break;

        case 'Exit':
            db.end();
            break;
    }
}

async function listDepartments(db) {
    console.log('Listing Departments...');
    const [departments] = await db.query('SELECT id, name FROM department');
    console.table(departments);
    await promptUser(db);
}



// Function to list all roles
async function listRoles(db) {
    console.log('Displaying Roles...');
    const [roles] = await db.query(
        `SELECT role.id, role.title, department.name AS department
     FROM role
     JOIN department ON role.department_id = department.id`
    );
    console.table(roles);
    await promptUser(db);
}

// Function to list all employees
async function listEmployees(db) {
    console.log('Displaying Employees...');
    const [employees] = await db.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, 
     department.name AS department, role.salary, 
     CONCAT(manager.first_name, ' ', manager.last_name) AS manager
     FROM employee
     LEFT JOIN role ON employee.role_id = role.id
     LEFT JOIN department ON role.department_id = department.id
     LEFT JOIN employee manager ON employee.manager_id = manager.id`
    );
    console.table(employees);
    await promptUser(db);
}

// Function to add a department
async function addDepartment(db) {
    const departmentName = await inquire.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter new department name:',
        validate: input => input ? true : 'Please provide a department name.'
    });

    await db.query('INSERT INTO department (name) VALUES (?)', departmentName.name);
    console.log(`Department '${departmentName.name}' added.`);
    await listDepartments(db);
}

// Function to add a role
async function addRole(db) {
    const roleDetails = await inquire.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter role title:',
            validate: input => input ? true : 'Please provide a role title.'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter role salary:',
            validate: input => !isNaN(input) ? true : 'Please provide a valid salary.'
        }
    ]);

    const departments = await db.query('SELECT id, name FROM department');
    const departmentChoices = departments[0].map(dept => ({ name: dept.name, value: dept.id }));

    const selectedDept = await inquire.prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select department for the role:',
        choices: departmentChoices
    });

    await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
        [roleDetails.title, roleDetails.salary, selectedDept.departmentId]);

    console.log(`Role '${roleDetails.title}' added.`);
    await listRoles(db);
}

// Function to add an employee
const createEmployee = () => {
    inquire.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "Enter the first name of the new employee:",
            validate: input => input ? true : 'First name is required.'
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Enter the last name of the new employee:",
            validate: input => input ? true : 'Last name is required.'
        }
    ])
        .then(response => {
            const employeeData = [response.firstName, response.lastName];

            const fetchRolesQuery = 'SELECT id, title FROM role';
            connection.query(fetchRolesQuery, (error, roles) => {
                if (error) throw error;

                const roleOptions = roles.map(role => ({ name: role.title, value: role.id }));
                inquire.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "Select the new employee's role:",
                        choices: roleOptions
                    }
                ])
                    .then(roleSelection => {
                        employeeData.push(roleSelection.role);

                        const fetchManagersQuery = 'SELECT id, first_name, last_name FROM employee';
                        connection.query(fetchManagersQuery, (error, managers) => {
                            if (error) throw error;

                            const managerOptions = managers.map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id }));
                            inquire.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Select the new employee's manager:",
                                    choices: managerOptions
                                }
                            ])
                                .then(managerSelection => {
                                    employeeData.push(managerSelection.manager);

                                    const insertEmployeeQuery = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                                    connection.query(insertEmployeeQuery, employeeData, (error) => {
                                        if (error) throw error;
                                        console.log("New employee has been successfully added.");

                                        displayEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};


// Function to update an employee's role
const modifyEmployeeRole = () => {
    const employeeQuery = 'SELECT id, first_name, last_name FROM employee';

    connection.query(employeeQuery, (error, employees) => {
        if (error) throw error;
        console.log(employees);

        const employeeOptions = employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
        inquire.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Select the employee whose role you want to update:",
                choices: employeeOptions
            }
        ])
            .then(empSelection => {
                const updateData = [];
                updateData.push(empSelection.employee);

                const roleQuery = 'SELECT id, title FROM role';
                connection.query(roleQuery, (error, roles) => {
                    if (error) throw error;

                    const roleOptions = roles.map(role => ({ name: role.title, value: role.id }));
                    inquire.prompt([
                        {
                            type: 'list',
                            name: 'newRole',
                            message: "Select the new role for the employee:",
                            choices: roleOptions
                        }
                    ])
                        .then(roleSelection => {
                            updateData.unshift(roleSelection.newRole);

                            const updateRoleQuery = 'UPDATE employee SET role_id = ? WHERE id = ?';
                            connection.query(updateRoleQuery, updateData, (error) => {
                                if (error) throw error;
                                console.log("Employee's role has been updated.");

                                displayEmployees();
                            });
                        });
                });
            });
    });
};


// Function to change an employee's manager
const changeEmployeeManager = () => {
    const employeeQuery = 'SELECT id, first_name, last_name FROM employee';

    connection.query(employeeQuery, (error, employees) => {
        if (error) throw error;

        const employeeOptions = employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
        inquire.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Select the employee whose manager you want to update:",
                choices: employeeOptions
            }
        ])
            .then(empSelection => {
                const updateData = [];
                updateData.push(empSelection.employee);

                const managerQuery = 'SELECT id, first_name, last_name FROM employee';
                connection.query(managerQuery, (error, managers) => {
                    if (error) throw error;

                    const managerOptions = managers.map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id }));
                    inquire.prompt([
                        {
                            type: 'list',
                            name: 'newManager',
                            message: "Select the new manager for the employee:",
                            choices: managerOptions
                        }
                    ])
                        .then(managerSelection => {
                            updateData.unshift(managerSelection.newManager);

                            const updateManagerQuery = 'UPDATE employee SET manager_id = ? WHERE id = ?';
                            connection.query(updateManagerQuery, updateData, (error) => {
                                if (error) throw error;
                                console.log("Employee's manager has been updated.");

                                displayEmployees();
                            });
                        });
                });
            });
    });
};


// Function to display employees by department
const displayEmployeesByDepartment = () => {
    console.log('Displaying employees grouped by their departments:\n');
    const query = `SELECT e.first_name, e.last_name, d.name AS department
                 FROM employee e
                 LEFT JOIN role r ON e.role_id = r.id 
                 LEFT JOIN department d ON r.department_id = d.id`;

    connection.query(query, (error, employees) => {
        if (error) throw error;
        console.table(employees);
        initiateUserPrompt();
    });
};


// Function to delete a department
const removeDepartment = () => {
    const fetchDepartmentsQuery = 'SELECT id, name FROM department';

    connection.query(fetchDepartmentsQuery, (error, departments) => {
        if (error) throw error;

        const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));
        inquire.prompt([
            {
                type: 'list',
                name: 'selectedDepartment',
                message: "Select the department to be removed:",
                choices: departmentChoices
            }
        ])
            .then(choice => {
                const deleteQuery = 'DELETE FROM department WHERE id = ?';
                connection.query(deleteQuery, choice.selectedDepartment, (error) => {
                    if (error) throw error;
                    console.log("Department removed successfully.");

                    listDepartments();
                });
            });
    });
};


// Function to delete a role
const removeRole = () => {
    const fetchRolesQuery = 'SELECT id, title FROM role';

    connection.query(fetchRolesQuery, (error, roles) => {
        if (error) throw error;

        const roleOptions = roles.map(role => ({ name: role.title, value: role.id }));
        inquire.prompt([
            {
                type: 'list',
                name: 'selectedRole',
                message: "Select the role to be deleted:",
                choices: roleOptions
            }
        ])
            .then(choice => {
                const deleteRoleQuery = 'DELETE FROM role WHERE id = ?';
                connection.query(deleteRoleQuery, choice.selectedRole, (error) => {
                    if (error) throw error;
                    console.log("Role deleted successfully.");

                    listRoles();
                });
            });
    });
};


// Function to delete an employee
const removeEmployee = () => {
    const queryForEmployees = 'SELECT id, first_name, last_name FROM employee';

    connection.query(queryForEmployees, (error, employeeList) => {
        if (error) throw error;

        const employeeSelections = employeeList.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
        inquire.prompt([
            {
                type: 'list',
                name: 'selectedEmployee',
                message: "Select an employee to remove:",
                choices: employeeSelections
            }
        ])
            .then(selected => {
                const removeEmployeeQuery = 'DELETE FROM employee WHERE id = ?';

                connection.query(removeEmployeeQuery, selected.selectedEmployee, (error) => {
                    if (error) throw error;
                    console.log("Employee has been successfully removed.");

                    displayAllEmployees();
                });
            });
    });
};




// startApp();
