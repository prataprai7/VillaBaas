"use client";

import { useState } from "react";
import { changePasswordAction, ChangePasswordSchema } from "@/lib/actions/auth-action";

interface FieldErrors {
    password?: string;
    confirmPassword?: string;
}

export default function PasswordPage() {
    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [globalError,  setGlobalError]  = useState("");
    const [successMsg,   setSuccessMsg]   = useState("");
    const [isPending,    setIsPending]    = useState(false);
    const [showPw,       setShowPw]       = useState(false);
    const [showConfirm,  setShowConfirm]  = useState(false);

    function handleBlur(field: keyof typeof form) {
        const result = ChangePasswordSchema.shape[field]?.safeParse(form[field]);
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

        const parsed = ChangePasswordSchema.safeParse(form);
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
        const result = await changePasswordAction(parsed.data);
        setIsPending(false);

        if (!result.success) {
            if (result.fieldErrors) setFieldErrors(result.fieldErrors as FieldErrors);
            if (result.message)     setGlobalError(result.message);
            return;
        }

        setSuccessMsg(result.message || "Password changed successfully!");
        setForm({ password: "", confirmPassword: "" });
    }

    const inputStyle: React.CSSProperties = {
        width: "100%", height: 48, padding: "0 46px 0 14px",
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

    function EyeButton({ show, toggle }: { show: boolean; toggle: () => void }) {
        return (
            <button
                type="button"
                onClick={toggle}
                style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "#999",
                    display: "flex", alignItems: "center", padding: 0,
                }}
            >
                {show ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                )}
            </button>
        );
    }

    return (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 5vw", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", alignItems: "start" }}>

            {/* Left — info */}
            <div>
                <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "linear-gradient(135deg,#1A1A1A,#2d2517)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1.25rem",
                }}>
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#E8D5B0" strokeWidth="1.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.6rem" }}>
                    Security
                </h2>
                <p style={{ fontSize: "0.83rem", color: "#888", lineHeight: 1.75 }}>
                    Keep your account safe by using a strong password. We recommend at least 8 characters with a mix of uppercase letters and numbers.
                </p>
            </div>

            {/* Right — form */}
            <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.4rem" }}>
                    Change Password
                </h1>
                <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: "2rem" }}>
                    Choose a new password for your VillaBaas account.
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
                    {/* New password */}
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={labelStyle}>New Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPw ? "text" : "password"}
                                placeholder="Min 6 chars, 1 uppercase, 1 number"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                onBlur={() => handleBlur("password")}
                                style={{ ...inputStyle, borderColor: fieldErrors.password ? "#C0392B" : "#E8E2D9" }}
                            />
                            <EyeButton show={showPw} toggle={() => setShowPw((v) => !v)} />
                        </div>
                        {fieldErrors.password && <p style={errorStyle}>{fieldErrors.password}</p>}
                    </div>

                    {/* Confirm password */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={labelStyle}>Confirm Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Re-enter your new password"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                onBlur={() => handleBlur("confirmPassword")}
                                style={{ ...inputStyle, borderColor: fieldErrors.confirmPassword ? "#C0392B" : "#E8E2D9" }}
                            />
                            <EyeButton show={showConfirm} toggle={() => setShowConfirm((v) => !v)} />
                        </div>
                        {fieldErrors.confirmPassword && <p style={errorStyle}>{fieldErrors.confirmPassword}</p>}
                    </div>

                    {/* Password rules hint */}
                    <div style={{ background: "#FAF7F2", border: "1px solid #E8E2D9", borderRadius: 8, padding: "12px 16px", marginBottom: "1.5rem" }}>
                        <p style={{ fontSize: "0.72rem", color: "#8B6914", fontWeight: 600, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Password requirements
                        </p>
                        {[
                            { rule: "At least 6 characters", met: form.password.length >= 6 },
                            { rule: "At least one uppercase letter", met: /[A-Z]/.test(form.password) },
                            { rule: "At least one number", met: /[0-9]/.test(form.password) },
                            { rule: "Passwords match", met: form.password === form.confirmPassword && form.password.length > 0 },
                        ].map(({ rule, met }) => (
                            <div key={rule} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                                <span style={{ color: met ? "#27ae60" : "#bbb", fontSize: "0.75rem" }}>{met ? "✓" : "○"}</span>
                                <span style={{ fontSize: "0.75rem", color: met ? "#27ae60" : "#aaa" }}>{rule}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        style={{
                            width: "100%", height: 48,
                            background: isPending ? "#999" : "#1A1A1A",
                            color: "#fff", border: "none", borderRadius: 8,
                            fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem",
                            fontWeight: 500, letterSpacing: "0.04em",
                            cursor: isPending ? "not-allowed" : "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        }}
                    >
                        {isPending ? (
                            <>
                                <span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                                Updating password…
                            </>
                        ) : "Change Password"}
                    </button>
                </form>

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );
}
