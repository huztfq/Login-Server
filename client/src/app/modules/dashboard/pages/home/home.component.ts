import { Component, OnInit } from '@angular/core';
import { IUser } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public users: IUser[] = [
    {
      id: '213',
      name: 'Inam',
      joiningDate: new Date(),
      totalDaysPresent: 52,
      totalDaysAbsent: 16,
      designation: 'Full Stack Developer',
      ptoRemaining: 2
    },
    {
      id: '213',
      name: 'Ghazan',
      joiningDate: new Date(),
      totalDaysPresent: 37,
      totalDaysAbsent: 60,
      designation: 'Full Stack Developer',
      ptoRemaining: 5
    },
    {
      id: '213',
      name: 'Hamza',
      joiningDate: new Date(),
      totalDaysPresent: 90,
      totalDaysAbsent: 70,
      designation: 'Full Stack Developer',
      ptoRemaining: 9
    },
    {
      id: '213',
      name: 'Huzaifa',
      joiningDate: new Date(),
      totalDaysPresent: 50,
      totalDaysAbsent: 10,
      designation: 'Full Stack Developer',
      ptoRemaining: 5
    },
    {
      id: '213',
      name: 'Ammar',
      joiningDate: new Date(),
      totalDaysPresent: 90,
      totalDaysAbsent: 10,
      designation: 'Full Stack Developer',
      ptoRemaining: 5
    },
    {
      id: '213',
      name: 'Moiz',
      joiningDate: new Date(),
      totalDaysPresent: 50,
      totalDaysAbsent: 10,
      designation: 'Full Stack Developer',
      ptoRemaining: 5
    },
  ]

  constructor(private router: Router) {}


  ngOnInit(): void {}

  public addAttendance(id: string) {
    console.log(id);
    this.router.navigate([`dashboard/add-attendance/${id}`]);
  }
}
