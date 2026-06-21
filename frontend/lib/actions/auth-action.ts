"use server";

import { apiRegister, apiLogin, apiWhoami, apiUpdateProfile } from "../api/auth";
import { setServerAuthCookies, getServerToken } from "../api/server-cookies";
import {
  RegisterSchema,
  LoginSchema,
  UpdateProfileSchema,
  ChangePasswordSchema,
  RegisterInput,
  LoginInput,
} from "../validations/auth-schemas";

// Re-export types so existing imports from auth-action still work
export type {
  RegisterInput,
  LoginInput,
} from "../validations/auth-schemas";

export interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
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

export async function changePasswordAction(
  input: { password: string; confirmPassword: string }
): Promise<ActionResult> {
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