## What components were tightly coupled in the monolithic implementation?

* Employee class + EmployeeSystem: system directly manipulates `Employee` internals
* Employee data + Payroll logic: `calculatePay()` is inside `EmployeeSystem`, not separate
* Data storage + Business logic: `vector<Employee> e_list` and all operations in same class
* Direct pointer access: `searchEmpById()` returns raw pointer used by payroll

## How did separating services change the structure of the system?
* In monolithic design, there's only single class that controls the entirety of the app, so if a certain component fails the app will need to be restarted again.
* While with microservices approach, it is actually more modular which can be easier to scale and maintain especially ensuring availability since they run independently.

## Which architecture is easier to maintain for a small system? Why?
* For smaller systems, monolithic is definitely easier to main compared to the microservices due to the network layer overhead but for big scale projects? The history is different, they'll become the polar oppsites when it comes into maintainability.
* It still boils down to developers approach of their monolithic design, if it was considered to be modular in mind then it can solve the maintainability issues when needed.

## When would a microservices architecture be more appropriate than a monolithic one?
* It's preferable to consider microservice when planning a big scale complex project as it'll need a lot of scaling and maintaining later on, especially when availability of the system is always considered.
* Technology Flexibility can be crucial in this case too when scaling to new hardware.
