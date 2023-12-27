import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ILeaveRequest } from '../../models/user.model';

@Component({
  selector: 'app-get-request-history',
  templateUrl: './request-history.component.html',
  styleUrls: ['./request-history.component.scss']
})
export class GetRequestHistoryComponent implements OnInit {
  leaveRequests: ILeaveRequest[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.fetchLeaveRequests();
  }

  fetchLeaveRequests() {
    this.dashboardService.getLeaveRequestById().subscribe(
      (response: any) => {
        this.leaveRequests = response.filter(
          (request: ILeaveRequest) => request.status !== 'pending'
        );
      },
      (error) => {
        console.error('Error fetching leave requests', error);
      }
    );
  }
}
