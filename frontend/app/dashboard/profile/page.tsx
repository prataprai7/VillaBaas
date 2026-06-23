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

function IconUser({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function IconLock({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  );
}
function IconCamera({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}
function IconEye({ size = 18, off = false }: { size?: number; off?: boolean }) {
  return off ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function IconArrowLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  );
}
function IconAlertCircle({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [form,           setForm]           = useState({ firstName: "", lastName: "", email: "" });
  const [profileErrors,  setProfileErrors]  = useState<ProfileErrors>({});
  const [profileError,   setProfileError]   = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profilePending, setProfilePending] = useState(false);
  const [imagePreview,   setImagePreview]   = useState<string | null>(null);
  const [imageFile,      setImageFile]      = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pwForm,      setPwForm]      = useState({ password: "", confirmPassword: "" });
  const [pwErrors,    setPwErrors]    = useState<PasswordErrors>({});
  const [pwError,     setPwError]     = useState("");
  const [pwSuccess,   setPwSuccess]   = useState("");
  const [pwPending,   setPwPending]   = useState(false);
  const [showPw,      setShowPw]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab,   setActiveTab]   = useState<"profile" | "password">("profile");

  useEffect(() => {
    if (user) {
      setForm({ firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "" });
      if (user.profileImage) setImagePreview(`${API_URL}${user.profileImage}`);
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
    setProfileError(""); setProfileSuccess("");
    const parsed = UpdateProfileSchema.safeParse(form);
    if (!parsed.success) {
      const errors: ProfileErrors = {};
      parsed.error.issues.forEach((i) => { const f = i.path[0] as keyof ProfileErrors; if (!errors[f]) errors[f] = i.message; });
      setProfileErrors(errors); return;
    }
    setProfilePending(true);
    const fd = new FormData();
    if (form.firstName) fd.append("firstName", form.firstName);
    if (form.lastName)  fd.append("lastName",  form.lastName);
    if (form.email)     fd.append("email",      form.email);
    if (imageFile)      fd.append("profileImage", imageFile);
    const result = await updateProfileAction(fd);
    setProfilePending(false);
    if (!result.success) { setProfileError(result.message || "Update failed"); return; }
    setProfileSuccess("Profile updated successfully.");
    refreshUser();
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwError(""); setPwSuccess("");
    const parsed = ChangePasswordSchema.safeParse(pwForm);
    if (!parsed.success) {
      const errors: PasswordErrors = {};
      parsed.error.issues.forEach((i) => { const f = i.path[0] as keyof PasswordErrors; if (!errors[f]) errors[f] = i.message; });
      setPwErrors(errors); return;
    }
    setPwPending(true);
    const result = await changePasswordAction(parsed.data);
    setPwPending(false);
    if (!result.success) { setPwError(result.message || "Failed"); return; }
    setPwSuccess("Password changed successfully.");
    setPwForm({ password: "", confirmPassword: "" });
  }

  const pwRules = [
    { rule: "At least 6 characters",  met: pwForm.password.length >= 6 },
    { rule: "One uppercase letter",    met: /[A-Z]/.test(pwForm.password) },
    { rule: "One number",              met: /[0-9]/.test(pwForm.password) },
    { rule: "Passwords match",         met: pwForm.password === pwForm.confirmPassword && pwForm.password.length > 0 },
  ];

  if (!user) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#FAFAF9" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #E8E2D9", borderTop: "2px solid #C9A96E", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .profile-input {
          width: 100%; height: 48px; padding: 0 14px;
          border: 1.5px solid #E8E2D9; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
          color: #1a1a1a; background: #fff; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          -webkit-appearance: none; box-sizing: border-box;
        }
        .profile-input:focus { border-color: #C9A96E; box-shadow: 0 0 0 3px rgba(201,169,110,0.12); }
        .profile-input.err { border-color: #C0392B; background: #FDF8F8; }
        .profile-input::placeholder { color: #C4BDB6; }
        .pw-wrap { position: relative; }
        .pw-wrap .profile-input { padding-right: 46px; }
        .pw-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9B9490; display: flex; padding: 0; transition: color 0.15s; }
        .pw-toggle:hover { color: #1a1a1a; }
        .tab-btn { background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; padding: 0.65rem 0; color: #9B9490; transition: all 0.18s; display: inline-flex; align-items: center; gap: 7px; }
        .tab-btn.active { color: #1a1a1a; border-bottom-color: #C9A96E; }
        .tab-btn:hover:not(.active) { color: #555; }
        .save-btn { height: 46px; padding: 0 28px; border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.18s; display: inline-flex; align-items: center; gap: 8px; background: #1A1A1A; color: #fff; }
        .save-btn:hover:not(:disabled) { background: #2d2d2d; }
        .save-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .field-label { display: block; font-size: 0.72rem; font-weight: 600; color: #555; margin-bottom: 0.4rem; letter-spacing: 0.06em; text-transform: uppercase; }
        .field-err { font-size: 0.7rem; color: #C0392B; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
        .avatar-wrap { position: relative; width: 92px; height: 92px; flex-shrink: 0; }
        .avatar-img { width: 92px; height: 92px; border-radius: 50%; object-fit: cover; border: 2.5px solid #E8E2D9; display: block; }
        .avatar-initials { width: 92px; height: 92px; border-radius: 50%; background: linear-gradient(135deg,#C9A96E,#e8c97a); display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; font-weight: 600; color: #fff; border: 2.5px solid #ffffff; }
        .avatar-edit-btn { position: absolute; bottom: 0; right: 0; width: 28px; height: 28px; border-radius: 50%; background: #1A1A1A; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; transition: background 0.15s; }
        .avatar-edit-btn:hover { background: #C9A96E; }
        .card { background: #fff; border-radius: 16px; border: 1px solid #EDEAE5; padding: 2rem; }
        .banner { display: flex; align-items: center; gap: 8px; border-radius: 8px; padding: 10px 14px; font-size: 0.8rem; margin-bottom: 1.25rem; }
        .banner.success { background: #F2FAF5; border: 1px solid rgba(39,174,96,0.25); color: #1e8449; }
        .banner.error   { background: #FDF8F8; border: 1px solid rgba(192,57,43,0.2);  color: #C0392B; }
      `}</style>

      {/* Top bar */}
      <div style={{ borderBottom: "1px solid #EDEAE5", background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "#9B9490", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#1a1a1a")}
            onMouseLeave={e => (e.currentTarget.style.color = "#9B9490")}
          >
            <IconArrowLeft /> Back to dashboard
          </Link>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontWeight: 600, color: "#1a1a1a", letterSpacing: "0.04em" }}>VillaBaas</span>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>

        {/* Header card */}
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.25rem", animation: "fadeIn 0.3s ease both" }}>
          <div className="avatar-wrap">
            {imageFile && imagePreview
              ? <img src={imagePreview} alt="avatar" className="avatar-img" />
              : (
                <div className="avatar-initials" style={{ fontSize: "1.7rem" }}>
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(124, 117, 117, 0.85)" strokeWidth="1.4">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              )
            }
            <div className="avatar-edit-btn" onClick={() => fileInputRef.current?.click()} title="Change photo">
              <IconCamera size={13} />
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={handleImageChange} />
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.55rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.15rem" }}>
              {user.firstName} {user.lastName}
            </h1>
            <p style={{ fontSize: "0.82rem", color: "#9B9490", marginBottom: "0.55rem" }}>{user.email}</p>
            <span style={{ display: "inline-block", fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B6914", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.28)", borderRadius: 100, padding: "3px 10px" }}>
              {user.role ?? "Member"}
            </span>
          </div>
        </div>

        {/* Tab nav */}
        <div style={{ display: "flex", gap: "2rem", borderBottom: "1px solid #EDEAE5", marginBottom: "1.5rem", paddingLeft: "0.1rem" }}>
          <button className={`tab-btn${activeTab === "profile" ? " active" : ""}`} onClick={() => setActiveTab("profile")}>
            <IconUser size={14} /> Profile details
          </button>
          <button className={`tab-btn${activeTab === "password" ? " active" : ""}`} onClick={() => setActiveTab("password")}>
            <IconLock size={14} /> Change password
          </button>
        </div>

        {/* Profile tab */}
        {activeTab === "profile" && (
          <div className="card" style={{ animation: "fadeIn 0.22s ease both" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.2rem" }}>Profile details</h2>
            <p style={{ fontSize: "0.8rem", color: "#9B9490", marginBottom: "1.75rem" }}>Update your name and email address.</p>

            {profileError   && <div className="banner error"><IconAlertCircle />{profileError}</div>}
            {profileSuccess && <div className="banner success"><IconCheck />{profileSuccess}</div>}

            <form onSubmit={handleProfileSubmit} noValidate>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="field-label">First name</label>
                  <input type="text" className={`profile-input${profileErrors.firstName ? " err" : ""}`} value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="First name" />
                  {profileErrors.firstName && <p className="field-err"><IconAlertCircle size={11} />{profileErrors.firstName}</p>}
                </div>
                <div>
                  <label className="field-label">Last name</label>
                  <input type="text" className={`profile-input${profileErrors.lastName ? " err" : ""}`} value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" />
                  {profileErrors.lastName && <p className="field-err"><IconAlertCircle size={11} />{profileErrors.lastName}</p>}
                </div>
              </div>
              <div style={{ marginBottom: "1.75rem" }}>
                <label className="field-label">Email address</label>
                <input type="email" className={`profile-input${profileErrors.email ? " err" : ""}`} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                {profileErrors.email && <p className="field-err"><IconAlertCircle size={11} />{profileErrors.email}</p>}
              </div>
              <div style={{ paddingTop: "1.25rem", borderTop: "1px solid #F0EDE8", display: "flex", alignItems: "center", gap: "1rem" }}>
                <button type="submit" className="save-btn" disabled={profilePending}>
                  {profilePending
                    ? <><div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", animation: "spin 0.7s linear infinite" }} />Saving…</>
                    : "Save changes"
                  }
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Password tab */}
        {activeTab === "password" && (
          <div className="card" style={{ animation: "fadeIn 0.22s ease both" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.2rem" }}>Change password</h2>
            <p style={{ fontSize: "0.8rem", color: "#9B9490", marginBottom: "1.75rem" }}>Choose a strong password with an uppercase letter and a number.</p>

            {pwError   && <div className="banner error"><IconAlertCircle />{pwError}</div>}
            {pwSuccess && <div className="banner success"><IconCheck />{pwSuccess}</div>}

            <form onSubmit={handlePasswordSubmit} noValidate>
              <div style={{ marginBottom: "1rem" }}>
                <label className="field-label">New password</label>
                <div className="pw-wrap">
                  <input type={showPw ? "text" : "password"} className={`profile-input${pwErrors.password ? " err" : ""}`} placeholder="Min 6 chars, 1 uppercase, 1 number" value={pwForm.password} onChange={e => setPwForm({ ...pwForm, password: e.target.value })} />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)} aria-label={showPw ? "Hide" : "Show"}><IconEye size={17} off={showPw} /></button>
                </div>
                {pwErrors.password && <p className="field-err"><IconAlertCircle size={11} />{pwErrors.password}</p>}
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label className="field-label">Confirm password</label>
                <div className="pw-wrap">
                  <input type={showConfirm ? "text" : "password"} className={`profile-input${pwErrors.confirmPassword ? " err" : ""}`} placeholder="Re-enter your new password" value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
                  <button type="button" className="pw-toggle" onClick={() => setShowConfirm(v => !v)} aria-label={showConfirm ? "Hide" : "Show"}><IconEye size={17} off={showConfirm} /></button>
                </div>
                {pwErrors.confirmPassword && <p className="field-err"><IconAlertCircle size={11} />{pwErrors.confirmPassword}</p>}
              </div>

              {/* Strength checklist */}
              <div style={{ background: "#FAFAF9", border: "1px solid #EDEAE5", borderRadius: 10, padding: "14px 16px", marginBottom: "1.75rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
                {pwRules.map(({ rule, met }) => (
                  <div key={rule} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, background: met ? "#27ae60" : "transparent", border: met ? "none" : "1.5px solid #D5CFC8", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", color: "#fff" }}>
                      {met && <IconCheck size={10} />}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: met ? "#27ae60" : "#9B9490", transition: "color 0.2s" }}>{rule}</span>
                  </div>
                ))}
              </div>

              <div style={{ paddingTop: "1.25rem", borderTop: "1px solid #F0EDE8" }}>
                <button type="submit" className="save-btn" disabled={pwPending}>
                  {pwPending
                    ? <><div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", animation: "spin 0.7s linear infinite" }} />Updating…</>
                    : "Update password"
                  }
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}