"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { usePathname } from "next/navigation";

const BRAND_RED = "#DA0B00";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            display: "flex",
            height: "100vh",
            background: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            color: "#1C1C1C",
            margin: 0,
            padding: 0,
            width: "100%",
            overflow: "hidden",
        }}>
            <AdminSidebar />
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, overflow: "hidden" }}>
                <AdminHeader />
                <main style={{ flex: 1, overflowY: "auto", padding: "2.5rem 3rem", background: "#EEEEEE" }}>
                    {children}
                </main>
                <AdminFooter />
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
            `}</style>
        </div>
    );
}

function AdminSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

    const navItems = [
        {
            href: "/admin", label: "Overview", exact: true,
            icon: (
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="7" height="9" rx="1.5"/>
                    <rect x="14" y="3" width="7" height="5" rx="1.5"/>
                    <rect x="14" y="12" width="7" height="9" rx="1.5"/>
                    <rect x="3" y="16" width="7" height="5" rx="1.5"/>
                </svg>
            ),
        },
        {
            href: "/admin/users", label: "Users",
            icon: (
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                    <path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
            ),
        },
    ];

    return (
        <aside style={{
            width: 252,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            borderRight: "1px solid #f0f0f0",
            color: "#1C1C1C",
        }}>
            {/* Brand */}
            <div style={{
                height: 72,
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "0 1.5rem",
                borderBottom: "1px solid #f0f0f0",
            }}>
                <div style={{
                    width: 38, height: 38, borderRadius: "50%",
                    background: BRAND_RED,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="1.8">
                        <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"/>
                        <path d="M9 22V12h6v10"/>
                    </svg>
                </div>
                <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.01em", lineHeight: 1.1, color: "#1C1C1C" }}>
                        VillaBaas
                    </p>
                    <p style={{ fontSize: "0.6rem", color: BRAND_RED, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, marginTop: 2 }}>
                        Admin Panel
                    </p>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, padding: "1.25rem 1rem" }}>
                <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#bbb", padding: "0 0.75rem", marginBottom: "0.5rem" }}>
                    Menu
                </p>
                {navItems.map(({ href, label, exact, icon }) => {
                    const active = isActive(href, exact);
                    return (
                        <a key={href} href={href} style={{
                            display: "flex", alignItems: "center", gap: 11,
                            padding: "10px 14px",
                            borderRadius: 10,
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            color: active ? "#fff" : "#666",
                            background: active ? BRAND_RED : "transparent",
                            textDecoration: "none",
                            transition: "background 0.18s, color 0.18s",
                            boxShadow: active ? "0 4px 14px rgba(218,11,0,0.25)" : "none",
                        }}
                        onMouseEnter={e => {
                            if (!active) {
                                (e.currentTarget as HTMLElement).style.background = "#f5f5f5";
                                (e.currentTarget as HTMLElement).style.color = "#1C1C1C";
                            }
                        }}
                        onMouseLeave={e => {
                            if (!active) {
                                (e.currentTarget as HTMLElement).style.background = "transparent";
                                (e.currentTarget as HTMLElement).style.color = "#666";
                            }
                        }}
                        >
                            {icon}
                            {label}
                        </a>
                    );
                })}
            </nav>

            {/* User card + logout */}
            <div style={{ padding: "1rem", borderTop: "1px solid #f0f0f0" }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "#fafafa",
                    marginBottom: 8,
                }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: BRAND_RED,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.7rem", fontWeight: 700, color: "#fff", flexShrink: 0,
                    }}>
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1C1C1C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p style={{ fontSize: "0.65rem", color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {user?.email}
                        </p>
                    </div>
                </div>

                <button onClick={logout} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px",
                    borderRadius: 10,
                    fontSize: "0.83rem", fontWeight: 500,
                    color: "#666",
                    background: "transparent",
                    border: "1px solid #ebebeb",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "background 0.18s, color 0.18s, border-color 0.18s",
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "#fff5f5";
                    (e.currentTarget as HTMLElement).style.color = BRAND_RED;
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(218,11,0,0.25)";
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#666";
                    (e.currentTarget as HTMLElement).style.borderColor = "#ebebeb";
                }}
                >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                </button>
            </div>
        </aside>
    );
}

function AdminHeader() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const TITLES: Record<string, string> = {
        admin: "Overview", users: "Users", create: "Create User", edit: "Edit User",
    };
    const last = segments[segments.length - 1] ?? "admin";
    const title = TITLES[last] ?? "User Details";

    return (
        <header style={{
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2.5rem",
            borderBottom: "1px solid #f0f0f0",
            background: "#fff",
            flexShrink: 0,
        }}>
            <div>
                <p style={{
                    fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: BRAND_RED, marginBottom: 3,
                }}>
                    {segments.join(" / ")}
                </p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.45rem", fontWeight: 700, color: "#1C1C1C", lineHeight: 1 }}>
                    {title}
                </h1>
            </div>

            <a href="/dashboard" style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 16px",
                borderRadius: 8,
                border: "1.5px solid #ebebeb",
                fontSize: "0.78rem", fontWeight: 600, color: "#666",
                textDecoration: "none",
                transition: "border-color 0.18s, color 0.18s",
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = BRAND_RED;
                (e.currentTarget as HTMLElement).style.color = BRAND_RED;
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#ebebeb";
                (e.currentTarget as HTMLElement).style.color = "#666";
            }}
            >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                View Site
            </a>
        </header>
    );
}

function AdminFooter() {
    return (
        <footer style={{
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2.5rem",
            borderTop: "1px solid #f0f0f0",
            background: "#fff",
            flexShrink: 0,
        }}>
            <p style={{ fontSize: "0.7rem", color: "#bbb" }}>
                © {new Date().getFullYear()} VillaBaas Admin
            </p>
            <p style={{ fontSize: "0.7rem", color: "#bbb" }}>Sprint 4</p>
        </footer>
    );
}