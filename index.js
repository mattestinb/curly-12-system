const { Department, Role, Employee } = require("./Models");
const sequelize = require("./connection");
const inquirer = require("inquirer");


// In progress
//import functions from operations.js for the purpose of modularity
// const {
//   viewAllDepartments,
//   viewAllRoles,
//   viewAllEmployees,
//   addDepartment,
//   addRole,
//   addEmployee,
//   updateRole
// } = require('./operations');
//
// async function main() {
//   await sequelize.sync({ force: false });
//   await options();
// }
//
// async function options() {
//   const answer = await inquirer.prompt([
//     {
//       type: "list",
//       message: "Select an option:",
//       choices: [
//         "View All Departments",
//         "View All Roles",
//         "View All Employees",
//         "Add Department",
//         "Add Role",
//         "Add Employee",
//         "Update Employee Role"
//       ],
//       name: "employeeTracker"
//     }
//   ]);
//
//   switch (answer.employeeTracker) {
//     case "View All Departments":
//       await viewAllDepartments();
//       break;
//     case "View All Roles":
//       await viewAllRoles();
//       break;
//     case "View All Employees":
//       await viewAllEmployees();
//       break;
//     case "Add Department":
//       await addDepartment();
//       break;
//     case "Add Role":
//       await addRole();
//       break;
//     case "Add Employee":
//       await addEmployee();
//       break;
//     case "Update Employee Role":
//       await updateRole();
//       break;
//   }
//
//   await options();
// }
//
// main();
// ---------------------------------------------------------------------------------------------------



// ---------------------------------------------------------------------------------------------------



//
// sequelize.sync({ force: false }).then(() => {
//   options();
// });
//
// // menu
// function options() {
//   inquirer
//     .prompt([
//       {
//         type: "list",
//         message: "Select an option:?",
//         choices: [
//           "View All Departments",
//           "View All Roles",
//           "View All Employees",
//           "Add Department",
//           "Add Role",
//           "Add Employee",
//           "Update Employee Role",
//         ],
//         name: "employeeTracker",
//       },
//     ])
//     // menu to select which function to call based on user selection
//     .then((answer) => {
//       if (answer.employeeTracker === "View All Departments") {
//         viewAllDepartments();
//       } else if (answer.employeeTracker === "View All Roles") {
//         viewAllRoles();
//       } else if (answer.employeeTracker === "View All Employees") {
//         viewAllEmployees();
//       } else if (answer.employeeTracker === "Add Department") {
//         addDepartment();
//       } else if (answer.employeeTracker === "Add Role") {
//         addRole();
//       } else if (answer.employeeTracker === "Add Employee") {
//         addEmployee();
//       } else {
//         updateRole();
//       }
//     });
// }



//------------------------------------------------------




// View all departments
// const viewAllDepartments = () => {
//   var departments = Department.findAll({ raw: true }).then((data) => {
//     console.table(data);
//
//     options();
//   });
// };
//
// // View all roles
// const viewAllRoles = () => {
//   var roles = Role.findAll({
//     raw: true,
//     // Joining Department and Role table
//     include: [{ model: Department }],
//   }).then((data) => {
//     console.table(
//
//       data.map((role) => {
//         return {
//           id: role.id,
//           title: role.title,
//           salary: role.salary,
//           department: role["Department.name"],
//         };
//       })
//     );
//
//     options();
//   });
// };
//
// // View all employees
// const viewAllEmployees = () => {
//   var employees = Employee.findAll({
//     raw: true,
//
//     include: [{ model: Role, include: [{ model: Department }] }],
//   }).then((data) => {
//     const employeeLookup = {};
//
//     for (var i = 0; i < data.length; i++) {
//       const employee = data[i];
//       employeeLookup[employee.id] =
//         employee.first_name + " " + employee.last_name;
//     }
//     console.table(
//
//       data.map((employee) => {
//         return {
//           id: employee.id,
//           first_name: employee.first_name,
//           last_name: employee.last_name,
//           title: employee["Role.title"],
//           department: employee["Role.Department.name"],
//           salary: employee["Role.salary"],
//           manager: employeeLookup[employee.manager_id],
//         };
//       })
//     );
//
//     options();
//   });
// };
//
//
//
// // Add department
// const addDepartment = () => {
//
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         message: "What is the new department name?",
//         name: "addDepartment",
//       },
//     ])
//
//     .then((answer) => {
//       Department.create({ name: answer.addDepartment }).then((data) => {
//
//         options();
//       });
//     });
// };

//
// const { Department, Role, Employee } = require("./Models");
// const inquirer = require("inquirer");
// const sequelize = require("./connection");






/// Restructure in progress ****************************************************************
sequelize.sync({ force: false }).then(() => {
  mainMenu();
});

function mainMenu() {
  inquirer
      .prompt([
        {
          type: "list",
          message: "Choose an action:",
          choices: [
            "List Departments",
            "List Roles",
            "List Employees",
            "Create Department",
            "Create Role",
            "Hire Employee",
            "Change Employee Role",
          ],
          name: "choice",
        },
      ])
      .then((response) => {
        switch (response.choice) {
          case "List Departments":
            showDepartments();
            break;
          case "List Roles":
            showRoles();
            break;
          case "List Employees":
            showEmployees();
            break;
          case "Create Department":
            newDepartment();
            break;
          case "Create Role":
            newRole();
            break;
          case "Hire Employee":
            newEmployee();
            break;
          default:
            modifyEmployeeRole();
        }
      });
}

function showDepartments() {
  Department.findAll({ raw: true }).then((deptData) => {
    console.table(deptData);
    mainMenu();
  });
}

function showRoles() {
  Role.findAll({
    raw: true,
    include: [{ model: Department }],
  }).then((roleData) => {
    console.table(roleData.map((role) => ({
      Role_ID: role.id,
      Title: role.title,
      Salary: role.salary,
      Department: role["Department.name"],
    })));
    mainMenu();
  });
}

function showEmployees() {
  Employee.findAll({
    raw: true,
    include: [{ model: Role, include: [{ model: Department }] }],
  }).then((empData) => {
    const empMap = {};
    empData.forEach((emp) => {
      empMap[emp.id] = `${emp.first_name} ${emp.last_name}`;
    });
    console.table(empData.map((emp) => ({
      Employee_ID: emp.id,
      First_Name: emp.first_name,
      Last_Name: emp.last_name,
      Position: emp["Role.title"],
      Department: emp["Role.Department.name"],
      Salary: emp["Role.salary"],
      Manager: empMap[emp.manager_id],
    })));
    mainMenu();
  });
}

function newDepartment() {
  inquirer
      .prompt([
        {
          type: "input",
          message: "Name of new department:",
          name: "deptName",
        },
      ])
      .then((res) => {
        Department.create({ name: res.deptName }).then(() => {
          mainMenu();
        });
      });
}
// ... other functions like newRole, newEmployee, modifyEmployeeRole will follow a similar pattern
/// Restructure in progress ****************************************************************



// Add role
const addRole = async () => {

  let departments = await Department.findAll({
    attributes: [
      ["id", "value"],
      ["name", "name"],
    ],
  });

  departments = departments.map((department) =>
      department.get({ plain: true })
  );


  inquirer
      .prompt([
        {
          type: "input",
          message: "What is the role name??",
          name: "title",
        },
        {
          type: "input",
          message: "What is the salary?",
          name: "salary",
        },
        {
          type: "list",
          message: "To what department does the role belong?",
          name: "department_id",
          choices: departments,
        },
      ])
      //add user answers to database
      .then((answer) => {
        Role.create(answer).then((data) => {

          options();
        });
      });
};

// Add employee
const addEmployee = async () => {
  let roles = await Role.findAll({
    attributes: [
      ["id", "value"],
      ["title", "name"],
    ],
  });

  roles = roles.map((role) => role.get({ plain: true }));

  let managers = await Employee.findAll({
    attributes: [
      ["id", "value"],
      ["first_name", "name"],
      ["last_name", "lastName"],
    ],
  });

  managers = managers.map((manager) => {
    manager.get({ plain: true });
    const managerInfo = manager.get();
    return {
      name: `${managerInfo.name} ${managerInfo.lastName}`,
      value: managerInfo.value,
    };
  });
  managers.push({ type: "Null Manager", value: null });


  inquirer
      .prompt([
        {
          type: "input",
          message: "What is the employee's first name?",
          name: "first_name",
        },
        {
          type: "input",
          message: "What is the employee's last name?",
          name: "last_name",
        },
        {
          type: "list",
          message: "What is the employees new role?",
          name: "role_id",
          choices: roles,
        },
        {
          type: "list",
          message: "To which manager is the employee assigned?",
          name: "manager_id",
          choices: managers,
        },
      ])
      // add user answers to database
      .then((answer) => {
        Employee.create(answer).then((data) => {

          options();
        });
      });
};



// Update employee role
const updateRole = async () => {
  let employees = await Employee.findAll({
    attributes: [
      ["id", "value"],
      ["first_name", "name"],
      ["last_name", "lastName"],
    ],
  });

  employees = employees.map((employee) => {
    employee.get({ plain: true });
    const employeeInfo = employee.get();
    return {
      name: `${employeeInfo.name} ${employeeInfo.lastName}`,
      value: employeeInfo.value,
    };
  });

  let roles = await Role.findAll({
    attributes: [
      ["id", "value"],
      ["title", "name"],
    ],
  });

  roles = roles.map((role) => role.get({ plain: true }));


  inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee's role will be updated?",
          name: "id",
          choices: employees,
        },
        {
          type: "list",
          message:
              "What is the new employee's role?",
          name: "role_id",
          choices: roles,
        },
      ])
      // add user answers to database
      .then((answer) => {

        Employee.update(answer, {
          where: {
            id: answer.id,
          },
        }).then((data) => {

          options();
        });
      });
};