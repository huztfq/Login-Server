import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICreateUser } from '../../models/user.model';

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
}
