const inquirer = require('inquirer');
const { log } = console
const { Client, types } = require('pg')
const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'pass',
    database: 'employment_db'
})

async function totalDepartmentBudget() {
    const { rows } = await client.query(`SELECT department.id, department.name AS department_name FROM department;`)
    log(rows)
    log('\n')
    return inquirer.prompt([
        {
            name: "department",
            message: "Type the deparetment ID of the budget would you like to see?"
        }
    ]).then(async (OBJ) => {
        try {
            const departmentID = OBJ.department
            log(departmentID)
            //strange err here 
            const { rows } = await client.query(`SELECT
            SUM(salary) AS Total_Salary 
            FROM role
            WHERE role.department_id=${departmentID};
            `)
            log(rows)
            // process.exit()
        } catch (err) {
            log(err)
        }

    })
}

async function viewDepartments() {
    const { rows } = await client.query(`SELECT department.id, department.name AS department_name FROM department;`)
    log(rows)
}

async function viewRoles() {
    const { rows } = await client.query(`
    SELECT  
    role.id,
    title,
    salary,
    department.name
    
    FROM role
    JOIN department ON 
    department.id = role.department_id    
    `)
    log(rows)
    return rows
}

async function viewEmployees() {
    const { rows } = await client.query(`
    SELECT  
    department.id,
    department.name AS department_name,
    
    CONCAT(employee.first_name,' ',employee.last_name) AS full_name
    
    FROM department
    
    RIGHT JOIN role ON 
    department.id = role.department_id
    
    JOIN employee ON
    role.id = employee.role_id;`)
    log(rows)
}

async function addDepartment() {
    return inquirer.prompt([
        {
            name: "department_name",
            message: "type department name?"
        }
    ]).then(async (OBJ) => {
        try {
            await client.query(`INSERT INTO department (name) VALUES ($1)`, [OBJ.department_name])
            log(OBJ)
            // process.exit()
        } catch (err) {
            log(err)
        }

    })


}

async function addRole() {
    const departments = await client.query(`SELECT * FROM department`)


    return inquirer.prompt([
        {
            name: "Job_Title",
            message: "What is the name of the Job Title"
        },
        {
            name: "salary",
            message: "What is the salary of this position"
        }
        ,
        {
            name: "department",
            type: 'list',
            choices: departments.rows.map(OBJ => {
                return {
                    name: OBJ.name,
                    value: OBJ.id
                }
            }),
            message: "What department is this role attached to"
        }
    ]).then(
        async (OBJ) => {
            try {
                await client.query(`INSERT INTO role (title,salary,department_id) VALUES ($1,$2,$3)`, [OBJ.Job_Title, OBJ.salary, OBJ.department])
                log(OBJ)
            } catch (err) {
                log(err)
            }

        })
}

async function addEmployee() {
    let Em_role;
    const roles = await client.query(`SELECT title,id FROM role `)

    //  log(managers.rows)
    return inquirer.prompt([
        {
            name: "roles_selection",
            type: 'list',
            choices: roles.rows.map(OBJ => {
                return {
                    name: OBJ.title,
                    value: OBJ.id
                }
            }),
            message: "What role is this employee attached to"
        }
    ]).then(
        async (OBJ) => {
            const managers = await client.query(`
            SELECT  
            CONCAT( first_name,' ',last_name )AS managers,
            role_id
            FROM employee
            WHERE
            role_id=${OBJ.roles_selection};`)
            log(OBJ.roles_selection)
            Em_role = OBJ.roles_selection
            log(managers.rows)
            const newList = managers.rows.map(OBJ => {
                return {
                    name: OBJ.managers,
                    value: OBJ.role_id
                }
            })
            newList.push({
                name: 'None',
                value: null
            })
            const send = inquirer.prompt([
                {
                    name: "employee_firstName",
                    message: "What is the first name of the Job employee"
                },
                {
                    name: "employee_lastName",
                    message: "What is the Last name of the employee"
                },
                {
                    name: "employee_manager",
                    type: 'list',
                    choices: newList,
                    message: "who is this employees manager"
                }
            ])


            return send;
        }).then(async (OBJ) => {

            try {
                await client.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ($1,$2,$3,$4)`,
                    [OBJ.employee_firstName, OBJ.employee_lastName, Em_role, OBJ.employee_manager])
                // log(...Object.values(first))
            } catch (err) {
                log(err)
            }
        })
}

async function updateRole() {
    const roles = await client.query(`SELECT title,id FROM role`)
    return inquirer.prompt([
        {
            name: "Role_Title",
            type: 'list',
            choices: roles.rows.map(OBJ => {
                return {
                    name: OBJ.title,
                    value: OBJ.id
                }
            }),
            message: "What is the Role of the employee you want to update"
        }
    ]).then(
        async (OBJ) => {
            const employee = await client.query(`
            SELECT  
            CONCAT( first_name,' ',last_name )AS fullname,
            role_id AS id
            FROM employee
            WHERE
            role_id=${OBJ.Role_Title};
            `)
           return inquirer.prompt([
                {
                    name: "employee_id",
                    type: 'list',
                    choices: employee.rows.map(OBJ => {
                        return {
                            name: OBJ.fullname,
                            value: OBJ.id
                        }
                    }),
                    message: "What is the employee you want to update"
                },
                {
                    name: "role_id",
                    type: 'list',
                    choices: roles.rows.map(OBJ => {
                        return {
                            name: OBJ.title,
                            value: OBJ.id
                        }
                    }),
                    message: "What is the new role for this employee"
                }
            ]).then(async (OBJ) => {
                log(OBJ)
                // does not work for some reason
                const update = await client.query(`
                UPDATE  
                employee
                SET role_id=$1
                WHERE id=$2
                `,[OBJ.role_id,OBJ.employee_id])
                 
            })
        })
}



function init() {

    inquirer.prompt([
        {
            name: "data",
            type: 'list',
            message: "What would you like to do?",
            choices: ['exit', 'View Total Budget', 'View Departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
        }
    ]).then(async (OBJ) => {
        try {
            log('\n')
            if (OBJ.data === 'exit') {
                process.exit()
            }
            switch (OBJ.data) {
                case 'View Total Budget':
                    totalDepartmentBudget().then(init)
                    break;
                case 'View Departments':
                    viewDepartments().then(init)
                    break;
                case 'view all roles':
                    viewRoles().then(init)
                    break;
                case 'view all employees':
                    viewEmployees().then(init)
                    break;
                case 'add a department':
                    addDepartment().then(init)
                    break;
                case 'add a role':
                    addRole().then(init)
                    break;
                case 'add an employee':
                    addEmployee().then(init)
                    break;
                case 'update an employee role':
                    updateRole().then(init)
                    break;
            }
        } catch (err) {
            log(err)
        }
    })
}
client.connect().then(init)