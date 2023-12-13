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

export interface ISubmitAttendance {
    date: string,
    status: 'present' | 'absent',
    leaveType?: 'casual' | 'sick' | null,
    workLocation?: 'remote' | 'onsite' | null
}