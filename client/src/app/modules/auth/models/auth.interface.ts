export interface ILogin {
    email: string,
    password: string
}

export interface ILoginResponse {
    userId: string,
    token: string,
    role: 'admin' | 'employee'
}