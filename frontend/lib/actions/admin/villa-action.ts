"use server";

import { getServerToken } from "@/lib/api/server-cookies";
import {
    apiFetchVillas,
    apiFetchVillaById,
    apiAdminCreateVilla,
    apiAdminUpdateVilla,
    apiAdminDeleteVilla,
} from "@/lib/api/admin";

export interface AdminActionResult {
    success: boolean;
    message?: string;
    data?: any;
    pagination?: any;
}

export async function handleGetAllVillas(params: {
    page: number;
    limit: number;
    search: string;
}): Promise<AdminActionResult> {
    try {
        const token = await getServerToken();
        if (!token) return { success: false, message: "Not authenticated" };
        const res = await apiFetchVillas(token, params);
        return { success: true, data: res.data, pagination: res.meta };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to fetch villas" };
    }
}

export async function handleGetVillaById(id: string): Promise<AdminActionResult> {
    try {
        const token = await getServerToken();
        if (!token) return { success: false, message: "Not authenticated" };
        const res = await apiFetchVillaById(token, id);
        return { success: true, data: res.data };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to fetch villa" };
    }
}

export async function handleCreateVilla(formData: FormData): Promise<AdminActionResult> {
    try {
        const token = await getServerToken();
        if (!token) return { success: false, message: "Not authenticated" };
        const res = await apiAdminCreateVilla(token, formData);
        return { success: true, data: res.data };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to create villa" };
    }
}

export async function handleUpdateVilla(id: string, formData: FormData): Promise<AdminActionResult> {
    try {
        const token = await getServerToken();
        if (!token) return { success: false, message: "Not authenticated" };
        const res = await apiAdminUpdateVilla(token, id, formData);
        return { success: true, data: res.data };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to update villa" };
    }
}

export async function handleDeleteVilla(id: string): Promise<AdminActionResult> {
    try {
        const token = await getServerToken();
        if (!token) return { success: false, message: "Not authenticated" };
        await apiAdminDeleteVilla(token, id);
        return { success: true };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to delete villa" };
    }
}