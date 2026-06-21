// ── SERVER-SIDE cookie helpers (Server Actions, middleware, RSC) ───────────────
import { cookies } from "next/headers";

export const TOKEN_KEY = "villabaas_token";
export const USER_KEY  = "villabaas_user";
const MAX_AGE = 60 * 60 * 24 * 30;

export async function getServerToken(): Promise<string | null> {
    const store = await cookies();
    return store.get(TOKEN_KEY)?.value ?? null;
}

export async function getServerUser(): Promise<Record<string, any> | null> {
    const store = await cookies();
    const raw = store.get(USER_KEY)?.value;
    if (!raw) return null;
    try { return JSON.parse(decodeURIComponent(raw)); } catch { return null; }
}

export async function setServerAuthCookies(token: string, user: object): Promise<void> {
    const store = await cookies();
    store.set(TOKEN_KEY, token, {
        path: "/",
        maxAge: MAX_AGE,
        sameSite: "lax",
        httpOnly: false, // readable by JS for display
    });
    store.set(USER_KEY, encodeURIComponent(JSON.stringify(user)), {
        path: "/",
        maxAge: MAX_AGE,
        sameSite: "lax",
        httpOnly: false,
    });
}

export async function clearServerAuthCookies(): Promise<void> {
    const store = await cookies();
    store.delete(TOKEN_KEY);
    store.delete(USER_KEY);
}
