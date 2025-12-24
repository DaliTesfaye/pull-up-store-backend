import bcrypt from "bcrypt";
import {
  SignUpInput,
  LoginInput,
  VerifyEmailInput,
  ResendVerificationInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./auth.validation";
import { hashPassword, comparePassword } from "../../utils/password";
import { generateToken } from "../../utils/jwt";
import { generateVerificationCode, getTokenExpiry } from "../../utils/token";
import { sendVerificationEmail, sendPasswordResetEmail } from "../../utils/email";
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

    // Generate verification code and expiry
    const verificationCode = generateVerificationCode();
    const tokenExpiry = getTokenExpiry();

    //Create User
    const newUser = await UserModel.create({
      firstName,
      email,
      password: hashedPassword,
      accountStatus: "UNVERIFIED",
      verificationToken: verificationCode,
      verificationTokenExpiry: tokenExpiry,
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, firstName, verificationCode);
    } catch (error) {
      // Log error but don't fail signup
      console.error("Failed to send verification email:", error);
    }

    return {
      message:
        "Sign up successful! Please check your email for verification code.",
      user: {
        id: newUser._id.toString(),
        firstName: newUser.firstName || "",
        lastName: newUser.lastName,
        email: newUser.email,
        accountStatus: newUser.accountStatus,
      },
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

    // Check if email is verified
    if (user.accountStatus !== "VERIFIED") {
      throw new Error("Please verify your email before logging in");
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

  // Verify Email
  async verifyEmail(data: VerifyEmailInput): Promise<{ message: string }> {
    const { email, code } = data;

    // Find user with verification token
    const user = await UserModel.findOne({ email }).select("+verificationToken +verificationTokenExpiry");
    if (!user) {
      throw new Error("User not found");
    }

    // Check if already verified
    if (user.accountStatus === "VERIFIED") {
      throw new Error("Email already verified");
    }

    // Check if token exists
    if (!user.verificationToken) {
      throw new Error("No verification code found. Please request a new one.");
    }

    // Check if token matches
    if (user.verificationToken !== code) {
      throw new Error("Invalid verification code");
    }

    // Check if token expired
    if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
      throw new Error("Verification code expired. Please request a new one.");
    }

    // Update user status
    user.accountStatus = "VERIFIED";
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return {
      message: "Email verified successfully! You can now login.",
    };
  }

  // Resend Verification Email
  async resendVerification(data: ResendVerificationInput): Promise<{ message: string }> {
    const { email } = data;

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Check if already verified
    if (user.accountStatus === "VERIFIED") {
      throw new Error("Email already verified");
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const tokenExpiry = getTokenExpiry();

    // Update user with new token
    user.verificationToken = verificationCode;
    user.verificationTokenExpiry = tokenExpiry;
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, user.firstName || "User", verificationCode);

    return {
      message: "Verification code sent! Please check your email.",
    };
  }

  // Forgot Password
  async forgotPassword(data: ForgotPasswordInput): Promise<{ message: string }> {
    const { email } = data;

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Generate reset code
    const resetCode = generateVerificationCode();
    const tokenExpiry = getTokenExpiry();

    // Update user with reset token
    user.resetPasswordToken = resetCode;
    user.resetPasswordTokenExpiry = tokenExpiry;
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(email, user.firstName || "User", resetCode);

    return {
      message: "Password reset code sent! Please check your email.",
    };
  }

  // Reset Password
  async resetPassword(data: ResetPasswordInput): Promise<{ message: string }> {
    const { email, code, newPassword } = data;

    // Find user with reset token
    const user = await UserModel.findOne({ email }).select("+resetPasswordToken +resetPasswordTokenExpiry +password");
    if (!user) {
      throw new Error("User not found");
    }

    // Check if token exists
    if (!user.resetPasswordToken) {
      throw new Error("No reset code found. Please request a new one.");
    }

    // Check if token matches
    if (user.resetPasswordToken !== code) {
      throw new Error("Invalid reset code");
    }

    // Check if token expired
    if (user.resetPasswordTokenExpiry && user.resetPasswordTokenExpiry < new Date()) {
      throw new Error("Reset code expired. Please request a new one.");
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    const hashedConfirmPassword = await hashPassword(newPassword);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.confirmPassword = hashedConfirmPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    return {
      message: "Password reset successful! You can now login with your new password.",
    };
  }
}
