export interface SignUpDTO {
    firstName: string;
    email : string;
    password: string;
    confirmPassword: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface AuthResponse {
    message : string ;
    user : {
        id : string ;
        firstName : string ;
        lastName? : string ;
        email : string ;
        accountStatus : string;
    };
    token: string;
}