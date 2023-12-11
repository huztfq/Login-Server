import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AddAttendaceComponent } from './pages/add-attendace/add-attendace.component';
import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { ViewPtoComponent } from './pages/view-pto/view-pto.component';

@NgModule({
  imports: [DashboardRoutingModule, CommonModule, FormsModule],
  declarations: [HomeComponent, AddAttendaceComponent, AddEmployeeComponent, ViewPtoComponent]
})
export class DashboardModule {}
