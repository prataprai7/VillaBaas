// ── CLIENT-SIDE cookie helpers (browser only) ─────────────────────────────────
export const TOKEN_KEY = "villabaas_token";
export const USER_KEY  = "villabaas_user";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function setAuthCookies(token: string, user: object): void {
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
  // FIX: store as plain JSON (no encodeURIComponent) to match server-cookies.ts
  document.cookie = `${USER_KEY}=${JSON.stringify(user)}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

export function getTokenCookie(): string | null {
  return getCookie(TOKEN_KEY);
}

export function getUserCookie(): object | null {
  const raw = getCookie(USER_KEY);
  if (!raw) return null;
  try {
    // Handle both plain JSON and URL-encoded JSON
    const decoded = raw.includes('%') ? decodeURIComponent(raw) : raw;
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function clearAuthCookies(): void {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  document.cookie = `${USER_KEY}=; path=/; max-age=0`;
}

// Safely splits on first "=" only — handles values containing "=" (JWT, encoded JSON)
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}