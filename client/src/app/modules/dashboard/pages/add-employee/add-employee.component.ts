import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICreateUser } from '../../models/user.model';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent {
  public userData: ICreateUser = {
    name: '',
    email: '',
    password: '',
    role: 'employee',
    joiningDate: new Date(),
    designation: ''
  };

  constructor(private dashboardService: DashboardService, private router: Router) {}

  public createEmployee() {
    this.dashboardService.createEmployee(this.userData).subscribe(res => {
      this.router.navigate(['dashboard/home'])
    })
  }
}
