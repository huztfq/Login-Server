import { Component } from '@angular/core';
import { ISubmitAttendanceResponse, IUser, IUserResponse } from '../../models/user.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-add-attendace',
  templateUrl: './add-attendace.component.html',
  styleUrl: './add-attendace.component.scss'
})
export class AddAttendaceComponent {
  selectedDate: string = new Date().toISOString().split('T')[0];
  attendanceStatus: 'present' | 'absent' = 'present';
  leaveType: 'casual' | 'sick' | null = null;
  workLocation: 'remote' | 'onsite' | null = null;
  private id: string = ''

  public declare employee: IUser;

  constructor(private route: ActivatedRoute, private router:Router, private dashboardService: DashboardService){}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.dashboardService.getSingleEmployee(this.id).subscribe((res: IUserResponse) => {
      this.employee = res.data;
    })
  }

  onStatusChange() {
    // Reset leaveType when status changes to 'present'
    if (this.attendanceStatus === 'present') {
      this.leaveType = 'casual';
    }
  }

  public submitAttendance() {
    const attendace: ISubmitAttendanceResponse = {
      date: this.selectedDate,
      status: this.attendanceStatus,
      leaveType: this.leaveType,
      workLocation: this.workLocation
    }

    this.dashboardService.submitAttendance(attendace, this.id).subscribe((res) => {
      this.router.navigate(['dashboard/home'])
    })
  }
}
