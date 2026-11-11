
import { z } from "zod";

export const registerValidationSchema = z.object({
 body : z.object({
   name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
 }).strict()
});

export const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }).strict()
});

// Forgot password 
export const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
  }).strict(),
});

// Verify OTP
export const verifyOtpValidationSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
  }).strict(),
});

// Reset password (after OTP verified)
export const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .strict()
});

// Update password (authenticated user)
export const updatePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
  })
  .strict()
});
