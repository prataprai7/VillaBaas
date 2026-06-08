import { AUTH_ENDPOINTS } from "./endpoint";


export interface AuthUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface AuthResponse {
    status: number;
    success: boolean;
    message: string;
    data: {
        user?: AuthUser;       // register returns just user
        token?: string;        // login returns user + token
    } | AuthUser;
}


async function handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.message || "Something went wrong");
    }
    return data as T;
}


export async function apiRegister(body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}): Promise<AuthResponse> {
    const res = await fetch(AUTH_ENDPOINTS.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return handleResponse<AuthResponse>(res);
}

export async function apiLogin(body: {
    email: string;
    password: string;
}): Promise<AuthResponse> {
    const res = await fetch(AUTH_ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return handleResponse<AuthResponse>(res);
}
