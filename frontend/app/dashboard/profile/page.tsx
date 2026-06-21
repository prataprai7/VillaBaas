"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { updateProfileAction, UpdateProfileSchema } from "@/lib/actions/auth-action";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";

interface FieldErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();

    const [form, setForm] = useState({
        firstName: "",
        lastName:  "",
        email:     "",
    });
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [globalError, setGlobalError]   = useState("");
    const [successMsg,  setSuccessMsg]    = useState("");
    const [isPending,   setIsPending]     = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile]       = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Prefill form from AuthContext user
    useEffect(() => {
        if (user) {
            setForm({
                firstName: user.firstName || "",
                lastName:  user.lastName  || "",
                email:     user.email     || "",
            });
            if (user.profileImage) {
                setImagePreview(`${API_URL}${user.profileImage}`);
            }
        }
    }, [user]);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    function handleBlur(field: keyof typeof form) {
        const result = UpdateProfileSchema.shape[field]?.safeParse(form[field]);
        if (result && !result.success) {
            setFieldErrors((prev) => ({ ...prev, [field]: result.error.issues[0].message }));
        } else {
            setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setGlobalError("");
        setSuccessMsg("");

        const parsed = UpdateProfileSchema.safeParse(form);
        if (!parsed.success) {
            const errors: FieldErrors = {};
            parsed.error.issues.forEach((i) => {
                const f = i.path[0] as keyof FieldErrors;
                if (!errors[f]) errors[f] = i.message;
            });
            setFieldErrors(errors);
            return;
        }

        setIsPending(true);

        // Build FormData — text fields + optional image
        const formData = new FormData();
        if (form.firstName) formData.append("firstName", form.firstName);
        if (form.lastName)  formData.append("lastName",  form.lastName);
        if (form.email)     formData.append("email",     form.email);
        if (imageFile)      formData.append("profileImage", imageFile);

        const result = await updateProfileAction(formData);
        setIsPending(false);

        if (!result.success) {
            if (result.fieldErrors) setFieldErrors(result.fieldErrors as FieldErrors);
            if (result.message)     setGlobalError(result.message);
            return;
        }

        setSuccessMsg(result.message || "Profile updated!");
        refreshUser(); // refresh AuthContext from cookies
    }

    const inputStyle: React.CSSProperties = {
        width: "100%", height: 48, padding: "0 14px",
        border: "1.5px solid #E8E2D9", borderRadius: 8,
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem",
        color: "#1a1a1a", background: "#FAF7F2", outline: "none",
    };

    const labelStyle: React.CSSProperties = {
        display: "block", fontSize: "0.72rem", fontWeight: 600,
        color: "#3D3D3D", marginBottom: "0.4rem",
        letterSpacing: "0.08em", textTransform: "uppercase",
    };

    const errorStyle: React.CSSProperties = {
        fontSize: "0.7rem", color: "#C0392B", marginTop: 4,
    };

    return (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 5vw", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", alignItems: "start" }}>

            {/* Left — avatar */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        width: 140, height: 140, borderRadius: "50%",
                        overflow: "hidden", cursor: "pointer",
                        border: "3px solid #C9A96E",
                        background: "#FAF7F2",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: "relative",
                    }}
                >
                    {imagePreview ? (
                        <img src={imagePreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3rem", color: "#C9A96E", fontWeight: 600 }}>
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                    )}
                    {/* Hover overlay */}
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "rgba(0,0,0,0.35)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                    >
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" strokeWidth="1.8">
                            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                            <circle cx="12" cy="13" r="4"/>
                        </svg>
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                />

                <div style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 600, color: "#1a1a1a" }}>
                        {user?.firstName} {user?.lastName}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "#aaa", marginTop: 4 }}>{user?.email}</p>
                    <span style={{
                        display: "inline-block", marginTop: 8,
                        background: "#FAF7F2", border: "1px solid #E8E2D9",
                        borderRadius: 100, padding: "3px 12px",
                        fontSize: "0.65rem", color: "#8B6914",
                        fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                    }}>
                        {user?.role}
                    </span>
                </div>

                <p style={{ fontSize: "0.72rem", color: "#bbb", textAlign: "center" }}>
                    Click avatar to upload a new photo.<br />JPEG or PNG, max 5MB.
                </p>
            </div>

            {/* Right — form */}
            <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.4rem" }}>
                    Update Profile
                </h1>
                <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: "2rem" }}>
                    Keep your VillaBaas account details up to date.
                </p>

                {globalError && (
                    <div style={{ background: "#FDF0EE", border: "1px solid rgba(192,57,43,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: "0.82rem", color: "#C0392B", marginBottom: "1.25rem" }}>
                        {globalError}
                    </div>
                )}

                {successMsg && (
                    <div style={{ background: "#F0FAF4", border: "1px solid rgba(39,174,96,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: "0.82rem", color: "#1e8449", marginBottom: "1.25rem" }}>
                        ✓ {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                        <div>
                            <label style={labelStyle}>First Name</label>
                            <input
                                type="text"
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                onBlur={() => handleBlur("firstName")}
                                style={{ ...inputStyle, borderColor: fieldErrors.firstName ? "#C0392B" : "#E8E2D9" }}
                            />
                            {fieldErrors.firstName && <p style={errorStyle}>{fieldErrors.firstName}</p>}
                        </div>
                        <div>
                            <label style={labelStyle}>Last Name</label>
                            <input
                                type="text"
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                onBlur={() => handleBlur("lastName")}
                                style={{ ...inputStyle, borderColor: fieldErrors.lastName ? "#C0392B" : "#E8E2D9" }}
                            />
                            {fieldErrors.lastName && <p style={errorStyle}>{fieldErrors.lastName}</p>}
                        </div>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            onBlur={() => handleBlur("email")}
                            style={{ ...inputStyle, borderColor: fieldErrors.email ? "#C0392B" : "#E8E2D9" }}
                        />
                        {fieldErrors.email && <p style={errorStyle}>{fieldErrors.email}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        style={{
                            width: "100%", height: 48,
                            background: isPending ? "#999" : "#1A1A1A",
                            color: "#fff", border: "none", borderRadius: 8,
                            fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem",
                            fontWeight: 500, letterSpacing: "0.04em", cursor: isPending ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        }}
                    >
                        {isPending ? (
                            <>
                                <span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                                Updating…
                            </>
                        ) : "Save Changes"}
                    </button>
                </form>

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );
}
