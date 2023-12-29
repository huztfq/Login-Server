import { Component, OnInit } from '@angular/core';
import { ISubmitAttendance, IUser, IUsersResponse } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-add-attendance',
  templateUrl: './add-attendace.component.html',
  styleUrls: ['./add-attendace.component.scss']
})
export class AddAttendanceComponent implements OnInit {
  selectedDate: string = new Date().toISOString().split('T')[0];
  attendanceStatus: 'present' | 'absent' | 'halfday' | 'PTO'= 'present';
  leaveType: 'casual' | 'sick' | null = null; 
  workLocation: 'remote' | 'onsite' | null = null;
  selectedEmployeeId: string = '';
  employees: IUser[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  private fetchEmployees() {
    this.dashboardService.getAllEmployees().subscribe(
      (res: IUsersResponse) => {
        this.zone.run(() => {
          this.employees = res.data;
        });
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  onStatusChange() {
    if (this.attendanceStatus === 'present') {
      this.leaveType = 'casual';
    }
  }

  submitAttendance() {
    let data: ISubmitAttendance;
  
    if (this.attendanceStatus === 'PTO' || this.attendanceStatus === 'halfday') {
      data = {
        userId: this.selectedEmployeeId,
        date: this.selectedDate,
        status: this.attendanceStatus as 'PTO' | 'halfday',
      };
    } else {
      data = {
        userId: this.selectedEmployeeId,
        date: this.selectedDate,
        leaveType: this.leaveType,
        status: this.attendanceStatus as 'present' | 'absent' | 'halfday' | null,
      };
    }
  
    this.dashboardService.submitAttendance(data, this.selectedEmployeeId).subscribe(
      (res) => {
        this.router.navigate(['dashboard/home']);
      },
      (error) => {
        console.error('Error submitting attendance:', error);
      }
    );
  }
}
