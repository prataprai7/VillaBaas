"use server";

import { getServerToken } from "@/lib/api/server-cookies";
import {
    apiFetchUsers,
    apiFetchUserById,
    apiAdminCreateUser,
    apiAdminUpdateUser,
    apiAdminDeleteUser,
} from "@/lib/api/admin";

export interface AdminActionResult {
    success: boolean;
    message?: string;
    data?: any;
    pagination?: any;
}

export async function handleGetAllUsers(params: {
    page: number;
    limit: number;
    search: string;
}): Promise<AdminActionResult> {
    try {
        const token = await getServerToken();
        if (!token) return { success: false, message: "Not authenticated" };
        const res = await apiFetchUsers(token, params);
        return { success: true, data: res.data, pagination: res.meta };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to fetch users" };
    }
}

export async function handleGetUserById(id: string): Promise<AdminActionResult> {
    try {
        const token = await getServerToken();
        if (!token) return { success: false, message: "Not authenticated" };
        const res = await apiFetchUserById(token, id);
        return { success: true, data: res.data };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to fetch user" };
    }
}

export async function handleCreateUser(body: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: string;
}): Promise<AdminActionResult> {
    try {
        const token = await getServerToken();
        if (!token) return { success: false, message: "Not authenticated" };
        const res = await apiAdminCreateUser(token, body);
        return { success: true, data: res.data };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to create user" };
    }
}

export async function handleUpdateUser(
    id: string,
    formData: FormData
): Promise<AdminActionResult> {
    try {
        const token = await getServerToken();
        if (!token) return { success: false, message: "Not authenticated" };
        const res = await apiAdminUpdateUser(token, id, formData);
        return { success: true, data: res.data };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to update user" };
    }
}

export async function handleDeleteUser(id: string): Promise<AdminActionResult> {
    try {
        const token = await getServerToken();
        if (!token) return { success: false, message: "Not authenticated" };
        await apiAdminDeleteUser(token, id);
        return { success: true };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to delete user" };
    }
}
