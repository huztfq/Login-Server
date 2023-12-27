import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  // Add this line
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from '../auth/interceptors/auth.interceptor';
import { DashboardService } from './services/dashboard.service';
import { LoadingComponent } from '../layout/components/loading/loading.component';

import { AddAttendanceComponent } from './pages/add-attendace/add-attendace.component';
import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { ViewPtoComponent } from './pages/view-pto/view-pto.component';
import { AddRequestComponent } from './pages/make-request-and-request-details/add-request.component';
import { GetRequestComponent } from './pages/get-Request-and-approve/get-request.component';
import { HomeComponent } from './pages/home/home.component';
import { GetRequestHistoryComponent } from './pages/request-history/request-history.component';
import { EditEmployeeComponent } from './pages/edit-employee/edit-employee.component';
@NgModule({
  imports: [
    DashboardRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  
    RouterModule,        
    AuthModule,
    HttpClientModule,
    LoadingComponent
  ],
  declarations: [
    HomeComponent,
    AddAttendanceComponent,
    AddEmployeeComponent,
    ViewPtoComponent,
    AddRequestComponent,
    GetRequestComponent,
    GetRequestHistoryComponent,
    EditEmployeeComponent,
  ],
  providers: [
    AuthService,
    DashboardService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class DashboardModule {}
