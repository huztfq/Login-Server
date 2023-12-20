import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ISubmitAttendance, ISubmitAttendanceResponse } from '../../models/user.model';

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
    this.dashboardService.submitAttendance(this.attendance, this.id).subscribe(
      () => {
        
      },
      (error: any) => {
        console.error('Error submitting attendance', error);
      }
    );
  }
}
