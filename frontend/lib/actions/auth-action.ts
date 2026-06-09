import { z } from "zod";
import { apiRegister, apiLogin } from "../api/auth";
import { setAuthCookies } from "../api/cookies";

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

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput    = z.infer<typeof LoginSchema>;

export interface ActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  const parsed = RegisterSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    });
    return { success: false, fieldErrors };
  }

  try {
    await apiRegister(parsed.data);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return { success: false, error: message };
  }
}

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = LoginSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    });
    return { success: false, fieldErrors };
  }

  try {
    const response = await apiLogin(parsed.data);
    const data = response.data as { user: object; token: string };
    if (data.token && data.user) {
      setAuthCookies(data.token, data.user);
    }
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    return { success: false, error: message };
  }
}