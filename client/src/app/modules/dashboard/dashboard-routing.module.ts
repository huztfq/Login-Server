import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { AddAttendanceComponent } from './pages/add-attendace/add-attendace.component';
import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { ViewPtoComponent } from './pages/view-pto/view-pto.component';
import { AddRequestComponent } from './pages/make-request-and-request-details/add-request.component';
import { GetRequestComponent } from './pages/get-Request-and-approve/get-request.component';
import { GetRequestHistoryComponent } from './pages/request-history/request-history.component';
import { EditEmployeeComponent } from './pages/edit-employee/edit-employee.component';
import { ChangeCredentialsComponent } from './pages/change-credentials/change-credentials.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: ['admin'] }},
      { path: 'add-attendance', component: AddAttendanceComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
      { path: 'add-employee', component: AddEmployeeComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
      { path: 'view-pto', component: ViewPtoComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'employee'] }},
      { path: 'view-requests', component: GetRequestComponent, canActivate: [AuthGuard], data: { roles: ['admin'] }},
      { path: 'request', component: AddRequestComponent, canActivate: [AuthGuard], data: { roles: ['employee'] }},
      { path: 'view-history', component: GetRequestHistoryComponent, canActivate: [AuthGuard], data: { roles: ['admin'] }},
      { path: 'edit-employee', component: EditEmployeeComponent, canActivate: [AuthGuard], data: { roles: ['admin'] }},
      { path: 'edit-profile', component: ChangeCredentialsComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'employee'] }},
      { path: '**', redirectTo: 'error/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
