import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ILeaveRequest } from '../../models/user.model';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { request } from 'http';
import { response } from 'express';

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
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchLeaveRequests();
  }

  fetchLeaveRequests() {
    this.dashboardService.getLeaveRequestById().subscribe(
      (response: any) => {
        this.leaveRequests = response.filter(
          (request: ILeaveRequest) => request.status !== 'approved' && request.status !== 'rejected'
        );
  
        const userIdSet = new Set<string>();
        for (const request of this.leaveRequests) {
          userIdSet.add(request.user._id);
        }
  
      },
      (error) => {
        console.error('Error fetching leave requests', error);
      }
    );
  }

  approveLeave(leaveID: string) {
    const name = this.authService.getUserName() || '';
  
    const leaveRequest = this.leaveRequests.find((request) => request._id === leaveID);
  
    const userid = leaveRequest?.user._id || '';
  
    this.dashboardService.approveLeaveRequest(leaveID, 'approved', name, userid).subscribe(
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
    const name = this.authService.getUserName() || '';
  
    const leaveRequest = this.leaveRequests.find((request) => request._id === leaveID);
  
    const userid = leaveRequest?.user._id || '';
  
    this.dashboardService.approveLeaveRequest(leaveID, 'rejected', name, userid).subscribe(
      () => {
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