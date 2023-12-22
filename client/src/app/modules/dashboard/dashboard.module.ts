import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddAttendaceComponent } from './pages/add-attendace/add-attendace.component';
import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { ViewPtoComponent } from './pages/view-pto/view-pto.component';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from '../auth/interceptors/auth.interceptor';
import { DashboardService } from './services/dashboard.service';
import { LoadingComponent } from '../layout/components/loading/loading.component';
import { AddRequestComponent } from './pages/make-request-and-request-details/add-request.component';
import { GetRequestComponent } from './pages/get-Request-and-approve/get-request.component';

@NgModule({
  imports: [
    DashboardRoutingModule,
    CommonModule,
    FormsModule,
    AuthModule,
    HttpClientModule,
    LoadingComponent,
    ReactiveFormsModule,
  ],
  declarations: [
    HomeComponent,
    AddAttendaceComponent,
    AddEmployeeComponent,
    ViewPtoComponent,
    AddRequestComponent,
    GetRequestComponent,
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
