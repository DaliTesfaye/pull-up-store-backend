import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

// Sign Up Route
router.post("/signup", AuthController.signUp);
// Login Route
router.post("/login", AuthController.login);

export default router;