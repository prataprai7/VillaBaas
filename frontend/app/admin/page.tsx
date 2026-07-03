"use client";

export default function AdminPage() {
    const cards = [
        {
            href: "/admin/users",
            label: "Users",
            desc: "Manage accounts, roles, and access permissions across the platform.",
            icon: (
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9A96E" strokeWidth="1.6">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                    <path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
            ),
        },
    ];

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.6rem" }}>
                Welcome back
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.6rem" }}>
                Admin Overview
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#999", marginBottom: "2.5rem", maxWidth: 480, lineHeight: 1.7 }}>
                Manage your VillaBaas platform from one place — users, roles, and access, all in a single dashboard.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                {cards.map(({ href, label, desc, icon }) => (
                    <a key={href} href={href} style={{
                        display: "block",
                        padding: "1.75rem",
                        borderRadius: 16,
                        textDecoration: "none",
                        background: "#fff",
                        border: "1px solid #ebebeb",
                        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 14px 40px rgba(201,169,110,0.16)";
                        (e.currentTarget as HTMLElement).style.borderColor = "#C9A96E";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLElement).style.borderColor = "#ebebeb";
                    }}
                    >
                        <div style={{
                            width: 46, height: 46, borderRadius: 12,
                            background: "rgba(201,169,110,0.1)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            marginBottom: "1.1rem",
                        }}>
                            {icon}
                        </div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.5rem" }}>
                            {label}
                        </h3>
                        <p style={{ fontSize: "0.85rem", color: "#999", lineHeight: 1.65, marginBottom: "1.25rem" }}>
                            {desc}
                        </p>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "#C9A96E", fontWeight: 700 }}>
                            Manage
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
}