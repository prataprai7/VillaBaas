"use client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            display: "flex",
            height: "100vh",
            background: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            color: "#1a1a1a",
            margin: 0,
            padding: 0,
            width: "100%",
            overflow: "hidden",
        }}>
            <AdminSidebar />
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, overflow: "hidden" }}>
                <AdminHeader />
                <main style={{ flex: 1, overflowY: "auto", padding: "2rem 2.5rem", background: "#fafaf9" }}>
                    {children}
                </main>
                <AdminFooter />
            </div>
        </div>
    );
}

function AdminSidebar() {
    return (
        <aside style={{
            width: 240,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #ebebeb",
            background: "#fff",
        }}>
            <div style={{
                height: 64,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 1.5rem",
                borderBottom: "1px solid #ebebeb",
            }}>
                <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "linear-gradient(135deg,#1A1A1A,#2d2517)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#E8D5B0" strokeWidth="1.6">
                        <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"/>
                        <path d="M9 22V12h6v10"/>
                    </svg>
                </div>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontWeight: 600, letterSpacing: "0.04em" }}>
                    VillaBaas
                </span>
                <span style={{
                    marginLeft: "auto",
                    fontSize: "0.6rem", fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    background: "#1A1A1A", color: "#E8D5B0",
                    padding: "2px 8px", borderRadius: 4,
                }}>Admin</span>
            </div>

            <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "1rem" }}>
                {[
                    { href: "/admin",       label: "Overview" },
                    { href: "/admin/users", label: "Users" },
                ].map(({ href, label }) => (
                    <a key={href} href={href} style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "#555",
                        textDecoration: "none",
                        transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "#f5f5f5";
                        (e.currentTarget as HTMLElement).style.color = "#1a1a1a";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "#555";
                    }}
                    >{label}</a>
                ))}
            </nav>

            <div style={{ padding: "1rem", borderTop: "1px solid #ebebeb" }}>
                <a href="/dashboard" style={{
                    fontSize: "0.75rem", color: "#aaa", textDecoration: "none",
                    fontWeight: 500, transition: "color 0.15s",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#1a1a1a")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#aaa")}
                >← Back to app</a>
            </div>
        </aside>
    );
}

function AdminHeader() {
    return (
        <header style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2rem",
            borderBottom: "1px solid #ebebeb",
            background: "#fff",
            flexShrink: 0,
        }}>
            <div>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", marginBottom: 1 }}>
                    Admin Panel
                </p>
                <h1 style={{ fontSize: "1rem", fontWeight: 600, color: "#1a1a1a", lineHeight: 1 }}>
                    VillaBaas Management
                </h1>
            </div>
        </header>
    );
}

function AdminFooter() {
    return (
        <footer style={{
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2rem",
            borderTop: "1px solid #ebebeb",
            background: "#fff",
            flexShrink: 0,
        }}>
            <p style={{ fontSize: "0.72rem", color: "#aaa" }}>
                © {new Date().getFullYear()} VillaBaas Admin
            </p>
            <p style={{ fontSize: "0.72rem", color: "#aaa" }}>Sprint 4</p>
        </footer>
    );
}
