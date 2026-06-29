"use client";
export default function AdminPage() {
    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.5rem" }}>
                Admin
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "2rem" }}>
                Overview
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                {[
                    { href: "/admin/users", label: "Users", desc: "Manage accounts, roles and access." },
                ].map(({ href, label, desc }) => (
                    <a key={href} href={href} style={{
                        display: "block",
                        padding: "1.5rem",
                        border: "1px solid #ebebeb",
                        borderRadius: 12,
                        textDecoration: "none",
                        background: "#fff",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "#C9A96E";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(201,169,110,0.12)";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "#ebebeb";
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                    >
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.4rem" }}>
                            {label}
                        </h3>
                        <p style={{ fontSize: "0.83rem", color: "#888", lineHeight: 1.6 }}>{desc}</p>
                        <span style={{ display: "inline-block", marginTop: "1rem", fontSize: "0.75rem", color: "#C9A96E", fontWeight: 600 }}>
                            Manage →
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
}
