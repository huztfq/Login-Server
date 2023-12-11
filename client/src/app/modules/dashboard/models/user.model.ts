export interface IUser {
    id: string,
    name: string,
    joiningDate: Date,
    designation: string,
    totalDaysPresent: Number,
    totalDaysAbsent: Number,
    ptoRemaining: Number,
}

export interface ICreateUser {
    id?: string,
    name: string,
    email: string,
    password: string,
    joiningDate: Date,
    designation: string,
    role: 'employee' | 'admin',
}