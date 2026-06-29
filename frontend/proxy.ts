import { NextResponse, NextRequest } from "next/server";

const TOKEN_KEY = "villabaas_token";
const publicRoutes = ["/login", "/signup"];
const adminRoutes  = ["/admin"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token   = request.cookies.get(TOKEN_KEY)?.value;
    const userRaw = request.cookies.get("villabaas_user")?.value;

    let user: { role?: string } | null = null;
    if (userRaw) {
        try { user = JSON.parse(decodeURIComponent(userRaw)); } catch {}
    }

    const isPublic = publicRoutes.some(r => pathname.startsWith(r));
    const isAdmin  = adminRoutes.some(r => pathname.startsWith(r));

    if (!token && !isPublic) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && isAdmin && user?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (token && isPublic) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/signup", "/dashboard/:path*", "/admin/:path*"],
};
