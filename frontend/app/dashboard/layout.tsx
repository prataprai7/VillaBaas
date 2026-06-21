"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";

const navLinks = [
    { href: "/dashboard",          label: "Home" },
    { href: "/dashboard/profile",  label: "Profile" },
    { href: "/dashboard/password", label: "Password" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const avatarSrc = user?.profileImage
        ? `${API_URL}${user.profileImage}`
        : null;

    return (
        <div style={{
            width: "100%", minHeight: "100vh",
            background: "#fff", fontFamily: "'DM Sans', sans-serif",
            display: "flex", flexDirection: "column",
        }}>
            {/* Navbar */}
            <nav style={{
                position: "sticky", top: 0, zIndex: 200,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "1rem 4vw",
                background: "rgba(255,255,255,0.97)",
                backdropFilter: "blur(14px)",
                borderBottom: "1px solid #ebebeb",
                boxShadow: "0 1px 20px rgba(0,0,0,0.06)",
            }}>
                {/* Logo */}
                <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: "50%",
                        background: "linear-gradient(135deg,#1A1A1A,#2d2517)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#E8D5B0" strokeWidth="1.6">
                            <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"/>
                            <path d="M9 22V12h6v10"/>
                        </svg>
                    </div>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 600, color: "#1a1a1a", letterSpacing: "0.04em" }}>
                        VillaBaas
                    </span>
                </Link>

                {/* Nav links */}
                <div style={{ display: "flex", gap: "2rem" }}>
                    {navLinks.map((l) => (
                        <Link key={l.href} href={l.href} style={{
                            fontSize: "0.85rem",
                            color: pathname === l.href ? "#1a1a1a" : "#888",
                            textDecoration: "none",
                            fontWeight: pathname === l.href ? 600 : 400,
                            borderBottom: pathname === l.href ? "2px solid #C9A96E" : "2px solid transparent",
                            paddingBottom: "2px",
                            transition: "all 0.2s",
                        }}>
                            {l.label}
                        </Link>
                    ))}
                </div>

                {/* User + logout */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {avatarSrc ? (
                        <img src={avatarSrc} alt="avatar" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "2px solid #C9A96E" }} />
                    ) : (
                        <div style={{
                            width: 34, height: 34, borderRadius: "50%",
                            background: "linear-gradient(135deg,#C9A96E,#e8c97a)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.75rem", fontWeight: 700, color: "#1a1a1a",
                        }}>
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                    )}
                    <span style={{ fontSize: "0.82rem", color: "#555" }}>
                        <strong style={{ color: "#1a1a1a" }}>{user?.firstName} {user?.lastName}</strong>
                    </span>
                    <button onClick={logout} style={{
                        background: "#1A1A1A", color: "#fff", border: "none",
                        borderRadius: "8px", padding: "8px 18px",
                        fontSize: "0.8rem", cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    }}>
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Page content */}
            <main style={{ flex: 1 }}>
                {children}
            </main>

            {/* Footer */}
            <footer style={{
                textAlign: "center", padding: "1.5rem",
                fontSize: "0.75rem", color: "#bbb",
                borderTop: "1px solid #f0f0f0",
            }}>
                © {new Date().getFullYear()} VillaBaas. All rights reserved.
            </footer>
        </div>
    );
}
