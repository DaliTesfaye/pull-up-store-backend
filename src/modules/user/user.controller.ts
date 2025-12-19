import { UserService } from "./user.service";
import { Request, Response } from "express";
import { UpdateProfileDTO } from "./user.types";

export class userController {

  // GET Profile
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.params as any).userId || (req.query as any).userId || (req.body as any).userId;

      if (!userId) {
        res.status(400).json({ message: "userId is required" });
        return;
      }

      const userService = new UserService();
      const user = await userService.getUserById(userId);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // UPDATE Profile
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.params as any).userId || (req.query as any).userId || (req.body as any).userId;
      const updateData: UpdateProfileDTO = req.body as any;

      if (!userId) {
        res.status(400).json({ message: "userId is required" });
        return;
      }

      const userService = new UserService();
      const updatedUser = await userService.updateUserProfile(userId, updateData);

      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // DELETE Profile
  static async deleteProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.params as any).userId || (req.query as any).userId || (req.body as any).userId;

      if (!userId) {
        res.status(400).json({ message: "userId is required" });
        return;
      }

      const userService = new UserService();
      const deletedUser = await userService.deleteUser(userId);

      if (!deletedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
}
