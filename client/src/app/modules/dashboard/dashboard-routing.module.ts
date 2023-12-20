import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { AddAttendaceComponent } from './pages/add-attendace/add-attendace.component';
import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { ViewPtoComponent } from './pages/view-pto/view-pto.component';
import { AddRequestComponent } from './pages/make-request-and-request-details/add-request.component';
import { ApproveAttendanceComponent } from './pages/get-Request-and-approve/get-request.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: ['admin'] }},
      { path: 'add-attendance/:id', component: AddAttendaceComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
      { path: 'add-employee', component: AddEmployeeComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
      { path: 'view-pto', component: ViewPtoComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'employee'] }},
      { path: 'view-requests', component: AddRequestComponent, canActivate: [AuthGuard], data: { roles: ['admin'] }},
      { path: 'request', component: ApproveAttendanceComponent, canActivate: [AuthGuard], data: { roles: ['employee'] }},

      { path: '**', redirectTo: 'error/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
