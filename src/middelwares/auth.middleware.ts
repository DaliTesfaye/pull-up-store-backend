import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

// Extend Express Request to include userId
export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyToken(token);

    // Attach userId to request
    req.userId = decoded.userId;

    next();
  } catch (error: any) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
