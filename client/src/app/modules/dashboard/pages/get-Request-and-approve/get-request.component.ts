import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ILeaveRequest } from '../../models/user.model';

@Component({
  selector: 'app-get-request',
  templateUrl: './get-request.component.html',
  styleUrls: ['./get-request.component.scss']
})
export class GetRequestComponent implements OnInit {
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
          (request: ILeaveRequest) => request.status !== 'approved' && request.status !== 'declined'
        );
      },
      (error) => {
        console.error('Error fetching leave requests', error);
      }
    );
  }

  approveLeave(leaveID: string) {
    this.dashboardService.approveLeaveRequest(leaveID, 'approved').subscribe(
      () => {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.route.snapshot.url]);
      },
      (error) => {
        console.error('Error approving leave', error);
      }
    );
  }

  declineLeave(leaveID: string) {
    this.dashboardService.approveLeaveRequest(leaveID, 'declined').subscribe(
      () => {
        console.log('Leave declined successfully');
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([this.route.snapshot.url]);
      },
      (error) => {
        console.error('Error declining leave', error);
      }
    );
  }
}
