import { NextResponse, NextRequest } from "next/server";

const TOKEN_KEY = "villabaas_token";

// Routes anyone can visit without a token
const publicRoutes = ["/login", "/signup"];

// Routes only admins can visit
const adminRoutes = ["/admin"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get(TOKEN_KEY)?.value;
    const userRaw = request.cookies.get("villabaas_user")?.value;

    let user: { role?: string } | null = null;
    if (userRaw) {
        try { user = JSON.parse(decodeURIComponent(userRaw)); } catch {}
    }

    const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));
    const isAdminRoute  = adminRoutes.some((r) => pathname.startsWith(r));

    // Not logged in → redirect to login (except on public routes)
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Admin route but user is not admin
    if (token && user && isAdminRoute && user.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Already logged in → redirect away from login/signup
    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/signup",
        "/dashboard/:path*",
        "/admin/:path*",
    ],
};
