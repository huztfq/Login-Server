// get-request.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ILeaveRequest } from '../../models/user.model';

@Component({
  selector: 'app-get-request',
  templateUrl: './get-request.component.html',
  styleUrls: ['./get-request.component.scss']
})
export class GetRequestComponent implements OnInit {
  leaveRequests: ILeaveRequest[] = [];

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService) {}

  ngOnInit() {
    this.fetchLeaveRequests();
  }
  fetchLeaveRequests() {
    this.dashboardService.getLeaveRequestById().subscribe(
      (response: any) => {
        if (response.success) {
          this.leaveRequests = response.data;
        } else {
          console.error('Failed to fetch leave requests');
        }
      },
      (error) => {
        console.error('Error fetching leave requests', error);
      }
    );
  }

  approveLeave(leaveId: string) {
    this.dashboardService.approveLeaveRequest(leaveId).subscribe(
      (response: any) => {
        if (response.success) {
          console.log('Leave request approved successfully');
          // Optionally, update the local data to reflect the change
        } else {
          console.error('Failed to approve leave request');
        }
      },
      (error) => {
        console.error('Error approving leave request', error);
      }
    );
  }

  declineLeave(leaveId: string) {
    // Similar to approveLeave, implement the logic for declining leave request
  }
}
