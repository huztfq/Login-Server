// get-request.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ILeaveRequest, ILeaveRequestResponse } from '../../models/user.model';

@Component({
  selector: 'app-get-request',
  templateUrl: './get-request.component.html',
  styleUrls: ['./get-request.component.scss']
})
export class ApproveAttendanceComponent implements OnInit {
  id: string = '';
  leaveRequest: ILeaveRequest | null = null;
  employee: any; 
  leaveDetails: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.id = params.get('id') || '';
      this.getLeaveRequestDetails();
    });
  }

  getLeaveRequestDetails() {
    this.dashboardService.getLeaveRequestById(this.id).subscribe(
      (response: any) => {
        if ('data' in response) {
          this.leaveRequest = response.data;
          this.employee = response.data.employee; 
          this.leaveDetails = response.data.leaveDetails;
        } else {
          console.error('Invalid response format:', response);
        }
      },
      (error: any) => {
        console.error('Error fetching leave request details', error);
      }
    );
  }
  
  approveLeave() {

  }

  declineLeave() {

  }
}