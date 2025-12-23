import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../utils/validators";
import { signUpSchema, loginSchema, verifyEmailSchema, resendVerificationSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.validation";


const router = Router();

// Sign Up Route
router.post("/signup", validate(signUpSchema), AuthController.signUp);
// Login Route
router.post("/login", validate(loginSchema), AuthController.login);
// Verify Email Route
router.post("/verify-email", validate(verifyEmailSchema), AuthController.verifyEmail);
// Resend Verification Route
router.post("/resend-verification", validate(resendVerificationSchema), AuthController.resendVerification);
// Forgot Password Route
router.post("/forgot-password", validate(forgotPasswordSchema), AuthController.forgotPassword);
// Reset Password Route
router.post("/reset-password", validate(resetPasswordSchema), AuthController.resetPassword);

export default router;