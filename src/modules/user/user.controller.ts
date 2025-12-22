import { UserService } from "./user.service";
import { Response } from "express";
import { UpdateProfileDTO } from "./user.types";
import { AuthRequest } from "../../middelwares/auth.middleware";

export class userController {

  // GET Profile
  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId; // From JWT token

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
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
  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId; // From JWT token
      const updateData: UpdateProfileDTO = req.body;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
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
  static async deleteProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId; // From JWT token

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
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
