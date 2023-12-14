import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICreateUser } from '../../models/user.model';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
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

  public employeeForm: FormGroup; 

  constructor(
    private fb: FormBuilder, 
    private dashboardService: DashboardService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
        ]
      ],
      role: ['employee', Validators.required],
      joiningDate: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
      designation: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]]
    });
  }

  public createEmployee() {
    if (this.employeeForm.valid) {
      this.dashboardService.createEmployee(this.userData).subscribe(res => {
        this.router.navigate(['dashboard/home']);
      });
    }
  }
}
