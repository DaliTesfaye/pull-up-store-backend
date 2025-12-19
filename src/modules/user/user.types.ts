export interface UpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
}

export interface signUpDTO {
  firstName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
