import { notFound } from "next/navigation";
import { handleGetUserById } from "@/lib/actions/admin/user-action";
// import UserFormCreate from "../../_components/UserFormCreate";
import UserFormEdit from "@/app/admin/_components/UserFormEdit";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await handleGetUserById(id);
    if (!result.success || !result.data) notFound();

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <a href="/admin/users" style={{ fontSize: "0.78rem", color: "#aaa", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                ← Back to users
            </a>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 600, color: "#1a1a1a", margin: "1rem 0 2rem" }}>
                Edit User
            </h2>
            <UserFormEdit user={result.data} />
        </div>
    );
}
