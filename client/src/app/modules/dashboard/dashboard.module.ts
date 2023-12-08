import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AddAttendaceComponent } from './pages/add-attendace/add-attendace.component';

@NgModule({
  imports: [DashboardRoutingModule, CommonModule, FormsModule],
  declarations: [HomeComponent, AddAttendaceComponent]
})
export class DashboardModule {}
