"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";
const BRAND_RED = "#DA0B00";

const EmailSchema = z.object({
  email: z.string().email("Invalid email"),
});

function IconMail({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
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

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent]       = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsed = EmailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid email");
      return;
    }

    setPending(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data.email }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.message || "Something went wrong");
      }
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
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
        .fp-input {
          width: 100%; height: 48px; padding: 0 14px 0 42px;
          border: 1.5px solid #e5e5e5; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
          color: #1C1C1C; background: #fff; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          box-sizing: border-box;
        }
        .fp-input:focus { border-color: ${BRAND_RED}; box-shadow: 0 0 0 3px rgba(218,11,0,0.1); }
        .fp-input.err { border-color: #C0392B; background: #FDF8F8; }
        .fp-btn { width: 100%; height: 48px; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: opacity 0.18s; background: ${BRAND_RED}; color: #fff; letter-spacing: 0.02em; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .fp-btn:hover:not(:disabled) { opacity: 0.88; }
        .fp-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .banner { display: flex; align-items: center; gap: 8px; border-radius: 10px; padding: 10px 14px; font-size: 0.8rem; margin-bottom: 1.25rem; }
        .banner.error { background: #FDF8F8; border: 1px solid rgba(192,57,43,0.2); color: #C0392B; }
        .banner.success { background: #F2FAF5; border: 1px solid rgba(39,174,96,0.25); color: #1e8449; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420, animation: "fadeIn 0.3s ease both" }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0", padding: "2.5rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: BRAND_RED, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="1.8">
                <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"/>
                <path d="M9 22V12h6v10"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#1C1C1C", marginBottom: "0.4rem" }}>
              Forgot your password?
            </h1>
            <p style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.6 }}>
              Enter your email and we'll send you a link to reset it.
            </p>
          </div>

          {sent ? (
            <div>
              <div className="banner success">
                <IconCheck />
                If an account exists for that email, a reset link is on its way.
              </div>
              <p style={{ fontSize: "0.8rem", color: "#888", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                Check your inbox (and spam folder) for an email from VillaBaas. The link expires in 15 minutes.
              </p>
              <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: BRAND_RED, textDecoration: "none", fontWeight: 600 }}>
                <IconArrowLeft /> Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {error && <div className="banner error"><IconAlertCircle />{error}</div>}

              <div style={{ marginBottom: "1.5rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }}>
                  <IconMail size={16} />
                </span>
                <input
                  type="email"
                  className={`fp-input${error ? " err" : ""}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  autoFocus
                />
              </div>

              <button type="submit" className="fp-btn" disabled={pending}>
                {pending
                  ? <><div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", animation: "spin 0.7s linear infinite" }} />Sending…</>
                  : "Send reset link"
                }
              </button>

              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "#888", textDecoration: "none" }}>
                  <IconArrowLeft size={14} /> Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}