import { Component } from '@angular/core';
import { IUser } from '../../models/user.model';

@Component({
  selector: 'app-view-pto',
  templateUrl: './view-pto.component.html',
  styleUrl: './view-pto.component.scss'
})
export class ViewPtoComponent {
  public employeeData: IUser = {
    id: '0',
    name: 'Inamullah Khan',
    joiningDate: new Date('2023-01-01'),
    designation: 'Software Engineer',
    ptoRemaining: 10,
    totalDaysPresent: 50,
    totalDaysAbsent: 10
  };

}
