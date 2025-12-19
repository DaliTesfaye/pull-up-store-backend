import { Router } from "express";

import { userController } from "./user.controller";

const router = Router();

// Get User Profile
router.get("/profile", userController.getProfile);
router.get("/profile/:userId", userController.getProfile);
// Update User Profile
router.put("/profile", userController.updateProfile);
router.put("/profile/:userId", userController.updateProfile);
// Delete User Profile
router.delete("/profile", userController.deleteProfile);
router.delete("/profile/:userId", userController.deleteProfile);

export default router;


