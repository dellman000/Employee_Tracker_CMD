-- show all employees
SELECT  
department.id,
department.name AS department_name,
role.title,
CONCAT(employee.first_name,' ',employee.last_name) AS full_name,
role.salary,
CONCAT( managers.first_name,' ',managers.last_name )AS manager
FROM department

RIGHT JOIN role ON 
department.id = role.department_id

JOIN employee ON
role.id = employee.role_id

LEFT JOIN employee AS managers
ON 
employee.manager_id = managers.id;


-- show all departments

SELECT  
department.id,
department.name AS department_name
FROM department;

-- show all roles 
SELECT  
department.id,
department.name AS department_name,
role.title,
role.salary
FROM department

RIGHT JOIN role ON 
department.id = role.department_id

JOIN employee ON
role.id = employee.role_id;

-- View employees by manager
SELECT  
-- CONCAT(employee.first_name,' ',employee.last_name) AS full_name,
CONCAT( employee.first_name,' ',employee.last_name )AS managers
FROM employee
WHERE 
employee.manager_id > 0;

-- View employees by department
SELECT  
department.id,
department.name AS department_name,

CONCAT(employee.first_name,' ',employee.last_name) AS full_name

FROM department

RIGHT JOIN role ON 
department.id = role.department_id

JOIN employee ON
role.id = employee.role_id;

-- View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

SELECT
SUM(salary) AS Total_Salary
FROM role
WHERE role.department_id=3;
-- WHERE role.department_id=department.id;


-- view All roles
-- SELECT  
-- role.id,
-- title,
-- salary,
-- department.name

-- FROM role
-- JOIN department ON 
-- department.id = role.department_id;
-- --
-- SELECT  

-- CONCAT( first_name,' ',last_name )AS managers,
-- role_id AS id
-- FROM employee
-- WHERE
-- role_id=1;

--

SELECT  
CONCAT( first_name,' ',last_name )AS employees,
role_id AS id
FROM employee
WHERE
role_id=4;


