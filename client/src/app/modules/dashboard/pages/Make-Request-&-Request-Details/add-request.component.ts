import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ILeaveRequest } from '../../models/user.model';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.scss']
})
export class AddRequestComponent {
  leaveDetails: ILeaveRequest | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  getLeaveDetails(id: string) {
    this.dashboardService.getLeaveDetailsById(id).subscribe(
      (response: { success: any; data: ILeaveRequest; }) => {
        if (response.success) {
          this.leaveDetails = response.data;
        } else {
=          console.error('Failed to fetch leave details');
        }
      },
      (error: any) => {
        console.error('Error occurred while fetching leave details', error);
      }
    );
  }

  makeLeaveRequest() {
  }
}
