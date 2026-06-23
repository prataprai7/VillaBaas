"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { updateProfileAction, changePasswordAction } from "@/lib/actions/auth-action";
import { z } from "zod";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName:  z.string().min(1, "Last name is required").optional(),
  email:     z.string().email("Invalid email").optional(),
});

const ChangePasswordSchema = z
  .object({
    password:        z.string().min(6, "Min 6 characters").regex(/[A-Z]/, "Need uppercase").regex(/[0-9]/, "Need number"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileErrors  = { firstName?: string; lastName?: string; email?: string };
type PasswordErrors = { password?: string; confirmPassword?: string };

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  // ── Profile state ──
  const [form,           setForm]           = useState({ firstName: "", lastName: "", email: "" });
  const [profileErrors,  setProfileErrors]  = useState<ProfileErrors>({});
  const [profileError,   setProfileError]   = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profilePending, setProfilePending] = useState(false);
  const [imagePreview,   setImagePreview]   = useState<string | null>(null);
  const [imageFile,      setImageFile]      = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Password state ──
  const [pwForm,      setPwForm]      = useState({ password: "", confirmPassword: "" });
  const [pwErrors,    setPwErrors]    = useState<PasswordErrors>({});
  const [pwError,     setPwError]     = useState("");
  const [pwSuccess,   setPwSuccess]   = useState("");
  const [pwPending,   setPwPending]   = useState(false);
  const [showPw,      setShowPw]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // FIX: populate form when user loads from context
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

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    const parsed = UpdateProfileSchema.safeParse(form);
    if (!parsed.success) {
      const errors: ProfileErrors = {};
      parsed.error.issues.forEach((i) => {
        const f = i.path[0] as keyof ProfileErrors;
        if (!errors[f]) errors[f] = i.message;
      });
      setProfileErrors(errors);
      return;
    }

    setProfilePending(true);
    const fd = new FormData();
    if (form.firstName) fd.append("firstName", form.firstName);
    if (form.lastName)  fd.append("lastName",  form.lastName);
    if (form.email)     fd.append("email",      form.email);
    if (imageFile)      fd.append("profileImage", imageFile);

    const result = await updateProfileAction(fd);
    setProfilePending(false);

    if (!result.success) {
      setProfileError(result.message || "Update failed");
      return;
    }
    setProfileSuccess("Profile updated successfully!");
    // FIX: refresh context so navbar avatar updates immediately
    refreshUser();
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    const parsed = ChangePasswordSchema.safeParse(pwForm);
    if (!parsed.success) {
      const errors: PasswordErrors = {};
      parsed.error.issues.forEach((i) => {
        const f = i.path[0] as keyof PasswordErrors;
        if (!errors[f]) errors[f] = i.message;
      });
      setPwErrors(errors);
      return;
    }

    setPwPending(true);
    const result = await changePasswordAction(parsed.data);
    setPwPending(false);

    if (!result.success) {
      setPwError(result.message || "Failed");
      return;
    }
    setPwSuccess("Password changed successfully!");
    setPwForm({ password: "", confirmPassword: "" });
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
  const errStyle: React.CSSProperties = { fontSize: "0.7rem", color: "#C0392B", marginTop: 4 };
  const successStyle: React.CSSProperties = {
    background: "#F0FAF4", border: "1px solid rgba(39,174,96,0.3)",
    borderRadius: 8, padding: "10px 14px", fontSize: "0.82rem",
    color: "#1e8449", marginBottom: "1.25rem",
  };
  const errorBannerStyle: React.CSSProperties = {
    background: "#FDF0EE", border: "1px solid rgba(192,57,43,0.25)",
    borderRadius: 8, padding: "10px 14px", fontSize: "0.82rem",
    color: "#C0392B", marginBottom: "1.25rem",
  };

  // FIX: show loading state if user hasn't loaded from context yet
  if (!user) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "3px solid #f0f0f0", borderTop: "3px solid #C9A96E",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 5vw" }}>

      {/* Back link */}
      <Link href="/dashboard" style={{
        fontSize: "0.8rem", color: "#aaa", textDecoration: "none",
        display: "inline-flex", alignItems: "center", gap: 5, marginBottom: "2rem",
      }}>
        ← Back to Dashboard
      </Link>

      {/* ── PROFILE UPDATE ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: "3rem", alignItems: "start",
        marginBottom: "4rem", paddingBottom: "4rem",
        borderBottom: "1px solid #f0f0f0",
      }}>
        {/* Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 120, height: 120, borderRadius: "50%",
              overflow: "hidden", cursor: "pointer",
              border: "3px solid #C9A96E", background: "#FAF7F2",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.5rem", color: "#C9A96E", fontWeight: 600,
              }}>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <p style={{ fontSize: "0.7rem", color: "#bbb", textAlign: "center", lineHeight: 1.5 }}>
            Click to upload photo<br />JPEG or PNG, max 5MB
          </p>
        </div>

        {/* Form */}
        <div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "2rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.3rem",
          }}>
            Update Profile
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#aaa", marginBottom: "1.5rem" }}>
            Keep your VillaBaas account details up to date.
          </p>

          {profileError   && <div style={errorBannerStyle}>{profileError}</div>}
          {profileSuccess && <div style={successStyle}>✓ {profileSuccess}</div>}

          <form onSubmit={handleProfileSubmit} noValidate>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  style={{ ...inputStyle, borderColor: profileErrors.firstName ? "#C0392B" : "#E8E2D9" }}
                />
                {profileErrors.firstName && <p style={errStyle}>{profileErrors.firstName}</p>}
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  style={{ ...inputStyle, borderColor: profileErrors.lastName ? "#C0392B" : "#E8E2D9" }}
                />
                {profileErrors.lastName && <p style={errStyle}>{profileErrors.lastName}</p>}
              </div>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ ...inputStyle, borderColor: profileErrors.email ? "#C0392B" : "#E8E2D9" }}
              />
              {profileErrors.email && <p style={errStyle}>{profileErrors.email}</p>}
            </div>
            <button
              type="submit"
              disabled={profilePending}
              style={{
                height: 48, padding: "0 32px",
                background: profilePending ? "#999" : "#1A1A1A", color: "#fff",
                border: "none", borderRadius: 8,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.875rem", fontWeight: 500,
                cursor: profilePending ? "not-allowed" : "pointer",
              }}
            >
              {profilePending ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>

      {/* ── CHANGE PASSWORD ── */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "3rem", alignItems: "start" }}>

        {/* Icon */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", paddingTop: "0.5rem" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg,#1A1A1A,#2d2517)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#E8D5B0" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <p style={{ fontSize: "0.7rem", color: "#bbb", textAlign: "center", lineHeight: 1.6 }}>
            Use a strong password with uppercase letters and numbers
          </p>
        </div>

        {/* Form */}
        <div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "2rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.3rem",
          }}>
            Change Password
          </h2>
          <p style={{ fontSize: "0.82rem", color: "#aaa", marginBottom: "1.5rem" }}>
            Choose a new password for your VillaBaas account.
          </p>

          {pwError   && <div style={errorBannerStyle}>{pwError}</div>}
          {pwSuccess && <div style={successStyle}>✓ {pwSuccess}</div>}

          <form onSubmit={handlePasswordSubmit} noValidate>
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Min 6 chars, 1 uppercase, 1 number"
                  value={pwForm.password}
                  onChange={e => setPwForm({ ...pwForm, password: e.target.value })}
                  style={{ ...inputStyle, paddingRight: 46, borderColor: pwErrors.password ? "#C0392B" : "#E8E2D9" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa" }}
                >
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
              {pwErrors.password && <p style={errStyle}>{pwErrors.password}</p>}
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  value={pwForm.confirmPassword}
                  onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                  style={{ ...inputStyle, paddingRight: 46, borderColor: pwErrors.confirmPassword ? "#C0392B" : "#E8E2D9" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa" }}
                >
                  {showConfirm ? "🙈" : "👁"}
                </button>
              </div>
              {pwErrors.confirmPassword && <p style={errStyle}>{pwErrors.confirmPassword}</p>}
            </div>

            {/* Strength hints */}
            <div style={{
              background: "#FAF7F2", border: "1px solid #E8E2D9",
              borderRadius: 8, padding: "12px 16px", marginBottom: "1.5rem",
            }}>
              {[
                { rule: "At least 6 characters",        met: pwForm.password.length >= 6 },
                { rule: "At least one uppercase letter", met: /[A-Z]/.test(pwForm.password) },
                { rule: "At least one number",           met: /[0-9]/.test(pwForm.password) },
                { rule: "Passwords match",               met: pwForm.password === pwForm.confirmPassword && pwForm.password.length > 0 },
              ].map(({ rule, met }) => (
                <div key={rule} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ color: met ? "#27ae60" : "#ccc", fontSize: "0.75rem" }}>{met ? "✓" : "○"}</span>
                  <span style={{ fontSize: "0.75rem", color: met ? "#27ae60" : "#aaa" }}>{rule}</span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={pwPending}
              style={{
                height: 48, padding: "0 32px",
                background: pwPending ? "#999" : "#1A1A1A", color: "#fff",
                border: "none", borderRadius: 8,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.875rem", fontWeight: 500,
                cursor: pwPending ? "not-allowed" : "pointer",
              }}
            >
              {pwPending ? "Changing…" : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}