"use server";

import { z } from "zod";
import { apiRegister, apiLogin, apiWhoami, apiUpdateProfile } from "../api/auth";
import { setServerAuthCookies, getServerToken } from "../api/server-cookies";


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


export interface ActionResult {
    success: boolean;
    message?: string;
    data?: any;
    fieldErrors?: Record<string, string>;
}


export async function registerAction(input: RegisterInput): Promise<ActionResult> {
    const parsed = RegisterSchema.safeParse(input);
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.issues.forEach((i) => {
            const f = i.path[0] as string;
            if (!fieldErrors[f]) fieldErrors[f] = i.message;
        });
        return { success: false, fieldErrors };
    }
    try {
        await apiRegister(parsed.data);
        return { success: true, message: "Account created successfully" };
    } catch (err: unknown) {
        return { success: false, message: err instanceof Error ? err.message : "Registration failed" };
    }
}


export async function loginAction(input: LoginInput): Promise<ActionResult> {
    const parsed = LoginSchema.safeParse(input);
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.issues.forEach((i) => {
            const f = i.path[0] as string;
            if (!fieldErrors[f]) fieldErrors[f] = i.message;
        });
        return { success: false, fieldErrors };
    }
    try {
        const response = await apiLogin(parsed.data);
        const { user, token } = response.data;
        await setServerAuthCookies(token, user);
        return { success: true, data: { user, token } };
    } catch (err: unknown) {
        return { success: false, message: err instanceof Error ? err.message : "Login failed" };
    }
}


export async function whoamiAction(): Promise<ActionResult> {
    try {
        const token = await getServerToken();
        if (!token) return { success: false, message: "Not authenticated" };
        const response = await apiWhoami(token);
        return { success: true, data: response.data };
    } catch (err: unknown) {
        return { success: false, message: err instanceof Error ? err.message : "Failed to fetch user" };
    }
}


export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
    const token = await getServerToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const textFields = {
        firstName: formData.get("firstName") as string | undefined,
        lastName:  formData.get("lastName")  as string | undefined,
        email:     formData.get("email")     as string | undefined,
    };

    const parsed = UpdateProfileSchema.safeParse(textFields);
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.issues.forEach((i) => {
            const f = i.path[0] as string;
            if (!fieldErrors[f]) fieldErrors[f] = i.message;
        });
        return { success: false, fieldErrors };
    }

    try {
        const response = await apiUpdateProfile(token, formData);
        await setServerAuthCookies(token, response.data);
        return { success: true, data: response.data, message: "Profile updated successfully" };
    } catch (err: unknown) {
        return { success: false, message: err instanceof Error ? err.message : "Update failed" };
    }
}


export async function changePasswordAction(input: { password: string; confirmPassword: string }): Promise<ActionResult> {
    const token = await getServerToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const parsed = ChangePasswordSchema.safeParse(input);
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.issues.forEach((i) => {
            const f = i.path[0] as string;
            if (!fieldErrors[f]) fieldErrors[f] = i.message;
        });
        return { success: false, fieldErrors };
    }

    try {
        const formData = new FormData();
        formData.append("password", parsed.data.password);
        await apiUpdateProfile(token, formData);
        return { success: true, message: "Password changed successfully" };
    } catch (err: unknown) {
        return { success: false, message: err instanceof Error ? err.message : "Password change failed" };
    }
}
