import bcrypt from "bcrypt";
import { UserModel } from "../user/user.model";
import { SignUpDTO, LoginDTO, AuthResponse } from "./auth.types";

export class AuthService {
  private readonly saltRounds = 10;

  // Sign Up
async signUp (data: SignUpDTO): Promise<AuthResponse> {
    const {firstName , email , password , confirmPassword} = data ;

    //Check Confirm Password
    if (password !== confirmPassword) {
        throw new Error("Please Check Your Password")
    }

    //Check If user already Exists
    const existingUser = await UserModel.findOne({email});
    if (existingUser) {
        throw new Error("Email Already Registred")
    }

    //Hash Password
    const hashedPassword = await bcrypt.hash(password , this.saltRounds) ;
    const hashedConfirmPassword = await bcrypt.hash(confirmPassword , this.saltRounds) ;

    //Create User
    const newUser = await UserModel.create({
        firstName,
        email,
        password : hashedPassword,
        confirmPassword : hashedConfirmPassword,
        accountStatus : "UNVERIFIED"
    });

    return{
        message : "Sign Up Successful" ,
        user : {
            id : newUser._id.toString() ,
            firstName : newUser.firstName || "" ,
            lastName : newUser.lastName ,
            email : newUser.email ,
            accountStatus : newUser.accountStatus ,
        }
    }
  }


  // Login
  async login(data: LoginDTO): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user with password
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return {
      message: "Login successful",
      user: {
        id: user._id.toString(),
        firstName: user.firstName || "",
        lastName: user.lastName,
        email: user.email,
        accountStatus: user.accountStatus,
      },
    };
  }
}