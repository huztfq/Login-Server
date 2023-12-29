// Import necessary modules
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ISubmitRequest } from '../../models/user.model';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.scss']
})
export class AddRequestComponent implements OnInit {
  private userId: string = '';
  leaveDetails: any;
  selectedDate: string = new Date().toISOString().split('T')[0];
  leaveRequest: { date: string, leaveType: 'casual' | 'sick', message: string } = { date: '', leaveType: 'casual', message: '' };
  showLeaveRequestForm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId') || '';
      this.getLeaveDetails();
    });
  }

  getLeaveDetails() {
    const userId = this.authService.getUserData()?.userId;
    this.dashboardService.getLeaveDetailsById(userId ?? "").subscribe(
      (response: any) => {
        this.leaveDetails = response;
      },
      (error) => {
        console.error('Error fetching leave details', error);
      }
    );
  }

  makeLeaveRequest() {
    this.showLeaveRequestForm = true;
  }

  submitLeaveRequest() {
    this.leaveRequest.date = this.selectedDate;
  
    const data: ISubmitRequest = {
      startDate: this.leaveRequest.date,
      leaveType: this.leaveRequest.leaveType,
      message: this.leaveRequest.message,
    };
    
    console.log(data);
  
    this.dashboardService.makeLeaveRequest(this.authService.getUserData()?.userId ?? '', data).subscribe(
      (response: any) => {
        this.showLeaveRequestForm = false;
        this.getLeaveDetails();
      },
      (error) => {
        console.error('Error making leave request', error);
      }
    );
  }
  
  toggleLeaveRequestForm() {
    this.showLeaveRequestForm = !this.showLeaveRequestForm;
  }
}
