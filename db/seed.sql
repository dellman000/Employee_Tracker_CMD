INSERT INTO department (name) VALUES
('Sales'),
('Legal'),
('Finance'),
('Software Development');

INSERT INTO role (title,salary,department_id) VALUES
('Sales Lead',100000,1),
('Sales person',80000,1),
('Lead Engineer',110000,4),
('Software Engineer',75000,4),
('Account Manager',85000,3),
('Accountant',125000,3),
('Legal Team Lead',150000,2),
('Lawer',200000,2);

INSERT INTO employee(first_name,last_name,role_id,manager_id)  VALUES
('John','Doe',1,NULL),
('Mike','Chan',1,1),
('Ashley','Rod',3,NULL),
('kevin','Tupik',4,3),
('Kunal','Singh',5,NULL),
('Malia','Brown',6,5),
('Sarah','Lourd',7,NULL),
('Tom','Allen',8,7);