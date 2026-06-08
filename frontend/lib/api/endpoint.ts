const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";

export const API_BASE = `${BASE_URL}/api/v1`;

export const AUTH_ENDPOINTS = {
    register: `${API_BASE}/auth/register`,
    login:    `${API_BASE}/auth/login`,
};
