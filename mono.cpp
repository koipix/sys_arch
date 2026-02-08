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

  int getId() {
    return this->id;
  }

  string getName() {
    return this->emp_name;
  }

  int getRate() {
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
    for (int i = 0; i < e_list.size(); i++) {
      if (id == e_list[i].getId()) {
        e_list[i].setName(new_name);
      }
    }
  }

  void setEmployeeRate(const int& id, const int& new_rate) {
    for (int i = 0; i < e_list.size(); i++) {
      if (id == e_list[i].getId()) {
        e_list[i].setRate(new_rate);
      }
    }
  }

  void getAllEmployee() {
    for (int i = 0; i < e_list.size(); i++) {
      cout << "Employee's ID: " << e_list[i].getId() << endl;  
      cout << "Employee's Name: " << e_list[i].getName() << endl;
      cout << "Employee's Rate: " << e_list[i].getRate() << "\n" << endl;
    }
  }
};

int main() {
  EmployeeSystem e_system;

  e_system.addEmployee(Employee(101, "Hina", 100));
  e_system.addEmployee(Employee(205, "Airi", 150));

  e_system.getAllEmployee();

  e_system.deleteEmployee(101);

  //After deletion
  e_system.getAllEmployee();
  return 0;
}
