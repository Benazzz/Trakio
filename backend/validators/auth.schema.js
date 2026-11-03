import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  username: z.string().trim().min(2).max(50),
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});
