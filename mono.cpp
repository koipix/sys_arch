#include <iostream>
#include <string>
#include <vector>

using std::cout;
using std::cin;
using std::endl;
using std::string;
using std::vector;

class Employee {
public:
  int     id;
  string  emp_name;
  int     daily_rate;

  Employee(const int& id, const string& en, const int& dr): id(id), emp_name(en), daily_rate(dr) {}

  void getEmployee() {
    cout << "Employee's ID: " << id << endl;  
    cout << "Employee's Name: " << emp_name << endl;  
    cout << "Employee's Rate: " << daily_rate << endl;
  }

  int getId() const {
    return this->id;
  }

  string getName() const {
    return this->emp_name;
  }

  int getRate() const {
    return this->daily_rate;
  }

  void setName(const string& new_name) {
    this->emp_name = new_name;
    cout << "New Employee's Name: " << emp_name << endl;  
  }

  void setRate(const int new_rate) {
    this->daily_rate = new_rate;
    cout << "New Employee's Rate: " << daily_rate << endl;
  }
};

class EmployeeSystem {
private:
  vector<Employee> e_list;

public:
  void addEmployee(const Employee& employee) {
    e_list.push_back(employee);
    cout << "Created Employee" << endl;
    cout << "ID: " << employee.getId() << endl;
    cout << "Name: " << employee.getName() << endl;
    cout << "Daily Rate: " << employee.getRate() << "\n" << endl;
  }

  void deleteEmployee(const int& id) {
    for (int i = 0; i < e_list.size(); i++) {
      if (id == e_list[i].getId()) {
        e_list.erase(e_list.begin() + i);
        i--;
      }
    }
  }

  void setEmployeeName(const int& id, const string& new_name) {
    Employee* employee = searchEmpById(id);
    employee->setName(new_name);
  }

  void setEmployeeRate(const int& id, const int& new_rate) {
    Employee* employee = searchEmpById(id);
    employee->setRate(new_rate);
  }

  Employee* searchEmpById(const int& id) {
    for (int i = 0; i < e_list.size(); i++) {
      if (id == e_list[i].getId()) {
        return &e_list[i];
      }
    }
    return nullptr;
  }

  void getAllEmployee() {
    for (int i = 0; i < e_list.size(); i++) {
      cout << "Employee's ID: " << e_list[i].getId() << endl;  
      cout << "Employee's Name: " << e_list[i].getName() << endl;
      cout << "Employee's Rate: " << e_list[i].getRate() << "\n" << endl;
    }
  }

  void calculatePay(const int& id, const int& days) {
    int gross_pay = 0;
    int net_pay = 0;
    double total_tax = 0;

    int days_worked = days;
    double tax_rate = 0.1;

    Employee* employee = searchEmpById(id);

    gross_pay = employee->getRate() * days_worked;
    total_tax = gross_pay * tax_rate;
    net_pay = gross_pay - total_tax;

    cout << "Payroll Result" << endl;
    cout << "Gross Pay: " << gross_pay << endl;
    cout << "Tax: " << total_tax << endl;
    cout << "Net Pay: " << net_pay << endl;
  }
};

int main() {
  EmployeeSystem e_system;
  e_system.addEmployee(Employee(101, "Hina", 100));
  e_system.calculatePay(101, 10);

  return 0;
}
