import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Please provide a valid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(32, "Password cannot exceed 32 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Please provide a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "refreshToken is required"),
  }),
});