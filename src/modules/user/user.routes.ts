import { Router } from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "../../middelwares/auth.middleware";

const router = Router();

// Protected routes - require authentication
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.delete("/profile", authMiddleware, userController.deleteProfile);

export default router;


