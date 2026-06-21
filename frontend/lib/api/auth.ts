import { AUTH_ENDPOINTS } from "./endpoints";

export interface AuthUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profileImage?: string;
    createdAt: string;
}

export interface ApiResponse<T = any> {
    status: number;
    success: boolean;
    message: string;
    data: T;
}

async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.message || "Something went wrong");
    }
    return data as ApiResponse<T>;
}

export async function apiRegister(body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}): Promise<ApiResponse<AuthUser>> {
    const res = await fetch(AUTH_ENDPOINTS.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return handleResponse<AuthUser>(res);
}

export async function apiLogin(body: {
    email: string;
    password: string;
}): Promise<ApiResponse<{ user: AuthUser; token: string }>> {
    const res = await fetch(AUTH_ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return handleResponse<{ user: AuthUser; token: string }>(res);
}

export async function apiWhoami(token: string): Promise<ApiResponse<AuthUser>> {
    const res = await fetch(AUTH_ENDPOINTS.whoami, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    return handleResponse<AuthUser>(res);
}

// Uses FormData for multipart (profile image support)
export async function apiUpdateProfile(
    token: string,
    formData: FormData
): Promise<ApiResponse<AuthUser>> {
    const res = await fetch(AUTH_ENDPOINTS.update, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            // Do NOT set Content-Type — browser sets it with boundary for multipart
        },
        body: formData,
    });
    return handleResponse<AuthUser>(res);
}
