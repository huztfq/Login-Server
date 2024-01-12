import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { NgZone } from '@angular/core';

@Component({
    selector: 'app-change-employee',
    templateUrl: './change-credentials.component.html',
    styleUrls: ['./change-credentials.component.scss']
  })
  export class ChangeCredentialsComponent implements OnInit {
    selectedOption: string = 'none';
    newEmail: string = '';
    newPassword: string = '';
    confirmPassword: string = '';
    originalEmployeeDetails: any = {};
  
    constructor(
      private dashboardService: DashboardService,
      private authService: AuthService,
      private router: Router,

      ) {
      
    }
  
    ngOnInit() {
      this.updateCredentials();
    }
  
    updateCredentials() {
        if (this.selectedOption === 'email') {
          this.updateEmail();
        } else if (this.selectedOption === 'password') {
          this.updatePassword();
        }
    }
  
    updateEmail() {
      if (this.newEmail !== this.originalEmployeeDetails.email) {
        const requestBody = { email: this.newEmail };
  
        this.dashboardService.updateEmployeeDetailsById(this.authService.getUserData()?.userId ?? '', requestBody).subscribe(
          (response: any) => {
            this.router.navigate(['dashboard/home']);
          },
          (error) => {
            console.error('Error updating email:', error);
          }
        );
      }
    }
  
    updatePassword() {
      if (this.newPassword === this.confirmPassword) {
        const requestBody = { password: this.newPassword };
    
        this.dashboardService.updateEmployeeDetailsById(this.authService.getUserData()?.userId ?? '', requestBody).subscribe(
          (response: any) => {
            this.authService.clearUserData();
            this.router.navigate(['signin']); 
          },
          (error) => {
            console.error('Error updating password:', error);
          }
        );
      } else {
        console.error('Password and Confirm Password do not match.');
      }
    }
  }