import { Component, OnInit } from '@angular/core';
import { ISubmitAttendance, IUser, IUsersResponse } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  name: string = '';
  email: string = '';
  designation: string = '';
  role: string = '';
  password: string = '';
  selectedEmployeeId: string = '';
  employees: IUser[] = [];
  isPasswordVisible: boolean = false;
  isUpdateButtonEnabled: boolean = false;

  originalEmployeeDetails: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  private fetchEmployees() {
    this.dashboardService.getAllEmployees().subscribe(
      (res: IUsersResponse) => {
        this.zone.run(() => {
          this.employees = res.data;
        });
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }



  onEmployeeSelected() {
    if (this.selectedEmployeeId) {
      this.dashboardService.getEmployeeDetailsById(this.selectedEmployeeId).subscribe(
        (employeeDetails: any) => {
          this.originalEmployeeDetails = { ...employeeDetails };
          this.updateFormWithEmployeeDetails();
          this.updateButtonStatus();
        },
        (error) => {
          console.error('Error fetching employee details:', error);
        }
      );
    }
  }

updateEmployeeDetails() {
  if (this.selectedEmployeeId) {
    const updatedData: any = {};

    if (this.name !== this.originalEmployeeDetails.name) {
      updatedData.name = this.name;
    }
    if (this.email !== this.originalEmployeeDetails.email) {
      updatedData.email = this.email;
    }
    if (this.designation !== this.originalEmployeeDetails.designation) {
      updatedData.designation = this.designation;
    }
    if (this.role !== this.originalEmployeeDetails.role) {
      updatedData.role = this.role;
    }
    if (this.password !== this.originalEmployeeDetails.password) {
      updatedData.password = this.password;
    }

    const requestBody: { [key: string]: any } = {};
    Object.keys(updatedData).forEach((key) => {
      requestBody[key] = updatedData[key];
    });

    this.dashboardService.updateEmployeeDetailsById(this.selectedEmployeeId, requestBody).subscribe(
      (response: any) => {
        this.router.navigate(['dashboard/home']);
      },
      (error) => {
        console.error('Error updating employee details:', error);
      }
    );
  }
}

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  private updateFormWithEmployeeDetails() {
    this.name = this.originalEmployeeDetails.name;
    this.email = this.originalEmployeeDetails.email;
    this.designation = this.originalEmployeeDetails.designation;
    this.role = this.originalEmployeeDetails.role;
    this.password = this.originalEmployeeDetails.password;
  }

   updateButtonStatus() {
    this.isUpdateButtonEnabled =
      this.name !== this.originalEmployeeDetails.name ||
      this.email !== this.originalEmployeeDetails.email ||
      this.designation !== this.originalEmployeeDetails.designation ||
      this.role !== this.originalEmployeeDetails.role ||
      this.password !== this.originalEmployeeDetails.password;
  }
  deleteEmployee() {
    if (this.selectedEmployeeId) {
      this.dashboardService.deleteEmployeeById(this.selectedEmployeeId).subscribe(
        (response: any) => {
          // Optionally handle success response
          console.log('Employee deleted successfully.');
        },
        (error) => {
          console.error('Error deleting employee:', error);
        }
      );
    }
  }
}
