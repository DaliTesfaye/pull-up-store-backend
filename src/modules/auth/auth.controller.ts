import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { SignUpDTO, LoginDTO } from "./auth.types";


export class AuthController {
  // Sign Up
  static async signUp(req: Request, res: Response): Promise<void> {
    try {
      const authService = new AuthService();
      const result = await authService.signUp(req.body);
      res.status(201).json(result);
    }

    catch (error : any) {
      if (error.message === "Email Already Registred") {
        res.status(400).json({ message: error.message });
        return ;
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  // Login
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const authService = new AuthService();
      const result = await authService.login(req.body);
      res.status(200).json(result);
    }
    catch (error : any) {
      if (error.message === "Invalid email or password" || error.message === "Please verify your email before logging in") {
        res.status(401).json({ message: error.message });
        return ;
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  // Verify Email
  static async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const authService = new AuthService();
      const result = await authService.verifyEmail(req.body);
      res.status(200).json(result);
    }
    catch (error : any) {
      if (error.message.includes("not found") || error.message.includes("Invalid") || error.message.includes("expired") || error.message.includes("already verified")) {
        res.status(400).json({ message: error.message });
        return ;
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  // Resend Verification
  static async resendVerification(req: Request, res: Response): Promise<void> {
    try {
      const authService = new AuthService();
      const result = await authService.resendVerification(req.body);
      res.status(200).json(result);
    }
    catch (error : any) {
      if (error.message.includes("not found") || error.message.includes("already verified")) {
        res.status(400).json({ message: error.message });
        return ;
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  // Forgot Password
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const authService = new AuthService();
      const result = await authService.forgotPassword(req.body);
      res.status(200).json(result);
    }
    catch (error : any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ message: error.message });
        return ;
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  // Reset Password
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const authService = new AuthService();
      const result = await authService.resetPassword(req.body);
      res.status(200).json(result);
    }
    catch (error : any) {
      if (error.message.includes("not found") || error.message.includes("Invalid") || error.message.includes("expired") || error.message.includes("No reset")) {
        res.status(400).json({ message: error.message });
        return ;
      }
      res.status(500).json({ message: "Server error" });
    }
  }
}
