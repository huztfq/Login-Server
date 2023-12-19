import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { IUser, IUserResponse, ILeaveRequestResponse } from '../../models/user.model';

@Component({
  selector: 'app-approve-attendance',
  templateUrl: './get-request.component.html',
  styleUrls: ['./get-request.component.scss']
})
export class ApproveAttendanceComponent implements OnInit {
  private id: string = '';
  public employee: IUser | null = null;
  public leaveDetails: { date: string, leaveType: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getEmployeeDetails(this.id);
    });
  }

  getEmployeeDetails(id: string) {
    this.dashboardService.getEmployeeDetails(id).subscribe((response: IUserResponse) => {
      if (response.success) {
        this.employee = response.data;
      } else {
        console.log('Error fetching employee details');
      }
    });

    this.dashboardService.getLeaveDetails(id).subscribe((response: ILeaveRequestResponse) => {
      if (response.success) {
        this.leaveDetails = {
          date: response.data.date,
          leaveType: response.data.leaveType
        };
      } else {
        console.log('Error fetching leave details');
      }
    });
  }

  approveLeave() {
    this.dashboardService.approveLeave(this.id).subscribe((response: { success: any; }) => {
      if (response.success) {
      } else {
        console.log('Error approving leave');
      }
    });
  }

  declineLeave() {
    this.dashboardService.declineLeave(this.id).subscribe((response: { success: any; }) => {
      if (response.success) {
      } else {
        console.log('Error declining leave');
      }
    });
  }
}
