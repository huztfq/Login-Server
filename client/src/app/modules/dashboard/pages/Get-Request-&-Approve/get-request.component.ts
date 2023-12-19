import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { IUser, IUserResponse } from '../../models/user.model';

@Component({
  selector: 'app-approve-attendance',
  templateUrl: './get-request.component.html',
  styleUrls: ['./get-request.component.scss']
})
export class ApproveAttendanceComponent {
  private id: string = '';
  public declare employee: IUser;
  public leaveDetails: { date: string, leaveType: string } | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private dashboardService: DashboardService) {}

  getLeaveDetails(id: string) {
  }

  approveLeave() {

  }

  declineLeave() {

  }
}
