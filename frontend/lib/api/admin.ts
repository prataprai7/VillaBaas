const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";
const ADMIN_USERS  = `${API_URL}/api/v1/admin/users`;
const ADMIN_VILLAS = `${API_URL}/api/v1/admin/villas`;

async function handleResponse<T>(res: Response): Promise<T> {
    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.message || "Something went wrong");
    }
    return data as T;
}

function authHeaders(token: string) {
    return { Authorization: `Bearer ${token}` };
}

// ── USERS ────────────────────────────────────────────────────────────────

export async function apiFetchUsers(
    token: string,
    params: { page: number; limit: number; search: string }
) {
    const q = new URLSearchParams({
        page:   String(params.page),
        limit:  String(params.limit),
        search: params.search,
    });
    const res = await fetch(`${ADMIN_USERS}?${q}`, {
        headers: authHeaders(token),
    });
    return handleResponse<any>(res);
}

export async function apiFetchUserById(token: string, id: string) {
    const res = await fetch(`${ADMIN_USERS}/${id}`, {
        headers: authHeaders(token),
    });
    return handleResponse<any>(res);
}

export async function apiAdminCreateUser(token: string, body: object) {
    const res = await fetch(ADMIN_USERS, {
        method:  "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body:    JSON.stringify(body),
    });
    return handleResponse<any>(res);
}

export async function apiAdminUpdateUser(token: string, id: string, formData: FormData) {
    const res = await fetch(`${ADMIN_USERS}/${id}`, {
        method:  "PUT",
        headers: authHeaders(token),
        body:    formData,
    });
    return handleResponse<any>(res);
}

export async function apiAdminDeleteUser(token: string, id: string) {
    const res = await fetch(`${ADMIN_USERS}/${id}`, {
        method:  "DELETE",
        headers: authHeaders(token),
    });
    return handleResponse<any>(res);
}

// ── VILLAS ───────────────────────────────────────────────────────────────

export async function apiFetchVillas(
    token: string,
    params: { page: number; limit: number; search: string }
) {
    const q = new URLSearchParams({
        page:   String(params.page),
        limit:  String(params.limit),
        search: params.search,
    });
    const res = await fetch(`${ADMIN_VILLAS}?${q}`, {
        headers: authHeaders(token),
    });
    return handleResponse<any>(res);
}

export async function apiFetchVillaById(token: string, id: string) {
    const res = await fetch(`${ADMIN_VILLAS}/${id}`, {
        headers: authHeaders(token),
    });
    return handleResponse<any>(res);
}

// Uses FormData, not JSON — villa creation always includes a required image file
export async function apiAdminCreateVilla(token: string, formData: FormData) {
    const res = await fetch(ADMIN_VILLAS, {
        method:  "POST",
        headers: authHeaders(token),
        body:    formData,
    });
    return handleResponse<any>(res);
}

export async function apiAdminUpdateVilla(token: string, id: string, formData: FormData) {
    const res = await fetch(`${ADMIN_VILLAS}/${id}`, {
        method:  "PUT",
        headers: authHeaders(token),
        body:    formData,
    });
    return handleResponse<any>(res);
}

export async function apiAdminDeleteVilla(token: string, id: string) {
    const res = await fetch(`${ADMIN_VILLAS}/${id}`, {
        method:  "DELETE",
        headers: authHeaders(token),
    });
    return handleResponse<any>(res);
}