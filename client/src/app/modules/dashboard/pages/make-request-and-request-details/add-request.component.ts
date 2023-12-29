// Import necessary modules
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ISubmitRequest } from '../../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId') || '';
      this.getLeaveDetails();
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
    if (startDate && endDate && startDate >= endDate) {
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
      },
      (error) => {
        console.error('Error fetching leave details', error);
      },
    );
  }

  makeLeaveRequest() {
    this.showLeaveRequestForm = true;
  }

  submitLeaveRequest() {
    if(this.multipleDays){
      this.validateDate();
    }

    if (!this.dateForm.valid) {
      return;
    }

    console.log(this.dateForm.value, this.multipleDays);
    return;

    // const data: ISubmitRequest = {
    //   startDate: this.leaveRequest.to,
    //   leaveType: this.leaveRequest.leaveType,
    // };

    // console.log(this.leaveRequest);

    return;
    // this.dashboardService.makeLeaveRequest(this.authService.getUserData()?.userId ?? '', data).subscribe(
    //   (response: any) => {
    //     this.showLeaveRequestForm = false;
    //     this.getLeaveDetails();
    //   },
    //   (error) => {
    //     console.error('Error making leave request', error);
    //   },
    // );
  }

  toggleLeaveRequestForm() {
    this.showLeaveRequestForm = !this.showLeaveRequestForm;
  }

  toggleMultipleDay() {
    this.multipleDays = !this.multipleDays;

    const endDateControl = this.dateForm.get('endDate');

    if (this.multipleDays) {
      endDateControl?.setValidators([Validators.required]);
    } else {
      endDateControl?.clearValidators();
    }

    endDateControl?.updateValueAndValidity();
  }
}
