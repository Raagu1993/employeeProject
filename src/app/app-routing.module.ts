import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeListComponent } from 'src/app/employee-list/employee-list.component'
import { AddEmployeeComponent } from 'src/app/add-employee/add-employee.component';
import { EmployeeDetailsComponent } from 'src/app/employee-details/employee-details.component';

const routes: Routes = [
  { path: 'empList', component: EmployeeListComponent },
  { path: 'addEmp', component: AddEmployeeComponent },
  { path: 'empDetails', component: EmployeeDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
