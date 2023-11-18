// Seeds employee table
const sequelize = require("../connection");
const Employee = require("../Models/employee");

const employeesSeedData = require("./employeeSeedData.json");

const seedEmployeeData = async () => {
  await sequelize.sync({ force: true });

  const employees = await Employee.bulkCreate(employeesSeedData);

  process.exit(0);
};

seedEmployeeData();