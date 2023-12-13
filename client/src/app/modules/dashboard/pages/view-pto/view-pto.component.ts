import { Component } from '@angular/core';
import { IUser, IUserResponse } from '../../models/user.model';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-view-pto',
  templateUrl: './view-pto.component.html',
  styleUrl: './view-pto.component.scss'
})
export class ViewPtoComponent {
  public declare employeeData: IUser;

  constructor(private dashboardService: DashboardService, private authService: AuthService) {}

  ngOnInit() {
    this.dashboardService.getSingleEmployee(this.authService.getUserData()?.userId!).subscribe((res: IUserResponse) => {
      this.employeeData = res.data;
    })
  }

}
