import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters long")
      .max(50, "First name must be at most 50 characters long")
      .trim(),
    email: z.string().email("Invalid email").toLowerCase().trim(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
  code: z.string().length(6, "Verification code must be 6 digits"),
});

export const resendVerificationSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email").toLowerCase().trim(),
    code: z.string().length(6, "Reset code must be 6 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
