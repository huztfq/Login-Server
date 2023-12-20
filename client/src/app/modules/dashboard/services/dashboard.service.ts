import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateUser, ISubmitAttendance, IUserResponse, IUsersResponse } from '../models/user.model';
import { APIURL } from 'src/app/core/constants/api';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  getEmployeeDetails: any;
  getLeaveDetails: any;
  approveLeave: any;
  declineLeave: any;

  constructor(private http: HttpClient) { }

  public getAllEmployees(): Observable<IUsersResponse>{
    return this.http.get<IUsersResponse>(APIURL + 'attendance/allatt');
  }

  public getSingleEmployee(id: string): Observable<IUserResponse>{
    return this.http.get<IUserResponse>(APIURL + `attendance/getatt/${id}`);
  }

  public submitAttendance(data: ISubmitAttendance, id: string){
    return this.http.post(APIURL + `attendance/createatt/${id}`, data);
  }

  public createEmployee(data: ICreateUser){
    return this.http.post(APIURL + `user/signup`, data);
  }

  public getLeaveRequest(id: string){
    return this.http.get(APIURL + `leave/getleave/${id}`);
  }

  public makeLeaveRequest(data: any){
    return this.http.post(APIURL + `leave/createleave`, data);
  } 

  public approveLeaveRequest(id: string){
    return this.http.get(APIURL + `leave/approveLeaveRequestByAdmin/${id}`);
  }

  getLeaveRequestById(id: string) {
    return this.http.get(APIURL + `leave/leaveRequestsForAdmin//${id}`);
  }
  getLeaveDetailsById(id: string) {
    return this.http.get(APIURL + `leave/leaveRequests/${id}`);
  }

}
