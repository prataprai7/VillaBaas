"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EsewaPaymentScreen from "./EsewaPaymentScreen";
import { getVillaById } from "@/lib/data/villas";
import { addBooking, genBookingId } from "@/lib/data/bookings-store";

type PaymentMethod = "esewa" | "khalti" | "card" | "cash";

const BRAND_RED = "#DA0B00";
const ESEWA_GREEN = "#60BB46";
const KHALTI_PURPLE = "#5C2D91";
const CARD_BLUE = "#1565C0";
const CASH_ORANGE = "#C2650A";

function nightsBetween(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const villaId = searchParams.get("villaId");
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const guests = Number(searchParams.get("guests") ?? "1");
  const total = Number(searchParams.get("total") ?? "0");

  const [selected, setSelected] = useState<PaymentMethod>("esewa");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEsewaScreen, setShowEsewaScreen] = useState(false);

  const villa = villaId ? getVillaById(Number(villaId)) : undefined;

  if (!villa) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ fontSize: "1.1rem", color: "#aaa", marginBottom: "1rem" }}>Villa not found</p>
        <button onClick={() => router.back()} style={{ padding: "10px 24px", background: BRAND_RED, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          Go back
        </button>
      </div>
    );
  }

  // Captured here, after the guard, so closures below (handlePay, handleSuccess)
  // don't hit TS's "possibly undefined" limitation on closured variables.
  const currentVilla = villa;

  const nights = nightsBetween(checkIn, checkOut);
  const totalPrice = `NPR ${total.toLocaleString()}`;

  async function handlePay() {
    if (selected === "esewa") {
      setShowEsewaScreen(true);
      return;
    }
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsProcessing(false);
    await handleSuccess();
  }

  async function handleSuccess() {
    const bookingId = genBookingId();
    addBooking({
      id: bookingId,
      villaId: currentVilla.id,
      villaName: currentVilla.name,
      location: currentVilla.location,
      img: currentVilla.img,
      checkIn,
      checkOut,
      guests,
      nights,
      totalPrice: total,
      status: "upcoming",
      paymentMethod: selected,
      createdAt: new Date().toISOString(),
    });
    router.push(`/dashboard/bookings/success?bookingId=${bookingId}`);
  }

  if (showEsewaScreen) {
    return (
      <EsewaPaymentScreen
        totalPrice={totalPrice}
        villaName={currentVilla.name}
        onBack={() => setShowEsewaScreen(false)}
        onSuccess={handleSuccess}
      />
    );
  }

  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    padding: "1.25rem",
    border: "1px solid #f0f0f0",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#EEEEEE", fontFamily: "'DM Sans', sans-serif", color: "#1C1C1C" }}>
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "1rem 4vw", background: "#fff", borderBottom: "1px solid #f0f0f0" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1C1C1C" strokeWidth="2.2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#1C1C1C" }}>Payment</h1>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 4vw 8rem" }}>
        {/* ── Order summary ───────────────────────────────────── */}
        <div style={{ ...card, display: "flex", gap: 14 }}>
          <img
            src={currentVilla.img}
            alt={currentVilla.name}
            style={{ width: 76, height: 76, borderRadius: 12, objectFit: "cover", background: "#eee", flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1C1C1C" }}>{currentVilla.name}</p>
            <p style={{ fontSize: "0.8rem", color: "#888", marginTop: 2 }}>{currentVilla.location}</p>
            <p style={{ fontSize: "0.75rem", color: "#aaa", marginTop: 6 }}>
              {nights} nights · {guests} guests
            </p>
            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: BRAND_RED, marginTop: 4 }}>{totalPrice}</p>
          </div>
        </div>

        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#1C1C1C", margin: "1.5rem 0 0.75rem" }}>
          Payment Method
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <PaymentTile
            selected={selected === "esewa"}
            onClick={() => setSelected("esewa")}
            color={ESEWA_GREEN}
            label="eSewa"
            subtitle="Pay via eSewa digital wallet"
            emoji="💚"
            badge="Recommended"
          />
          <PaymentTile
            selected={selected === "khalti"}
            onClick={() => setSelected("khalti")}
            color={KHALTI_PURPLE}
            label="Khalti"
            subtitle="Pay via Khalti digital wallet"
            emoji="💜"
          />
          <PaymentTile
            selected={selected === "card"}
            onClick={() => setSelected("card")}
            color={CARD_BLUE}
            label="Credit / Debit Card"
            subtitle="Visa, Mastercard accepted"
            emoji="💳"
          />
          {selected === "card" && <CardForm />}
          <PaymentTile
            selected={selected === "cash"}
            onClick={() => setSelected("cash")}
            color={CASH_ORANGE}
            label="Pay at Property"
            subtitle="Cash payment on arrival"
            emoji="🏡"
          />
        </div>

        {/* ── Total reminder ───────────────────────────────────── */}
        <div style={{ marginTop: 24, borderRadius: 16, padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FFF5F5", border: `1px solid rgba(218,11,0,0.2)` }}>
          <span style={{ fontSize: "0.9rem", color: "#1C1C1C" }}>Total Amount</span>
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: BRAND_RED }}>{totalPrice}</span>
        </div>
      </div>

      {/* ── Pay button (fixed bottom) ───────────────────────────── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", padding: "0.75rem 4vw 1.5rem", boxShadow: "0 -4px 16px rgba(0,0,0,0.08)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <button
            onClick={handlePay}
            disabled={isProcessing}
            style={{
              width: "100%",
              height: 52,
              borderRadius: 14,
              color: "#fff",
              fontSize: "0.95rem",
              fontWeight: 700,
              border: "none",
              cursor: isProcessing ? "not-allowed" : "pointer",
              opacity: isProcessing ? 0.7 : 1,
              fontFamily: "'DM Sans', sans-serif",
              background: selected === "esewa" ? ESEWA_GREEN : selected === "khalti" ? KHALTI_PURPLE : BRAND_RED,
            }}
          >
            {isProcessing
              ? "Processing..."
              : selected === "cash"
              ? "Confirm Booking"
              : selected === "esewa"
              ? "Continue with eSewa"
              : `Pay ${totalPrice}`}
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

function PaymentTile({
  selected,
  onClick,
  color,
  label,
  subtitle,
  emoji,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  color: string;
  label: string;
  subtitle: string;
  emoji: string;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: "#fff",
        borderRadius: 14,
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        gap: 14,
        textAlign: "left",
        cursor: "pointer",
        border: `${selected ? 2 : 1}px solid ${selected ? color : "#e5e5e5"}`,
        boxShadow: selected ? `0 2px 10px ${color}22` : "none",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}1A`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: "1.3rem" }}>{emoji}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.9rem", color: "#1C1C1C" }}>{label}</span>
          {badge && (
            <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.03em", padding: "2px 7px", borderRadius: 5, background: `${color}1F`, color }}>
              {badge}
            </span>
          )}
        </div>
        <p style={{ fontSize: "0.78rem", color: "#888", marginTop: 3 }}>{subtitle}</p>
      </div>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: selected ? color : "transparent",
          border: `2px solid ${selected ? color : "#d1d5db"}`,
        }}
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </button>
  );
}

function CardForm() {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    marginTop: 6,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1.5px solid #e5e5e5",
    fontSize: "0.85rem",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
  };
  const labelStyle: React.CSSProperties = { fontSize: "0.75rem", color: "#888" };

  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "1rem", border: "1px solid #e5e5e5", display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label style={labelStyle}>Card Number</label>
        <input placeholder="1234 5678 9012 3456" style={inputStyle} />
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Expiry</label>
          <input placeholder="MM/YY" style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>CVV</label>
          <input type="password" placeholder="123" style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Cardholder Name</label>
        <input placeholder="As on card" style={inputStyle} />
      </div>
    </div>
  );
}