INSERT INTO department (dept_name)
VALUES 
('Human Resources'),
('Marketing'),
('Customer Service'),
('Accounting'),
('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES 
('SR HR', 95000, 1),
('Asst HR', 60000, 1),
('Sales Representative I', 70000, 2),
('Head Auditor', 100000, 4),
('Accountant', 80000, 4),
('Consumer Advocate I', 55000, 3),
('Consumer Advocate II', 50000, 3),
('SR Project Manager', 145000, 5),
('Manager', 125000, 5),
('SR Software Devloper', 120000, 5),
('SR Qulaity Engineer', 100000, 5),
('SDET', 110000, 5),
('Jr Sales Rep', 55000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Emily', 'Davis', 1, 3),
('Theodore', 'Dinh', 2, 1),
('Luna','Sanders', 3, null),
('Penelope', 'Jordan', 4, 3),
('Austin', 'Wu', 5, null),
('Joshua', 'Gupta', 1, null),
('Luke', 'Martin', 2, 2),
('Ruby', 'Barnes', 2, 3),
('Easton', 'Bailey', 4,null),
('Madeline', 'Walker', 3, 4),
('Savannah', 'Ali', 5, 1),
('Camilia', 'Rogers', 5, null),
('Robert', 'Yang', 3, 2);
