import { z } from "zod";

export const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName:  z.string().min(1, "Last name is required"),
  email:     z.string().email("Please enter a valid email address"),
  password:  z.string()
    .min(6,   "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

export const LoginSchema = z.object({
  email:    z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName:  z.string().min(1, "Last name is required").optional(),
  email:     z.string().email("Invalid email").optional(),
});

export const ChangePasswordSchema = z.object({
  password:        z.string()
    .min(6,   "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterInput       = z.infer<typeof RegisterSchema>;
export type LoginInput          = z.infer<typeof LoginSchema>;
export type UpdateProfileInput  = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;