"use client";

import React, { useState } from "react";

const ESEWA_PRODUCT_CODE = "EPAYTEST";
const ESEWA_TEST_ID = "9806800001";
const ESEWA_TEST_PIN = "1122";

const ESEWA_GREEN = "#60BB46";
const ESEWA_DARK = "#3A7D1E";

type Step = "form" | "processing" | "success";

interface EsewaPaymentScreenProps {
  totalPrice: string;
  villaName: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function EsewaPaymentScreen({
  totalPrice,
  villaName,
  onSuccess,
  onBack,
}: EsewaPaymentScreenProps) {
  const [esewaId, setEsewaId] = useState("");
  const [pin, setPin] = useState("");
  const [obscurePin, setObscurePin] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("form");

  async function handlePay() {
    const id = esewaId.trim();
    const pinValue = pin.trim();

    if (!id || !pinValue) {
      setError("Please enter your eSewa ID and PIN");
      return;
    }
    if (id !== ESEWA_TEST_ID) {
      setError(`eSewa ID not found. Use test ID: ${ESEWA_TEST_ID}`);
      return;
    }
    if (pinValue !== ESEWA_TEST_PIN) {
      setError(`Incorrect PIN. Use test PIN: ${ESEWA_TEST_PIN}`);
      return;
    }

    setError(null);
    setIsProcessing(true);
    setStep("processing");

    await new Promise((r) => setTimeout(r, 800));
    setStep("success");
    await new Promise((r) => setTimeout(r, 1000));

    setIsProcessing(false);
    await new Promise((r) => setTimeout(r, 600));
    onSuccess();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px 10px 40px",
    borderRadius: 10,
    border: "1.5px solid #d1d5db",
    background: "#fafafa",
    fontSize: "0.9rem",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── eSewa Header ─────────────────────────────────────────── */}
      <div style={{ width: "100%", padding: "1.5rem 1rem 1.25rem", background: ESEWA_GREEN }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: ESEWA_GREEN, fontSize: "1.35rem", fontWeight: 900 }}>e</span>
            </div>
            <span style={{ color: "#fff", fontSize: "1.35rem", fontWeight: 700, letterSpacing: "0.02em" }}>eSewa</span>
          </div>
          <div style={{ width: 22 }} />
        </div>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>Total Amount</p>
          <p style={{ color: "#fff", fontSize: "1.9rem", fontWeight: 800, marginTop: 4 }}>{totalPrice}</p>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem", marginTop: 4 }}>{villaName}</p>
        </div>
      </div>

      {/* ── Sandbox badge ────────────────────────────────────────── */}
      <div style={{ width: "100%", padding: "6px 0", background: "#FEF3C7", textAlign: "center" }}>
        <span style={{ color: "#92400E", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.02em" }}>
          SANDBOX MODE — Use test credentials below
        </span>
      </div>

      {step === "processing" ? (
        <ProcessingView />
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {/* ── Test credentials hint ─────────────────────────────── */}
          <div style={{ borderRadius: 10, padding: "0.85rem", background: `${ESEWA_GREEN}14`, border: `1px solid ${ESEWA_GREEN}4D` }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: ESEWA_DARK }}>Test Credentials</p>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
              <CredentialRow label="eSewa ID" value={ESEWA_TEST_ID} />
              <CredentialRow label="PIN" value={ESEWA_TEST_PIN} />
              <CredentialRow label="Product Code" value={ESEWA_PRODUCT_CODE} />
            </div>
          </div>

          {/* ── eSewa ID field ─────────────────────────────────────── */}
          <label style={{ display: "block", marginTop: 24, fontSize: "0.8rem", fontWeight: 600, color: "#333" }}>
            eSewa ID / Mobile Number
          </label>
          <div style={{ position: "relative", marginTop: 8 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: ESEWA_GREEN, display: "flex" }}>
              <PhoneIcon />
            </span>
            <input
              value={esewaId}
              onChange={(e) => setEsewaId(e.target.value.replace(/\D/g, "").slice(0, 10))}
              inputMode="numeric"
              placeholder="Enter your eSewa ID"
              style={inputStyle}
            />
          </div>

          {/* ── PIN field ──────────────────────────────────────────── */}
          <label style={{ display: "block", marginTop: 16, fontSize: "0.8rem", fontWeight: 600, color: "#333" }}>eSewa PIN</label>
          <div style={{ position: "relative", marginTop: 8 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: ESEWA_GREEN, display: "flex" }}>
              <LockIcon />
            </span>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              type={obscurePin ? "password" : "text"}
              inputMode="numeric"
              placeholder="Enter your PIN"
              style={{ ...inputStyle, paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setObscurePin(!obscurePin)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}
            >
              {obscurePin ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>

          {error && (
            <div style={{ marginTop: 10, display: "flex", alignItems: "flex-start", gap: 8, padding: "10px", borderRadius: 8, background: "#FEF2F2", border: "1px solid #FECACA" }}>
              <span style={{ color: "#DC2626", marginTop: 2, display: "flex" }}>
                <ErrorIcon />
              </span>
              <p style={{ fontSize: "0.75rem", color: "#B91C1C" }}>{error}</p>
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={isProcessing}
            style={{
              width: "100%",
              height: 52,
              marginTop: 28,
              borderRadius: 12,
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 700,
              border: "none",
              cursor: isProcessing ? "not-allowed" : "pointer",
              opacity: isProcessing ? 0.7 : 1,
              background: ESEWA_GREEN,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {isProcessing ? "Processing..." : `Pay ${totalPrice}`}
          </button>

          <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#9ca3af" }}>
            <LockIcon small />
            <span style={{ fontSize: "0.7rem" }}>Secured by eSewa Payment Gateway</span>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

function ProcessingView() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${ESEWA_GREEN}1A`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: `3px solid ${ESEWA_GREEN}`,
            borderTopColor: "transparent",
            animation: "esewa-spin 0.8s linear infinite",
          }}
        />
      </div>
      <p style={{ marginTop: 24, fontSize: "1rem", fontWeight: 600, color: "#333" }}>Processing Payment...</p>
      <p style={{ marginTop: 8, fontSize: "0.8rem", color: "#9ca3af" }}>Please do not close this window</p>
      <style>{`
        @keyframes esewa-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function CredentialRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", fontSize: "0.75rem" }}>
      <span style={{ color: "#555" }}>{label}: </span>
      <span style={{ fontWeight: 700, fontFamily: "monospace", marginLeft: 4, color: ESEWA_DARK }}>{value}</span>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <line x1="11" y1="18" x2="13" y2="18" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon({ small }: { small?: boolean }) {
  const size = small ? 12 : 20;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a18.5 18.5 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 7 11 7a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}