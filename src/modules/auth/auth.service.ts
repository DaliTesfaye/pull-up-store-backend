import bcrypt from "bcrypt";
import { SignUpInput, LoginInput } from "./auth.validation";
import { hashPassword, comparePassword } from "../../utils/password";
import { generateToken } from "../../utils/jwt";
import { UserModel } from "../user/user.model";
import { SignUpDTO, LoginDTO, AuthResponse } from "./auth.types";

export class AuthService {
  // Sign Up
  async signUp(data: SignUpInput): Promise<AuthResponse> {
    const { firstName, email, password, confirmPassword } = data;

    //Check If user already Exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error("Email Already Registred");
    }

    //Hash Password
    const hashedPassword = await hashPassword(password);
    const hashedConfirmPassword = await hashPassword(confirmPassword);

    //Create User
    const newUser = await UserModel.create({
      firstName,
      email,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
      accountStatus: "UNVERIFIED",
    });

    // Generate JWT token
    const token = generateToken(newUser._id.toString());

    return {
      message: "Sign Up Successful",
      user: {
        id: newUser._id.toString(),
        firstName: newUser.firstName || "",
        lastName: newUser.lastName,
        email: newUser.email,
        accountStatus: newUser.accountStatus,
      },
      token,
    };
  }

  // Login
  async login(data: LoginInput): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user with password
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString());

    return {
      message: "Login successful",
      user: {
        id: user._id.toString(),
        firstName: user.firstName || "",
        lastName: user.lastName,
        email: user.email,
        accountStatus: user.accountStatus,
      },
      token,
    };
  }
}
