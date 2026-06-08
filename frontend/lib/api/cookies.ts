export const TOKEN_KEY = "villabaas_token";
export const USER_KEY  = "villabaas_user";

const MAX_AGE = 60 * 60 * 24 * 30;

export function setAuthCookies(token: string, user: object): void {
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
    document.cookie = `${USER_KEY}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

export function getTokenCookie(): string | null {
    return getCookie(TOKEN_KEY);
}

export function getUserCookie(): object | null {
    const raw = getCookie(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(decodeURIComponent(raw)); } catch { return null; }
}

export function clearAuthCookies(): void {
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
    document.cookie = `${USER_KEY}=; path=/; max-age=0`;
}

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
}
