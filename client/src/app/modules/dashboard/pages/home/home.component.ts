import { Component, OnInit } from '@angular/core';
import { IUser, IUsersResponse } from '../../models/user.model';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public users: IUser[] = []

  constructor(private router: Router, private dashboardService: DashboardService) {}


  ngOnInit(): void {
    this.dashboardService.getAllEmployees().subscribe((res: IUsersResponse) => {
      this.users = res.data;
    })
  }

  public addAttendance(id: string) {
    console.log(id);
    this.router.navigate([`dashboard/add-attendance/${id}`]);
  }
}
