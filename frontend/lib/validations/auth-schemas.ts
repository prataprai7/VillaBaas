import { z } from "zod";

export const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName:  z.string().min(1, "Last name is required"),
  email:     z.string().email("Invalid email address"),
  password:  z.string()
    .min(6, "Minimum 6 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

export const LoginSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName:  z.string().min(1, "Last name is required").optional(),
  email:     z.string().email("Invalid email").optional(),
});

export const ChangePasswordSchema = z.object({
  password:        z.string().min(6, "Min 6 characters").regex(/[A-Z]/, "Need uppercase").regex(/[0-9]/, "Need number"),
  confirmPassword: z.string().min(1, "Required"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput    = z.infer<typeof LoginSchema>;