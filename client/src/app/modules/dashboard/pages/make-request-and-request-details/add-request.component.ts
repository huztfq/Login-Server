import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ISubmitRequest } from '../../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.scss'],
})
export class AddRequestComponent implements OnInit {
  private userId: string = '';
  leaveDetails: any;
  showLeaveRequestForm: boolean = false;
  dateForm!: FormGroup;
  multipleDays: boolean = false;
  isRequestInProgress: boolean = false;
  employeeData: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId') || '';
      this.getLeaveDetails();
      this.getEmployeeData();
    });

    this.dateForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: [''],
      selection: ['', Validators.required],
      reason: ['', Validators.required],
    });
  }

  validateDate() {
    const startDate = this.dateForm.get('startDate')?.value;
    const endDate = this.dateForm.get('endDate')?.value;

    if (endDate && new Date(endDate) <= new Date(startDate)) {
      this.dateForm.get('endDate')?.setErrors({ invalidDate: true });
    } else {
      this.dateForm.get('endDate')?.setErrors(null);
    }
  }

  getLeaveDetails() {
    const userId = this.authService.getUserData()?.userId;
    this.dashboardService.getLeaveDetailsById(userId ?? '').subscribe(
      (response: any) => {
        this.leaveDetails = response;
        this.checkRequestInProgress();
      },
      (error) => {
        console.error('Error fetching leave details', error);
      }
    );
  }

  getEmployeeData() {
    const userId = this.authService.getUserData()?.userId;
    this.dashboardService.getSingleEmployee(userId ?? '').subscribe(
      (response: any) => {
        this.employeeData = response.data;
      },
      (error) => {
        console.error('Error fetching employee data', error);
      }
    );
  }

  checkRequestInProgress() {
    if (this.leaveDetails && this.leaveDetails.leaveRequests) {
      this.isRequestInProgress = this.leaveDetails.leaveRequests.some(
        (request: any) => request.state === 'pending'
      );
    }
  }

  makeLeaveRequest() {
    if (this.isRequestInProgress) {
      alert('Request Already In Progress, Please Wait....');
      return;
    }
    this.showLeaveRequestForm = true;
  }

  submitLeaveRequest() {
    if (this.multipleDays) {
      this.validateDate();
    }

    if (!this.dateForm.valid) {
      return;
    }

    const data: ISubmitRequest = {
      startDate: this.dateForm.value.startDate,
      endDate: this.dateForm.value.endDate,
      status: this.dateForm.value.selection,
      message: this.dateForm.value.reason,
    };

    this.dashboardService
      .makeLeaveRequest(this.authService.getUserData()?.userId ?? '', data)
      .subscribe(
        (response: any) => {
          this.showLeaveRequestForm = false;
          this.getLeaveDetails();
        },
        (error) => {
          console.error('Error making leave request', error);
        }
      );
  }

  toggleLeaveRequestForm() {
    this.showLeaveRequestForm = !this.showLeaveRequestForm;
  }

  toggleMultipleDay() {
    this.multipleDays = !this.multipleDays;

    const endDateControl = this.dateForm.get('endDate');

    if (!this.multipleDays) {
      endDateControl?.setValue('');
    }

    if (this.multipleDays) {
      endDateControl?.setValidators([Validators.required]);
    } else {
      endDateControl?.clearValidators();
    }

    endDateControl?.updateValueAndValidity();
  }

  calculateMinEndDate(): string {
    const startDate = this.dateForm.get('startDate')?.value;

    const minEndDate = new Date(startDate);
    minEndDate.setDate(minEndDate.getDate() + 1);

    const minEndDateString = minEndDate.toISOString().split('T')[0];

    return minEndDateString;
  }

  isPTOAllowed(): boolean {
    const probationEndDate = new Date(this.employeeData.probationEndDate);
    const currentDate = new Date();
    return currentDate >= probationEndDate;
  }
}
