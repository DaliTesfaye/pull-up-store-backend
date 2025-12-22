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
      if (error.message === "Invalid email or password") {
        res.status(400).json({ message: error.message });
        return ;
      }
      res.status(500).json({ message: "Server error" });
    }
  }
}
