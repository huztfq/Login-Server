import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateUser, ILeaveRequest, ISubmitAttendance, IUserResponse, IUsersResponse } from '../models/user.model';
import { APIURL } from 'src/app/core/constants/api';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  declineLeaveRequest(leaveId: string) {
    throw new Error('Method not implemented.');
  }

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

  public getLeaveRequest(id?: string): Observable<ILeaveRequest> {
    const url = id ? APIURL + `leave/getleave/${id}` : APIURL + 'leave/getleave'; // Use a different URL for requests with and without id
    return this.http.get<ILeaveRequest>(url);
  }

  public makeLeaveRequest(userId: string, data: any) {
    return this.http.post(APIURL + `leave/createLeave/${userId}`, data);
  }

  public approveLeaveRequest(leaveID: string, state: 'approved' | 'rejected', name: string, userid: string) {
    const requestBody = { leaveID, state, name, userid };
  
    return this.http.post(`${APIURL}leave/approveLeaveRequestByAdmin`, requestBody);
  }

  getLeaveRequestById() {
    return this.http.get(APIURL + `leave/leaveRequestsForAdmin`);
  }
  
  getLeaveDetailsById(userId: string) {
    return this.http.get(APIURL + `leave/leaveRequests/${userId}`);
  }

  getEmployeeDetailsById(userId: string) {
    return this.http.get(APIURL + `user/fetchEmployeeDetails/${userId}`);
  }

  updateEmployeeDetailsById(userId: string, data: any) {
    return this.http.post(APIURL + `user/updateEmployeeDetails/${userId}`, data);
  }

  deleteEmployeeById(userId: string) {
    return this.http.post(APIURL + `user/deleteEmployee/${userId}`, {});
  }

}
