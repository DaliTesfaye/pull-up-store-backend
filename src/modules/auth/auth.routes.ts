import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../utils/validators";
import { signUpSchema, loginSchema } from "./auth.validation";


const router = Router();

// Sign Up Route
router.post("/signup", validate(signUpSchema) , AuthController.signUp);
// Login Route
router.post("/login", validate(loginSchema) , AuthController.login);

export default router;