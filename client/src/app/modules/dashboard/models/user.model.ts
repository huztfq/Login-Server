export interface IUser {
  _id: string;
  name: string;
  joiningDate: Date;
  designation: string;
  daysPresent: number;
  daysAbsent: number;
  halfDays: number;
  paidOff: number;
  probationEndDate: Date;
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
  leaveType?: 'casual' | 'sick' |  null;
  status?: "present" | "absent" | "halfday" | "PTO" | null;
}
export interface ISubmitRequest{
  startDate: string;
  endDate: string;
  leaveType?: 'casual' | 'sick' | "halfday" | "PTO" | null;
  status?: "present" | "absent" | "halfday";
  message?: string;
}

export interface ISubmitAttendanceResponse {
  success: boolean;
  data: {
    date: string;
    status: 'present' | 'absent' | 'halfday';
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
status: 'pending' | 'approved' | 'rejected';
startDate: string;
leaveType: 'casual' | 'sick' | null;
message: string;
approvedby: string;
}

export interface ILeaveRequestResponse {
  success: boolean;
  data: ILeaveRequest;
}
