import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ISubmitAttendance } from '../../models/user.model';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.scss']
})
export class AddRequestComponent implements OnInit {
  id: string = '';
  attendance: ISubmitAttendance = {
    userId: '',
    date: '',
    leaveType: null
  };
  leaveDetails: any; // Adjust the type accordingly

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
    });
  }

  submitAttendance() {
    // Assuming you have a method to retrieve leave details based on the submitted attendance
    this.dashboardService.getLeaveDetails(this.attendance.userId, this.attendance.date).subscribe(
      (details: any) => {
        this.leaveDetails = details;
      },
      (error: any) => {
        console.error('Error retrieving leave details', error);
      }
    );
    }
  makeLeaveRequest() {
    // Assuming you have a method to make a leave request based on leave details
    this.dashboardService.makeLeaveRequest(this.leaveDetails).subscribe(
      (response) => {
        // Handle the response as needed
      },
      (error: any) => {
        console.error('Error making leave request', error);
      }
    );



  }
}
