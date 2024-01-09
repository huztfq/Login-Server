import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateUser, ILeaveRequest, ISubmitAttendance, IUserResponse, IUsersResponse } from '../models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  declineLeaveRequest(leaveId: string) {
    throw new Error('Method not implemented.');
  }

  private APIURL: string | undefined;
  getEmployeeDetails: any;
  getLeaveDetails: any;
  approveLeave: any;
  declineLeave: any;

  constructor(private http: HttpClient) {
    this.APIURL = environment.apiUrl;
  }

  public getAllEmployees(): Observable<IUsersResponse>{
    return this.http.get<IUsersResponse>(this.APIURL + 'attendance/allatt');
  }

  public getSingleEmployee(id: string): Observable<IUserResponse>{
    return this.http.get<IUserResponse>(this.APIURL + `attendance/getatt/${id}`);
  }

  public submitAttendance(data: ISubmitAttendance, id: string){
    return this.http.post(this.APIURL + `attendance/createatt/${id}`, data);
  }

  public createEmployee(data: ICreateUser){
    return this.http.post(this.APIURL + `user/signup`, data);
  }

  public getLeaveRequest(id?: string): Observable<ILeaveRequest> {
    const url = id ? this.APIURL + `leave/getleave/${id}` : this.APIURL + 'leave/getleave'; // Use a different URL for requests with and without id
    return this.http.get<ILeaveRequest>(url);
  }

  public makeLeaveRequest(userId: string, data: any) {
    return this.http.post(this.APIURL + `leave/createLeave/${userId}`, data);
  }

  public approveLeaveRequest(leaveID: string, state: 'approved' | 'rejected', name: string, userid: string) {
    const requestBody = { leaveID, state, name, userid };
  
    return this.http.post(`${this.APIURL}leave/approveLeaveRequestByAdmin`, requestBody);
  }

  getLeaveRequestById() {
    return this.http.get(this.APIURL + `leave/leaveRequestsForAdmin`);
  }
  
  getLeaveDetailsById(userId: string) {
    return this.http.get(this.APIURL + `leave/leaveRequests/${userId}`);
  }

  getEmployeeDetailsById(userId: string) {
    return this.http.get(this.APIURL + `user/fetchEmployeeDetails/${userId}`);
  }

  updateEmployeeDetailsById(userId: string, data: any) {
    return this.http.post(this.APIURL + `user/updateEmployeeDetails/${userId}`, data);
  }

  deleteEmployeeById(userId: string) {
    return this.http.post(this.APIURL + `user/deleteEmployee/${userId}`, {});
  }

}
