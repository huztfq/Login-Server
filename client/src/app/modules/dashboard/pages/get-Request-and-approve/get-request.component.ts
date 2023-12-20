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
      (response: ILeaveRequestResponse) => {
        this.leaveRequest = response.data;
      },
      (error: any) => {
        console.error('Error fetching leave request details', error);
      }
    );
  }
}
