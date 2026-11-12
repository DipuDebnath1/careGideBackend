import { z } from "zod";

// update user self profile 
export const updateUserSelfProfileValidationSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),
      interests: z.array(z.string()).optional(),
    })
    .strict(),
});

// Admin creates a user
export const adminCreateUserValidationSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(100),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      role: z.enum(["user", "admin"]).optional().default("user"),
      interests: z.array(z.string()).optional(),
    })
    .strict(),
});

// Admin updates a user
export const adminUpdateUserValidationSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),
      email: z.string().email("Invalid email address").optional(),
      role: z.enum(["user", "admin"]).optional(),
      interests: z.array(z.string()).optional(),
    })
    .strict(),
});
