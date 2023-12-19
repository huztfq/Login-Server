export interface IUser {
    userId: string,
    name: string,
    joiningDate: Date,
    designation: string,
    totalDaysPresent: Number,
    totalDaysAbsent: Number,
    ptoRemaining: Number,
}

export interface IUsersResponse {
   success: boolean,
   data: IUser[]
}

export interface IUserResponse {
    success: boolean,
    data: IUser
 }

export interface ICreateUser {
    name: string,
    email: string,
    password: string,
    joiningDate: Date,
    designation: string,
    role: 'employee' | 'admin',
}
export interface ISubmitAttendanceResponse {
    success: boolean,
    data: {
        date: string,
        status: 'present' | 'absent',
        leaveType?: 'casual' | 'sick' | null
    }
}

export interface ILeaveRequest {
    date: string,
    leaveType: 'casual' | 'sick',
    status: 'pending' | 'approved' | 'declined'
}

export interface ILeaveRequestResponse {
    success: boolean,
    data: ILeaveRequest
}