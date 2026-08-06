import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100),

  username: z.string().trim().min(3).max(50),

  email: z.string().trim().email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),

  password: z.string().min(1, "Password is required"),
});
export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});