// add-employee.component.ts

import { Component } from '@angular/core';
import { ICreateUser } from '../../models/user.model';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private dashboardService: DashboardService,
    private router: Router,
    private formBuilder: FormBuilder  
  ) {
    this.employeeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]], 
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/),
        ],
      ], 
      role: ['employee', Validators.required],
      joiningDate: [new Date(), Validators.required],
      designation: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]], 
    });
  }

  public isInvalid(controlName: string): boolean {
    const control = this.employeeForm.controls[controlName];
    const isControlInvalid = control.invalid && (control.dirty || control.touched) && control.value !== '';
    return isControlInvalid;

  }

  public createEmployee() {
    if (this.employeeForm.valid) {
      this.dashboardService.createEmployee(this.userData).subscribe(res => {
        this.router.navigate(['dashboard/home']);
      });
    }
  }
}
