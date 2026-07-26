"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";
const BRAND_RED = "#DA0B00";

const ResetSchema = z
  .object({
    password: z.string().min(6, "Min 6 characters").regex(/[A-Z]/, "Need uppercase").regex(/[0-9]/, "Need number"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormErrors = { password?: string; confirmPassword?: string };

function IconLock({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
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
function IconAlertCircle({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [form, setForm]       = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors]   = useState<FormErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone]       = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const rules = [
    { rule: "At least 6 characters", met: form.password.length >= 6 },
    { rule: "One uppercase letter",  met: /[A-Z]/.test(form.password) },
    { rule: "One number",            met: /[0-9]/.test(form.password) },
    { rule: "Passwords match",       met: form.password === form.confirmPassword && form.password.length > 0 },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");

    const parsed = ResetSchema.safeParse(form);
    if (!parsed.success) {
      const errs: FormErrors = {};
      parsed.error.issues.forEach(i => {
        const f = i.path[0] as keyof FormErrors;
        if (!errs[f]) errs[f] = i.message;
      });
      setErrors(errs);
      return;
    }

    setPending(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.message || "This reset link is invalid or has expired.");
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      setGlobalError(err.message || "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#EEEEEE", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .rp-input { width: 100%; height: 48px; padding: 0 46px 0 14px; border: 1.5px solid #e5e5e5; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: #1C1C1C; background: #fff; outline: none; transition: border-color 0.18s, box-shadow 0.18s; box-sizing: border-box; }
        .rp-input:focus { border-color: ${BRAND_RED}; box-shadow: 0 0 0 3px rgba(218,11,0,0.1); }
        .rp-input.err { border-color: #C0392B; background: #FDF8F8; }
        .rp-wrap { position: relative; }
        .rp-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #aaa; display: flex; padding: 0; }
        .rp-toggle:hover { color: #1C1C1C; }
        .rp-btn { width: 100%; height: 48px; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: opacity 0.18s; background: ${BRAND_RED}; color: #fff; letter-spacing: 0.02em; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .rp-btn:hover:not(:disabled) { opacity: 0.88; }
        .rp-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .field-label { display: block; font-size: 0.72rem; font-weight: 600; color: #555; margin-bottom: 0.4rem; letter-spacing: 0.06em; text-transform: uppercase; }
        .field-err { font-size: 0.7rem; color: #C0392B; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
        .banner { display: flex; align-items: center; gap: 8px; border-radius: 10px; padding: 10px 14px; font-size: 0.8rem; margin-bottom: 1.25rem; }
        .banner.error { background: #FDF8F8; border: 1px solid rgba(192,57,43,0.2); color: #C0392B; }
        .banner.success { background: #F2FAF5; border: 1px solid rgba(39,174,96,0.25); color: #1e8449; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 440, animation: "fadeIn 0.3s ease both" }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0", padding: "2.5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: BRAND_RED, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <IconLock size={20} />
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#1C1C1C", marginBottom: "0.4rem" }}>
              Set a new password
            </h1>
            <p style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.6 }}>
              Choose a strong password for your VillaBaas account.
            </p>
          </div>

          {done ? (
            <div className="banner success">
              <IconCheck />
              Password reset! Redirecting you to login…
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {globalError && <div className="banner error"><IconAlertCircle />{globalError}</div>}

              <div style={{ marginBottom: "1rem" }}>
                <label className="field-label">New password</label>
                <div className="rp-wrap">
                  <input
                    type={showPw ? "text" : "password"}
                    className={`rp-input${errors.password ? " err" : ""}`}
                    placeholder="Min 6 chars, 1 uppercase, 1 number"
                    value={form.password}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: undefined }); }}
                  />
                  <button type="button" className="rp-toggle" onClick={() => setShowPw(v => !v)} aria-label={showPw ? "Hide" : "Show"}>
                    <IconEye size={17} off={showPw} />
                  </button>
                </div>
                {errors.password && <p className="field-err"><IconAlertCircle size={11} />{errors.password}</p>}
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label className="field-label">Confirm password</label>
                <div className="rp-wrap">
                  <input
                    type={showConfirm ? "text" : "password"}
                    className={`rp-input${errors.confirmPassword ? " err" : ""}`}
                    placeholder="Re-enter your new password"
                    value={form.confirmPassword}
                    onChange={e => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: undefined }); }}
                  />
                  <button type="button" className="rp-toggle" onClick={() => setShowConfirm(v => !v)} aria-label={showConfirm ? "Hide" : "Show"}>
                    <IconEye size={17} off={showConfirm} />
                  </button>
                </div>
                {errors.confirmPassword && <p className="field-err"><IconAlertCircle size={11} />{errors.confirmPassword}</p>}
              </div>

              <div style={{ background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 10, padding: "14px 16px", marginBottom: "1.75rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
                {rules.map(({ rule, met }) => (
                  <div key={rule} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, background: met ? "#27ae60" : "transparent", border: met ? "none" : "1.5px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      {met && <IconCheck size={10} />}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: met ? "#27ae60" : "#aaa" }}>{rule}</span>
                  </div>
                ))}
              </div>

              <button type="submit" className="rp-btn" disabled={pending}>
                {pending
                  ? <><div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", animation: "spin 0.7s linear infinite" }} />Resetting…</>
                  : "Reset password"
                }
              </button>

              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <Link href="/login" style={{ fontSize: "0.8rem", color: "#888", textDecoration: "none" }}>
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}