import express, { Request, Response } from 'express';

interface Employee {
  id: number;
  emp_name: string;
  daily_rate: number;
}

const app = express();
const port = 3000;

app.use(express.json());

let employees: Employee[] = [];
let nextId = 1;

//add a new employee
app.post('/employees', (req: Request, res: Response) => {
  const { emp_name, daily_rate } = req.body;

  if (!emp_name || daily_rate === undefined) {
    return res.status(400).send('emp_name and daily_rate are required');
  }

  const newEmployee: Employee = {
    id: nextId++,
    emp_name,
    daily_rate,
  };

  employees.push(newEmployee);
  console.log(`Created Employee: ID: ${newEmployee.id}, Name: ${newEmployee.emp_name}`);
  res.status(201).json(newEmployee);
});

//get all employees
app.get('/employees', (req: Request, res: Response) => {
  res.json(employees);
});

//get a single employee by ID
app.get('/employees/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const employee = employees.find(e => e.id === id);

  if (employee) {
    res.json(employee);
  } else {
    res.status(404).send('Employee not found');
  }
});

//update an employee's details
app.patch('/employees/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const { emp_name, daily_rate } = req.body;
    const employeeIndex = employees.findIndex(e => e.id === id);

    if (employeeIndex === -1) {
        return res.status(404).send('Employee not found');
    }

    const employee = employees[employeeIndex];

    if (emp_name !== undefined) {
        employee.emp_name = emp_name;
        console.log(`Updated Employee ${id}'s Name to: ${emp_name}`);
    }

    if (daily_rate !== undefined) {
        employee.daily_rate = daily_rate;
        console.log(`Updated Employee ${id}'s Rate to: ${daily_rate}`);
    }

    employees[employeeIndex] = employee;
    res.json(employee);
});

//delete an employee by ID
app.delete('/employees/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const initialLength = employees.length;
  employees = employees.filter(e => e.id !== id);

  if (employees.length < initialLength) {
    console.log(`Deleted Employee with ID: ${id}`);
    res.status(204).send(); // No Content
  } else {
    res.status(404).send('Employee not found');
  }
});

app.listen(port, () => {
  console.log(`Employee service listening at http://localhost:${port}`);
});
