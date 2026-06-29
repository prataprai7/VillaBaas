"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { handleCreateUser } from "@/lib/actions/admin/user-action";

const CreateSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName:  z.string().min(1, "Last name is required"),
    email:     z.string().email("Invalid email address"),
    username:  z.string().min(3, "Username must be at least 3 characters"),
    password:  z.string().min(6, "Password must be at least 6 characters"),
    role:      z.enum(["user", "admin"]),
});

type CreateInput = z.infer<typeof CreateSchema>;
type FieldErrors = Partial<Record<keyof CreateInput, string>>;

const inp: React.CSSProperties = {
    width: "100%", height: 48, border: "1.5px solid #E8E2D9",
    borderRadius: 8, padding: "0 14px", fontSize: "0.875rem",
    color: "#1a1a1a", background: "#FAF7F2", outline: "none",
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
};

const lbl: React.CSSProperties = {
    display: "block", fontSize: "0.72rem", fontWeight: 600,
    color: "#3D3D3D", marginBottom: "0.4rem",
    letterSpacing: "0.08em", textTransform: "uppercase",
};

const err: React.CSSProperties = {
    fontSize: "0.7rem", color: "#C0392B", marginTop: 4,
};

export default function UserForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState<CreateInput>({
        firstName: "", lastName: "", email: "",
        username: "", password: "", role: "user",
    });
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [globalError, setGlobalError] = useState("");

    function handleChange(field: keyof CreateInput, value: string) {
        setForm(prev => ({ ...prev, [field]: value }));
        setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setGlobalError("");

        const parsed = CreateSchema.safeParse(form);
        if (!parsed.success) {
            const errors: FieldErrors = {};
            parsed.error.issues.forEach(i => {
                const f = i.path[0] as keyof FieldErrors;
                if (!errors[f]) errors[f] = i.message;
            });
            setFieldErrors(errors);
            return;
        }

        startTransition(async () => {
            const result = await handleCreateUser(parsed.data);
            if (!result.success) {
                setGlobalError(result.message || "Failed to create user");
                return;
            }
            router.push("/admin/users");
            router.refresh();
        });
    }

    return (
        <div style={{ maxWidth: 480 }}>
            {globalError && (
                <div style={{
                    background: "#FDF0EE", border: "1px solid rgba(192,57,43,0.25)",
                    borderRadius: 8, padding: "10px 14px",
                    fontSize: "0.82rem", color: "#C0392B", marginBottom: "1.25rem",
                }}>
                    {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                        <label style={lbl}>First Name</label>
                        <input style={{ ...inp, borderColor: fieldErrors.firstName ? "#C0392B" : "#E8E2D9" }}
                            type="text" placeholder="Aarav"
                            value={form.firstName}
                            onChange={e => handleChange("firstName", e.target.value)}
                        />
                        {fieldErrors.firstName && <p style={err}>{fieldErrors.firstName}</p>}
                    </div>
                    <div>
                        <label style={lbl}>Last Name</label>
                        <input style={{ ...inp, borderColor: fieldErrors.lastName ? "#C0392B" : "#E8E2D9" }}
                            type="text" placeholder="Sharma"
                            value={form.lastName}
                            onChange={e => handleChange("lastName", e.target.value)}
                        />
                        {fieldErrors.lastName && <p style={err}>{fieldErrors.lastName}</p>}
                    </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={lbl}>Email</label>
                    <input style={{ ...inp, borderColor: fieldErrors.email ? "#C0392B" : "#E8E2D9" }}
                        type="email" placeholder="hello@example.com"
                        value={form.email}
                        onChange={e => handleChange("email", e.target.value)}
                    />
                    {fieldErrors.email && <p style={err}>{fieldErrors.email}</p>}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={lbl}>Username</label>
                    <input style={{ ...inp, borderColor: fieldErrors.username ? "#C0392B" : "#E8E2D9" }}
                        type="text" placeholder="aaravsharma"
                        value={form.username}
                        onChange={e => handleChange("username", e.target.value)}
                    />
                    {fieldErrors.username && <p style={err}>{fieldErrors.username}</p>}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={lbl}>Password</label>
                    <input style={{ ...inp, borderColor: fieldErrors.password ? "#C0392B" : "#E8E2D9" }}
                        type="password" placeholder="Min 6 characters"
                        value={form.password}
                        onChange={e => handleChange("password", e.target.value)}
                    />
                    {fieldErrors.password && <p style={err}>{fieldErrors.password}</p>}
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={lbl}>Role</label>
                    <select style={{ ...inp, borderColor: fieldErrors.role ? "#C0392B" : "#E8E2D9" }}
                        value={form.role}
                        onChange={e => handleChange("role", e.target.value)}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    {fieldErrors.role && <p style={err}>{fieldErrors.role}</p>}
                </div>

                <button type="submit" disabled={isPending} style={{
                    width: "100%", height: 48,
                    background: isPending ? "#999" : "#1A1A1A",
                    color: "#fff", border: "none", borderRadius: 8,
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem",
                    fontWeight: 600, letterSpacing: "0.04em",
                    cursor: isPending ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                }}>
                    {isPending ? "Creating…" : "Create User"}
                </button>
            </form>
        </div>
    );
}
