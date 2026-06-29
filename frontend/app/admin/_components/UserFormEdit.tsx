"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { handleUpdateUser } from "@/lib/actions/admin/user-action";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";

const EditSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName:  z.string().min(1, "Last name is required"),
    email:     z.string().email("Invalid email address"),
    username:  z.string().min(3, "Username must be at least 3 characters"),
    role:      z.enum(["user", "admin"]),
});

type EditInput = z.infer<typeof EditSchema>;
type FieldErrors = Partial<Record<keyof EditInput, string>>;

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

const errStyle: React.CSSProperties = {
    fontSize: "0.7rem", color: "#C0392B", marginTop: 4,
};

export default function UserFormEdit({ user }: { user: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState<EditInput>({
        firstName: user?.firstName || "",
        lastName:  user?.lastName  || "",
        email:     user?.email     || "",
        username:  user?.username  || "",
        role:      user?.role      || "user",
    });
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [globalError, setGlobalError]   = useState("");
    const [successMsg, setSuccessMsg]     = useState("");
    const [imageFile, setImageFile]       = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    function handleChange(field: keyof EditInput, value: string) {
        setForm(prev => ({ ...prev, [field]: value }));
        setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setGlobalError("");
        setSuccessMsg("");

        const parsed = EditSchema.safeParse(form);
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
            const fd = new FormData();
            fd.append("firstName", parsed.data.firstName);
            fd.append("lastName",  parsed.data.lastName);
            fd.append("email",     parsed.data.email);
            fd.append("username",  parsed.data.username);
            fd.append("role",      parsed.data.role);
            if (imageFile) fd.append("profileImage", imageFile);

            const result = await handleUpdateUser(user._id, fd);
            if (!result.success) {
                setGlobalError(result.message || "Failed to update user");
                return;
            }
            setSuccessMsg("User updated successfully!");
            router.refresh();
        });
    }

    const avatarSrc = imagePreview
        ? imagePreview
        : user?.profileImage
        ? `${API_URL}${user.profileImage}`
        : null;

    return (
        <div style={{ maxWidth: 480 }}>
            {globalError && (
                <div style={{
                    background: "#FDF0EE", border: "1px solid rgba(192,57,43,0.25)",
                    borderRadius: 8, padding: "10px 14px",
                    fontSize: "0.82rem", color: "#C0392B", marginBottom: "1.25rem",
                }}>{globalError}</div>
            )}
            {successMsg && (
                <div style={{
                    background: "#F0FAF4", border: "1px solid rgba(39,174,96,0.3)",
                    borderRadius: 8, padding: "10px 14px",
                    fontSize: "0.82rem", color: "#1e8449", marginBottom: "1.25rem",
                }}>✓ {successMsg}</div>
            )}

            <div style={{ marginBottom: "1.5rem" }}>
                <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                        width: 80, height: 80, borderRadius: "50%",
                        overflow: "hidden", cursor: "pointer",
                        border: "2px solid #C9A96E",
                        background: "#FAF7F2",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: "0.75rem",
                    }}
                >
                    {avatarSrc ? (
                        <img src={avatarSrc} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#C9A96E", fontWeight: 600 }}>
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={handleImageChange} />
                <p style={{ fontSize: "0.72rem", color: "#aaa" }}>Click avatar to change photo (JPEG or PNG, max 5MB)</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                        <label style={lbl}>First Name</label>
                        <input style={{ ...inp, borderColor: fieldErrors.firstName ? "#C0392B" : "#E8E2D9" }}
                            type="text" value={form.firstName}
                            onChange={e => handleChange("firstName", e.target.value)}
                        />
                        {fieldErrors.firstName && <p style={errStyle}>{fieldErrors.firstName}</p>}
                    </div>
                    <div>
                        <label style={lbl}>Last Name</label>
                        <input style={{ ...inp, borderColor: fieldErrors.lastName ? "#C0392B" : "#E8E2D9" }}
                            type="text" value={form.lastName}
                            onChange={e => handleChange("lastName", e.target.value)}
                        />
                        {fieldErrors.lastName && <p style={errStyle}>{fieldErrors.lastName}</p>}
                    </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={lbl}>Email</label>
                    <input style={{ ...inp, borderColor: fieldErrors.email ? "#C0392B" : "#E8E2D9" }}
                        type="email" value={form.email}
                        onChange={e => handleChange("email", e.target.value)}
                    />
                    {fieldErrors.email && <p style={errStyle}>{fieldErrors.email}</p>}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={lbl}>Username</label>
                    <input style={{ ...inp, borderColor: fieldErrors.username ? "#C0392B" : "#E8E2D9" }}
                        type="text" value={form.username}
                        onChange={e => handleChange("username", e.target.value)}
                    />
                    {fieldErrors.username && <p style={errStyle}>{fieldErrors.username}</p>}
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
                    {fieldErrors.role && <p style={errStyle}>{fieldErrors.role}</p>}
                </div>

                <button type="submit" disabled={isPending} style={{
                    width: "100%", height: 48,
                    background: isPending ? "#999" : "#1A1A1A",
                    color: "#fff", border: "none", borderRadius: 8,
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem",
                    fontWeight: 600, letterSpacing: "0.04em",
                    cursor: isPending ? "not-allowed" : "pointer",
                }}>
                    {isPending ? "Saving…" : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
