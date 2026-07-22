const ADMIN_VILLAS = `${API_URL}/api/v1/admin/villas`;

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