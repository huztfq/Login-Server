export interface IUser {
    userId: string;
    name: string;
    joiningDate: Date;
    designation: string;
    totalDaysPresent: number;
    totalDaysAbsent: number;
    ptoRemaining: number;
  }
  
  export interface IUsersResponse {
    success: boolean;
    data: IUser[];
  }
  
  export interface IUserResponse {
    success: boolean;
    data: IUser;
  }
  
  export interface ICreateUser {
    name: string;
    email: string;
    password: string;
    joiningDate: Date;
    designation: string;
    role: 'employee' | 'admin';
  }
  
  export interface ISubmitAttendance {
    userId: string;
    date: string;
    leaveType?: 'casual' | 'sick' | null;
    status?: "present" | "absent"
  }
  export interface ISubmitRequest{
    date: string;
    leaveType?: 'casual' | 'sick' | null;
    status?: "present" | "absent"
  }

  
  export interface ISubmitAttendanceResponse {
    success: boolean;
    data: {
      date: string;
      status: 'present' | 'absent';
      leaveType?: 'casual' | 'sick' | null;
    };
  }
  
export interface ILeaveRequest {
  _id: string;
  user: {
    _id: string;
    name: string;
    designation: string;
  };
  status: 'pending' | 'approved' | 'declined';
}
  
  export interface ILeaveRequestResponse {
    success: boolean;
    data: ILeaveRequest;
  }
  