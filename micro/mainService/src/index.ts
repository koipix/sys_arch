import * as readline from 'readline';

const EMPLOYEE_SERVICE_URL = 'http://localhost:3000';
const PAYROLL_SERVICE_URL = 'http://localhost:3001';

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function printMenu(): void {
  console.log('\n========================================');
  console.log('       EMPLOYEE MANAGEMENT SYSTEM');
  console.log('========================================');
  console.log('1. Add Employee');
  console.log('2. View All Employees');
  console.log('3. View Employee by ID');
  console.log('4. Update Employee');
  console.log('5. Delete Employee');
  console.log('6. Calculate Payroll');
  console.log('7. Check Services Health');
  console.log('0. Exit');
  console.log('========================================');
}

async function addEmployee(): Promise<void> {
  console.log('\n--- Add New Employee ---');
  const emp_name = await prompt('Enter employee name: ');
  const daily_rate_str = await prompt('Enter daily rate: ');
  const daily_rate = parseFloat(daily_rate_str);

  if (!emp_name || isNaN(daily_rate)) {
    console.log('Invalid input. Name and valid daily rate are required.');
    return;
  }

  try {
    const response = await fetch(`${EMPLOYEE_SERVICE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emp_name, daily_rate }),
    });

    if (response.ok) {
      const employee: Employee = await response.json();
      console.log(`\nEmployee created successfully!`);
      console.log(`  ID: ${employee.id}`);
      console.log(`  Name: ${employee.emp_name}`);
      console.log(`  Daily Rate: ${employee.daily_rate}`);
    } else {
      console.log(`Error: ${await response.text()}`);
    }
  } catch (error) {
    console.log('Could not connect to Employee Service. Is it running?');
  }
}

async function viewAllEmployees(): Promise<void> {
  console.log('\n--- All Employees ---');
  try {
    const response = await fetch(`${EMPLOYEE_SERVICE_URL}/employees`);
    const employees: Employee[] = await response.json();

    if (employees.length === 0) {
      console.log('No employees found.');
    } else {
      console.log('\nID\tName\t\t\tDaily Rate');
      console.log('--\t----\t\t\t----------');
      employees.forEach((emp) => {
        console.log(`${emp.id}\t${emp.emp_name.padEnd(20)}\t${emp.daily_rate}`);
      });
    }
  } catch (error) {
    console.log('Could not connect to Employee Service. Is it running?');
  }
}

async function viewEmployeeById(): Promise<void> {
  console.log('\n--- View Employee by ID ---');
  const id = await prompt('Enter employee ID: ');

  try {
    const response = await fetch(`${EMPLOYEE_SERVICE_URL}/employees/${id}`);

    if (response.ok) {
      const employee: Employee = await response.json();
      console.log(`\nEmployee Details:`);
      console.log(`  ID: ${employee.id}`);
      console.log(`  Name: ${employee.emp_name}`);
      console.log(`  Daily Rate: ${employee.daily_rate}`);
    } else {
      console.log('Employee not found.');
    }
  } catch (error) {
    console.log('Could not connect to Employee Service. Is it running?');
  }
}

async function updateEmployee(): Promise<void> {
  console.log('\n--- Update Employee ---');
  const id = await prompt('Enter employee ID to update: ');

  try {
    //check if employee exists
    const checkResponse = await fetch(`${EMPLOYEE_SERVICE_URL}/employees/${id}`);
    if (!checkResponse.ok) {
      console.log('Employee not found.');
      return;
    }

    const currentEmployee: Employee = await checkResponse.json();
    console.log(`\nCurrent details:`);
    console.log(`  Name: ${currentEmployee.emp_name}`);
    console.log(`  Daily Rate: ${currentEmployee.daily_rate}`);

    const newName = await prompt(`Enter new name (or press Enter to keep "${currentEmployee.emp_name}"): `);
    const newRateStr = await prompt(`Enter new daily rate (or press Enter to keep ${currentEmployee.daily_rate}): `);

    const updates: { emp_name?: string; daily_rate?: number } = {};
    if (newName) updates.emp_name = newName;
    if (newRateStr) {
      const newRate = parseFloat(newRateStr);
      if (!isNaN(newRate)) updates.daily_rate = newRate;
    }

    if (Object.keys(updates).length === 0) {
      console.log('No changes made.');
      return;
    }

    const response = await fetch(`${EMPLOYEE_SERVICE_URL}/employees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      const updated: Employee = await response.json();
      console.log(`\nEmployee updated successfully!`);
      console.log(`  ID: ${updated.id}`);
      console.log(`  Name: ${updated.emp_name}`);
      console.log(`  Daily Rate: ${updated.daily_rate}`);
    } else {
      console.log(`Error: ${await response.text()}`);
    }
  } catch (error) {
    console.log('Could not connect to Employee Service. Is it running?');
  }
}

async function deleteEmployee(): Promise<void> {
  console.log('\n--- Delete Employee ---');
  const id = await prompt('Enter employee ID to delete: ');
  const confirm = await prompt(`Are you sure you want to delete employee ${id}? (y/n): `);

  if (confirm.toLowerCase() !== 'y') {
    console.log('Delete cancelled.');
    return;
  }

  try {
    const response = await fetch(`${EMPLOYEE_SERVICE_URL}/employees/${id}`, {
      method: 'DELETE',
    });

    if (response.status === 204) {
      console.log(`Employee ${id} deleted successfully!`);
    } else {
      console.log('Employee not found.');
    }
  } catch (error) {
    console.log('Could not connect to Employee Service. Is it running?');
  }
}

async function calculatePayroll(): Promise<void> {
  console.log('\n--- Calculate Payroll ---');
  const employeeId = await prompt('Enter employee ID: ');
  const daysWorkedStr = await prompt('Enter days worked: ');
  const daysWorked = parseInt(daysWorkedStr, 10);

  if (!employeeId || isNaN(daysWorked)) {
    console.log('Invalid input. Employee ID and valid days worked are required.');
    return;
  }

  try {
    const response = await fetch(`${PAYROLL_SERVICE_URL}/payroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: parseInt(employeeId, 10), daysWorked }),
    });

    if (response.ok) {
      const payroll: PayrollResult = await response.json();
      console.log(`\n========== PAYROLL SLIP ==========`);
      console.log(`Employee ID:    ${payroll.employeeId}`);
      console.log(`Employee Name:  ${payroll.employeeName}`);
      console.log(`Days Worked:    ${payroll.daysWorked}`);
      console.log(`----------------------------------`);
      console.log(`Gross Pay:      ${payroll.grossPay.toFixed(2)}`);
      console.log(`Tax (10%):      ${payroll.tax.toFixed(2)}`);
      console.log(`----------------------------------`);
      console.log(`Net Pay:        ${payroll.netPay.toFixed(2)}`);
      console.log(`==================================`);
    } else {
      console.log(`Error: ${await response.text()}`);
    }
  } catch (error) {
    console.log('Could not connect to Payroll Service. Is it running?');
  }
}

async function checkHealth(): Promise<void> {
  console.log('\n--- Services Health Check ---');

  let employeeStatus = 'DOWN';
  let payrollStatus = 'DOWN';

  try {
    const empResponse = await fetch(`${EMPLOYEE_SERVICE_URL}/employees`);
    employeeStatus = empResponse.ok ? 'UP' : 'DOWN';
  } catch {
    employeeStatus = 'DOWN';
  }

  try {
    await fetch(`${PAYROLL_SERVICE_URL}/payroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    payrollStatus = 'UP';
  } catch {
    payrollStatus = 'DOWN';
  }

  console.log(`\nEmployee Service (port 3000): ${employeeStatus}`);
  console.log(`Payroll Service  (port 3001): ${payrollStatus}`);
}

async function main(): Promise<void> {
  let running = true;

  while (running) {
    printMenu();
    const choice = await prompt('Enter your choice: ');

    switch (choice) {
      case '1':
        await addEmployee();
        break;
      case '2':
        await viewAllEmployees();
        break;
      case '3':
        await viewEmployeeById();
        break;
      case '4':
        await updateEmployee();
        break;
      case '5':
        await deleteEmployee();
        break;
      case '6':
        await calculatePayroll();
        break;
      case '7':
        await checkHealth();
        break;
      case '0':
        console.log('\nGoodbye!');
        running = false;
        break;
      default:
        console.log('\nInvalid choice. Please try again.');
    }
  }
  rl.close();
}

main();
