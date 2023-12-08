import { Component } from '@angular/core';
import { IUser } from '../../models/user.model';

@Component({
  selector: 'app-add-attendace',
  templateUrl: './add-attendace.component.html',
  styleUrl: './add-attendace.component.scss'
})
export class AddAttendaceComponent {
  selectedDate: string = new Date().toISOString().split('T')[0];
  attendanceStatus: string = 'present';
  leaveType: string = 'casual';
  workLocation: string = 'onsite';

  public employee: IUser = {
    id: '213',
    name: 'Moiz',
    joiningDate: new Date(),
    totalDaysPresent: 50,
    totalDaysAbsent: 10,
    designation: 'Full Stack Developer',
    ptoRemaining: 5
  }

  onStatusChange() {
    // Reset leaveType when status changes to 'present'
    if (this.attendanceStatus === 'present') {
      this.leaveType = 'casual';
    }
  }
}
