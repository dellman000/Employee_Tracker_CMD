SELECT  
department.id,
role.title
FROM department
JOIN role ON 
department.id = role.department_id;

