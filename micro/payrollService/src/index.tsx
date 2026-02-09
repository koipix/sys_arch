import express, { Request, Response } from 'express';

const app = express();
const port = 3001;

app.use(express.json());

const EMPLOYEE_SERVICE_URL = 'http://localhost:3000';

interface Employee {
  id: number;
  emp_name: string;
  daily_rate: number;
}

interface PayrollResult {
  employeeId: number;
  employeeName: string;
  daysWorked: number;
  grossPay: number;
  tax: number;
  netPay: number;
}

app.post('/payroll', async (req: Request, res: Response) => {
  const { employeeId, daysWorked } = req.body;

  if (employeeId === undefined || daysWorked === undefined) {
    return res.status(400).send('employeeId and daysWorked are required');
  }

  try {
    const response = await fetch(`${EMPLOYEE_SERVICE_URL}/employees/${employeeId}`);

    if (!response.ok) {
        if (response.status === 404) {
            return res.status(404).send(`Employee with ID ${employeeId} not found in Employee Service.`);
        }
        throw new Error(`Employee service returned an error: ${response.statusText}`);
    }
    
    const employee: Employee = await response.json();

    const taxRate = 0.1;
    const grossPay = employee.daily_rate * daysWorked;
    const tax = grossPay * taxRate;
    const netPay = grossPay - tax;

    const payrollResult: PayrollResult = {
      employeeId: employee.id,
      employeeName: employee.emp_name,
      daysWorked: daysWorked,
      grossPay: grossPay,
      tax: tax,
      netPay: netPay,
    };

    console.log(`Calculated payroll for Employee ID: ${employee.id}`);
    res.json(payrollResult);

  } catch (error) {
    console.error('Error communicating with employee service or calculating payroll:', error);
    res.status(500).send('Could not process payroll. Is the employee service running?');
  }
});

app.listen(port, () => {
  console.log(`Payroll service listening at http://localhost:${port}`);
});
