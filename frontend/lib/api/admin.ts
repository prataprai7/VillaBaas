const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";
const ADMIN_USERS = `${API_URL}/api/v1/admin/users`;

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
