//
//
//
//
//
// //Modularization of the current functions -
// const { Department } = require("./Models");
// const inquirer = require("inquirer");
//
// async function viewAllDepartments() {
//     const departments = await Department.findAll({ raw: true });
//     console.table(departments);
// }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// // ** End of Modularization
//
//
// // View all departments
// const {Department, Role, Employee} = require("./Models");
// const inquirer = require("inquirer");
// const viewAllDepartments = () => {
//     var departments = Department.findAll({ raw: true }).then((data) => {
//         console.table(data);
//
//         options();
//     });
// };
//
// // View all roles
// const viewAllRoles = () => {
//     var roles = Role.findAll({
//         raw: true,
//         // Joining Department and Role table
//         include: [{ model: Department }],
//     }).then((data) => {
//         console.table(
//
//             data.map((role) => {
//                 return {
//                     id: role.id,
//                     title: role.title,
//                     salary: role.salary,
//                     department: role["Department.name"],
//                 };
//             })
//         );
//
//         options();
//     });
// };
//
// // View all employees
// const viewAllEmployees = () => {
//     var employees = Employee.findAll({
//         raw: true,
//
//         include: [{ model: Role, include: [{ model: Department }] }],
//     }).then((data) => {
//         const employeeLookup = {};
//
//         for (var i = 0; i < data.length; i++) {
//             const employee = data[i];
//             employeeLookup[employee.id] =
//                 employee.first_name + " " + employee.last_name;
//         }
//         console.table(
//
//             data.map((employee) => {
//                 return {
//                     id: employee.id,
//                     first_name: employee.first_name,
//                     last_name: employee.last_name,
//                     title: employee["Role.title"],
//                     department: employee["Role.Department.name"],
//                     salary: employee["Role.salary"],
//                     manager: employeeLookup[employee.manager_id],
//                 };
//             })
//         );
//
//         options();
//     });
// };
//
//
//
// // Add department
// const addDepartment = () => {
//
//     inquirer
//         .prompt([
//             {
//                 type: "input",
//                 message: "What is the new department name?",
//                 name: "addDepartment",
//             },
//         ])
//
//         .then((answer) => {
//             Department.create({ name: answer.addDepartment }).then((data) => {
//
//                 options();
//             });
//         });
// };
//
// // Add role
// const addRole = async () => {
//
//     let departments = await Department.findAll({
//         attributes: [
//             ["id", "value"],
//             ["name", "name"],
//         ],
//     });
//
//     departments = departments.map((department) =>
//         department.get({ plain: true })
//     );
//
//
//     inquirer
//         .prompt([
//             {
//                 type: "input",
//                 message: "What is the role name??",
//                 name: "title",
//             },
//             {
//                 type: "input",
//                 message: "What is the salary?",
//                 name: "salary",
//             },
//             {
//                 type: "list",
//                 message: "To what department does the role belong?",
//                 name: "department_id",
//                 choices: departments,
//             },
//         ])
//         //add user answers to database
//         .then((answer) => {
//             Role.create(answer).then((data) => {
//
//                 options();
//             });
//         });
// };
//
// // Add employee
// const addEmployee = async () => {
//     let roles = await Role.findAll({
//         attributes: [
//             ["id", "value"],
//             ["title", "name"],
//         ],
//     });
//
//     roles = roles.map((role) => role.get({ plain: true }));
//
//     let managers = await Employee.findAll({
//         attributes: [
//             ["id", "value"],
//             ["first_name", "name"],
//             ["last_name", "lastName"],
//         ],
//     });
//
//     managers = managers.map((manager) => {
//         manager.get({ plain: true });
//         const managerInfo = manager.get();
//         return {
//             name: `${managerInfo.name} ${managerInfo.lastName}`,
//             value: managerInfo.value,
//         };
//     });
//     managers.push({ type: "Null Manager", value: null });
//
//
//     inquirer
//         .prompt([
//             {
//                 type: "input",
//                 message: "What is the employee's first name?",
//                 name: "first_name",
//             },
//             {
//                 type: "input",
//                 message: "What is the employee's last name?",
//                 name: "last_name",
//             },
//             {
//                 type: "list",
//                 message: "What is the employees new role?",
//                 name: "role_id",
//                 choices: roles,
//             },
//             {
//                 type: "list",
//                 message: "To which manager is the employee assigned?",
//                 name: "manager_id",
//                 choices: managers,
//             },
//         ])
//         // add user answers to database
//         .then((answer) => {
//             Employee.create(answer).then((data) => {
//
//                 options();
//             });
//         });
// };
//
//
//
// // Update employee role
// const updateRole = async () => {
//     let employees = await Employee.findAll({
//         attributes: [
//             ["id", "value"],
//             ["first_name", "name"],
//             ["last_name", "lastName"],
//         ],
//     });
//
//     employees = employees.map((employee) => {
//         employee.get({ plain: true });
//         const employeeInfo = employee.get();
//         return {
//             name: `${employeeInfo.name} ${employeeInfo.lastName}`,
//             value: employeeInfo.value,
//         };
//     });
//
//     let roles = await Role.findAll({
//         attributes: [
//             ["id", "value"],
//             ["title", "name"],
//         ],
//     });
//
//     roles = roles.map((role) => role.get({ plain: true }));
//
//
//     inquirer
//         .prompt([
//             {
//                 type: "list",
//                 message: "Which employee's role will be updated?",
//                 name: "id",
//                 choices: employees,
//             },
//             {
//                 type: "list",
//                 message:
//                     "What is the new employee's role?",
//                 name: "role_id",
//                 choices: roles,
//             },
//         ])
//         // add user answers to database
//         .then((answer) => {
//
//             Employee.update(answer, {
//                 where: {
//                     id: answer.id,
//                 },
//             }).then((data) => {
//
//                 options();
//             });
//         });
// };