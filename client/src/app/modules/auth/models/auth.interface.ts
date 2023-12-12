export interface ILogin {
    email: string,
    password: string
}

export interface ILoginResponse {
    token: string,
    role: 'admin' | 'employee'
}