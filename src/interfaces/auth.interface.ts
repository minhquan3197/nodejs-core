export interface IAuthLogin {
    username: string;
    password: string;
}

export interface IAuthRegister {
    name: string;
    username: string;
    password: string;
    password_confirmation: string;
}

export interface IChangePassword {
    username: string;
    password: string;
    old_password: string;
    password_confirmation: string;
}
