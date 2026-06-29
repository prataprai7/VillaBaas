import { notFound } from "next/navigation";
import { handleGetUserById } from "@/lib/actions/admin/user-action";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await handleGetUserById(id);
    if (!result.success || !result.data) notFound();
    const u = result.data;

    const rows: [string, string][] = [
        ["First Name", u.firstName],
        ["Last Name",  u.lastName],
        ["Email",      u.email],
        ["Username",   u.username || "—"],
        ["Role",       u.role],
        ["Joined",     u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"],
    ];

    return (
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <a href="/admin/users" style={{ fontSize: "0.78rem", color: "#aaa", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                ← Back to users
            </a>

            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", margin: "1.5rem 0 2rem" }}>
                {u.profileImage ? (
                    <img src={`${API_URL}${u.profileImage}`} alt="avatar" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid #C9A96E" }} />
                ) : (
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#C9A96E,#e8c97a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 700, color: "#1a1a1a", flexShrink: 0 }}>
                        {u.firstName?.[0]}{u.lastName?.[0]}
                    </div>
                )}
                <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>
                        {u.firstName} {u.lastName}
                    </h2>
                    <p style={{ fontSize: "0.82rem", color: "#aaa" }}>{u.email}</p>
                </div>
                <a href={`/admin/users/${u._id}/edit`} style={{
                    marginLeft: "auto", height: 38, display: "flex", alignItems: "center",
                    padding: "0 18px", border: "1.5px solid #ebebeb", borderRadius: 8,
                    fontSize: "0.75rem", fontWeight: 700, color: "#1a1a1a",
                    textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                    Edit
                </a>
            </div>

            <div style={{ border: "1px solid #ebebeb", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
                {rows.map(([label, value], i) => (
                    <div key={label} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "14px 20px",
                        borderBottom: i < rows.length - 1 ? "1px solid #f5f5f5" : "none",
                    }}>
                        <dt style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa" }}>{label}</dt>
                        <dd style={{ fontSize: "0.88rem", color: "#1a1a1a" }}>
                            {label === "Role" ? (
                                <span style={{
                                    padding: "3px 10px", borderRadius: 100,
                                    fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                                    background: value === "admin" ? "rgba(201,169,110,0.15)" : "#f5f5f5",
                                    color: value === "admin" ? "#8B6914" : "#888",
                                }}>{value}</span>
                            ) : value}
                        </dd>
                    </div>
                ))}
            </div>
        </div>
    );
}
