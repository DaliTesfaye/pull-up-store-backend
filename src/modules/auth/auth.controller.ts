import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { SignUpDTO, LoginDTO } from "./auth.types";

export class AuthController {
  // Sign Up
  static async signUp(req: Request, res: Response): Promise<void> {
    try {
        const {firstName , email , password , confirmPassword}: SignUpDTO = req.body ;
        //Basic Validation
        if (!firstName || !email || !password || !confirmPassword) {
            res.status(400).json({message : "All Fields are Required"});
            return ;
        }

        if (password !== confirmPassword) {
            res.status(400).json({message : "Please Check Your Password"});
            return ;
        }

        const authService = new AuthService();
        const result = await authService.signUp(req.body);
        res.status(201).json(result);
    }
    catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // Login
  static async login(req: Request, res: Response): Promise<void> {
    try {
        const {email , password} : LoginDTO = req.body ;

        //Basic Validation
        if (!email || !password) {
            res.status(400).json({message : "All Fields are Required"});
            return ;
        }

        const authService = new AuthService();
        const result = await authService.login(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
  }
}

}
