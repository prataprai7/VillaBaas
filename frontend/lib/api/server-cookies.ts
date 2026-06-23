// ── SERVER-SIDE cookie helpers (Server Actions, middleware, RSC) ───────────────
import { cookies } from "next/headers";

// FIX: do NOT export TOKEN_KEY / USER_KEY from here — they're already exported
// from cookies.ts. Import from there if needed on the server side to avoid
// duplicate export conflicts across the module graph.
const TOKEN_KEY = "villabaas_token";
const USER_KEY  = "villabaas_user";

const MAX_AGE = 60 * 60 * 24 * 30;

export async function getServerToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_KEY)?.value ?? null;
}

export async function getServerUser(): Promise<Record<string, unknown> | null> {
  const store = await cookies();
  const raw = store.get(USER_KEY)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function setServerAuthCookies(token: string, user: object): Promise<void> {
  const store = await cookies();
  store.set(TOKEN_KEY, token, {
    path: "/",
    maxAge: MAX_AGE,
    sameSite: "lax",
    httpOnly: false,
  });
  // FIX: plain JSON, no encodeURIComponent — must match cookies.ts client reader
  store.set(USER_KEY, JSON.stringify(user), {
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