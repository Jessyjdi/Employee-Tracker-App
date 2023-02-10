var mysql2 = require("mysql2");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql2.createConnection({
  host: "localhost",
  // port
  port: 3306,
  // username
  user: "root",
  // password
  password: "passWORD123",
  database: "employee_db",
});

connection.connect((err) => {
  if (err) throw err;

  search();
});

// code
function search() {
  inquirer
    .prompt({
      message: "What would you like to do?",
      name: "selection",
      type: "list",
      choices: [
        "View All Employees",
        "View All Department",
        "View All Role",
        "Add a Employee",
        "Add a Department",
        "Add a Role",
        "Update an Employee Role",
        "Delete Employee",
        "End",
      ],
    })
    .then(function (answer) {
      console.log(answer);

      if (answer.selection === "View All Employees") {
        viewAll();
      } else if (answer.selection === "View All Department") {
        viewDepts();
      } else if (answer.selection === "View All Role") {
        viewrole();
      } else if (answer.selection === "Add a Employee") {
        addEmployee();
      } else if (answer.selection === "Add a Department") {
        addDept();
      } else if (answer.selection === "Add a Role") {
        addRole();
      } else if (answer.selection === "Update an Employee Role") {
        updateRole();
      } else if (answer.selection === "Delete Employee") {
        deleteEmployee();
      } else {
        connection.end();
      }
    });
}

//View All Employees Function
function viewAll() {
  connection.query(
   // "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.id, department.id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id",
   "SELECT * from employee",
    function (err, result, fields) {
      if (err) throw err;
    console.table(result);
          // prompt the user for more choices
      search();
    }
  );
}

function viewrole() {
  connection.query(
    "SELECT role.id, role.title, role.salary, role.department_id, department.id, department.dept_name FROM role LEFT JOIN department on role.department_id = department.id",
    function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      // prompt the user for more choices
      search();
    }
  );
}

function viewDepts() {
  connection.query("SELECT * FROM department", function (err, result, fields) {
    if (err) throw err;
    console.table(result);
    // prompt the user for more choices
    search();
  });
}

var roleChoices = [];
var empChoices = [];
var deptChoices = [];

function lookuprole() {
  connection.query("SELECT * FROM role", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      roleChoices.push(data[i].id + "-" + data[i].title);
    }
  });
}

function lookupEmployee() {
  connection.query("SELECT * FROM employee", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      empChoices.push(
        data[i].id + "-" + data[i].first_name + " " + data[i].last_name
      );
    }
  });
}

function lookupDepts() {
  connection.query("SELECT * FROM department", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      deptChoices.push(data[i].id + "-" + data[i].name);
    }
  });
}

function addEmployee() {
  lookuprole();
  lookupEmployee();

  inquirer
    .prompt([
      {
        name: "firstname",
        type: "input",
        message: "What is the employee's first name?",
      },

      {
        name: "lastname",
        type: "input",
        message: "What is the employee's last name?",
      },

      {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: roleChoices,
      },

      {
        name: "reportingTo",
        type: "list",
        message: "Who is the employee's manager?",
        choices: empChoices,
      },
    ])
    .then(function (answer) {
      var getRoleId = answer.role.split("-");
      var getReportingToId = answer.reportingTo.split("-");
      var query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
     VALUES ('${answer.firstname}','${answer.lastname}','${getRoleId[0]}','${getReportingToId[0]}')`;
      connection.query(query, function (err, res) {
        console.log(
          `new employee ${answer.firstname} ${answer.lastname} added!`
        );
      });
      search();
    });
}

function addRole() {
  lookuprole();
  lookupEmployee();
  lookupDepts();

  inquirer
    .prompt([
      {
        name: "role",
        type: "input",
        message: "Enter the role you would like to add:",
      },

      {
        name: "dept",
        type: "list",
        message: "Which department would you like to add this role?",
        choices: deptChoices,
      },

      {
        name: "salary",
        type: "number",
        message: "Enter the role's salary:",
      },
    ])
    .then(function (answer) {
      console.log(`${answer.role}`);
      var getDeptId = answer.dept.split("-");
      var query = `INSERT INTO role (title, salary, department_id)
   VALUES ('${answer.role}','${answer.salary}','${getDeptId[0]}')`;
      connection.query(query, function (err, res) {
        console.log(`<br>-----new role ${answer.role} added!------`);
      });
      search();
    });
}

function addDept() {
  lookuprole();
  lookupEmployee();
  lookupDepts();

  inquirer
    .prompt([
      {
        name: "dept",
        type: "input",
        message: "Enter the department you would like to add:",
      },
    ])
    .then(function (answer) {
      var query = `INSERT INTO department (name)
   VALUES ('${answer.dept}')`;
      connection.query(query, function (err, res) {
        console.log(`-------new department added: ${answer.dept}-------`);
      });
      search();
    });
}

function updateRole() {
  connection.query("SELECT * FROM employee", function (err, result) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employeeName",
          type: "list",

          message: "Which employee's role is changing?",
          choices: function () {
            var employeeArray = [];
            result.forEach((result) => {
              employeeArray.push(result.last_name);
            });
            return employeeArray;
          },
        },
      ])

      .then(function (answer) {
        console.log(answer);
        const name = answer.employeeName;

        connection.query("SELECT * FROM role", function (err, res) {
          inquirer
            .prompt([
              {
                name: "role",
                type: "list",
                message: "What is their new role?",
                choices: function () {
                  var roleArray = [];
                  res.forEach((res) => {
                    roleArray.push(res.title);
                  });
                  return roleArray;
                },
              },
            ])
            .then(function (roleAnswer) {
              const role = roleAnswer.role;
              console.log(role);
              connection.query(
                "SELECT * FROM role WHERE title = ?",
                [role],
                function (err, res) {
                  if (err) throw err;
                  let roleId = res[0].id;

                  let query =
                    "UPDATE employee SET role_id = ? WHERE last_name =  ?";
                  let values = [parseInt(roleId), name];

                  connection.query(query, values, function (err, res, fields) {
                    console.log(`You have updated ${name}'s role to ${role}.`);
                  });
                  viewAll();
                }
              );
            });
        });
      });
  });
}

function viewEmpbyDept() {
  // write code...
}
function deleteEmployee() {
  console.log("Deleting an employee");

  var query = `SELECT id, first_name, last_name
      FROM employee `

  connection.query(query, function (err, res) {
    if (err) throw err;

    const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${id} ${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("ArrayToDelete!\n");

    promptDelete(deleteEmployeeChoices);
  });
}

// User choose the employee list, then employee is deleted
function promptDelete(deleteEmployeeChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to remove?",
        choices: deleteEmployeeChoices
      }
    ])
    .then(function (answer) {

      var query = `DELETE FROM employee WHERE ?`;
      // when finished prompting, insert a new item into the db with that info
      connection.query(query, { id: answer.employeeId }, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(res.affectedRows + "Deleted!\n");

        search();
      });
    });
}
