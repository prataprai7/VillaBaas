"use client";

import { useState } from "react";

// ── eSewa test credentials ──────────────────────────────────────────────
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

    // Sandbox validation
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

    // Simulate processing
    await new Promise((r) => setTimeout(r, 800));
    setStep("success");
    await new Promise((r) => setTimeout(r, 1000));

    setIsProcessing(false);
    await new Promise((r) => setTimeout(r, 600));
    onSuccess();
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-['DM_Sans',sans-serif]">
      {/* ── eSewa Header ─────────────────────────────────────────── */}
      <div className="w-full px-4 pt-6 pb-5" style={{ backgroundColor: ESEWA_GREEN }}>
        <div className="flex items-center">
          <button onClick={onBack} aria-label="Back" className="text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
              <span style={{ color: ESEWA_GREEN }} className="text-xl font-black">e</span>
            </div>
            <span className="text-white text-xl font-bold tracking-wide">eSewa</span>
          </div>
          <div className="w-[22px]" />
        </div>

        <div className="mt-4 text-center">
          <p className="text-white/80 text-[13px]">Total Amount</p>
          <p className="text-white text-3xl font-extrabold mt-1">{totalPrice}</p>
          <p className="text-white/75 text-xs mt-1">{villaName}</p>
        </div>
      </div>

      {/* ── Sandbox badge ────────────────────────────────────────── */}
      <div className="w-full py-1.5 bg-orange-100 text-center">
        <span className="text-orange-800 text-[11px] font-semibold tracking-wide">
          SANDBOX MODE — Use test credentials below
        </span>
      </div>

      {step === "processing" ? (
        <ProcessingView />
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          {/* ── Test credentials hint ─────────────────────────────── */}
          <div
            className="rounded-[10px] p-3.5 border"
            style={{ backgroundColor: `${ESEWA_GREEN}14`, borderColor: `${ESEWA_GREEN}4D` }}
          >
            <p className="text-xs font-bold" style={{ color: ESEWA_DARK }}>
              Test Credentials
            </p>
            <div className="mt-1.5 space-y-0.5">
              <CredentialRow label="eSewa ID" value={ESEWA_TEST_ID} />
              <CredentialRow label="PIN" value={ESEWA_TEST_PIN} />
              <CredentialRow label="Product Code" value={ESEWA_PRODUCT_CODE} />
            </div>
          </div>

          {/* ── eSewa ID field ─────────────────────────────────────── */}
          <label className="block mt-6 text-[13px] font-semibold text-[#333]">
            eSewa ID / Mobile Number
          </label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: ESEWA_GREEN }}>
              <PhoneIcon />
            </span>
            <input
              value={esewaId}
              onChange={(e) => setEsewaId(e.target.value.replace(/\D/g, "").slice(0, 10))}
              inputMode="numeric"
              placeholder="Enter your eSewa ID"
              className="w-full pl-10 pr-3 py-2.5 rounded-[10px] bg-gray-50 border border-gray-300 text-sm outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: ESEWA_GREEN }}
            />
          </div>

          {/* ── PIN field ──────────────────────────────────────────── */}
          <label className="block mt-4 text-[13px] font-semibold text-[#333]">eSewa PIN</label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: ESEWA_GREEN }}>
              <LockIcon />
            </span>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              type={obscurePin ? "password" : "text"}
              inputMode="numeric"
              placeholder="Enter your PIN"
              className="w-full pl-10 pr-10 py-2.5 rounded-[10px] bg-gray-50 border border-gray-300 text-sm outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as string]: ESEWA_GREEN }}
            />
            <button
              type="button"
              onClick={() => setObscurePin(!obscurePin)}
              aria-label={obscurePin ? "Show PIN" : "Hide PIN"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {obscurePin ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>

          {error && (
            <div className="mt-2.5 flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200">
              <span className="text-red-600 mt-0.5">
                <ErrorIcon />
              </span>
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full h-[52px] mt-7 rounded-xl text-white text-base font-bold disabled:cursor-not-allowed disabled:opacity-70"
            style={{ backgroundColor: ESEWA_GREEN }}
          >
            {isProcessing ? "Processing..." : `Pay ${totalPrice}`}
          </button>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-gray-500">
            <LockIcon small />
            <span className="text-[11px]">Secured by eSewa Payment Gateway</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ProcessingView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${ESEWA_GREEN}1A` }}
      >
        <div
          className="w-8 h-8 rounded-full border-[3px] border-t-transparent animate-spin"
          style={{ borderColor: ESEWA_GREEN, borderTopColor: "transparent" }}
        />
      </div>
      <p className="mt-6 text-base font-semibold text-[#333]">Processing Payment...</p>
      <p className="mt-2 text-[13px] text-gray-500">Please do not close this window</p>
    </div>
  );
}

function CredentialRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex text-xs">
      <span className="text-[#555]">{label}: </span>
      <span className="font-bold font-mono ml-1" style={{ color: ESEWA_DARK }}>
        {value}
      </span>
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