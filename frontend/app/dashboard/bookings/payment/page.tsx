"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EsewaPaymentScreen from "./EsewaPaymentScreen";
import { getVillaById } from "@/lib/data/villas";

type PaymentMethod = "esewa" | "khalti" | "card" | "cash";

const BRAND_RED = "#DA0B00";
const ESEWA_GREEN = "#60BB46";
const KHALTI_PURPLE = "#5C2D91";
const CARD_BLUE = "#1565C0";
const CASH_ORANGE = "#C2650A";

interface BookingSummary {
  villaName: string;
  location: string;
  image: string;
  nights: number;
  guests: number;
}

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
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-red-600">Villa not found</p>
        <button onClick={() => router.back()} className="text-sm underline text-gray-500">
          Go back
        </button>
      </div>
    );
  }

  const booking: BookingSummary = {
    villaName: villa.name,
    location: villa.location,
    image: villa.img,
    nights: nightsBetween(checkIn, checkOut),
    guests,
  };

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
    // TODO: call your backend to mark the booking as paid, e.g.
    // await fetch(`${API_URL}/bookings/${bookingId}`, { method: "PATCH", body: JSON.stringify({ paymentStatus: "completed" }) });
    router.push("/dashboard/bookings/success");
  }

  if (showEsewaScreen) {
    return (
      <EsewaPaymentScreen
        totalPrice={totalPrice}
        villaName={booking.villaName}
        onBack={() => setShowEsewaScreen(false)}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-['DM_Sans',sans-serif]">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button onClick={() => router.back()} aria-label="Back" className="text-[#1A1A1A]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="font-['Playfair_Display',serif] text-2xl font-semibold text-[#1A1A1A]">Payment</h1>
      </div>

      <div className="max-w-xl mx-auto px-4 pb-32 pt-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={booking.image}
            alt={booking.villaName}
            className="w-[72px] h-[72px] rounded-[10px] object-cover bg-gray-200"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1A1A1A] truncate">{booking.villaName}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{booking.location}</p>
            <p className="text-[11px] text-gray-500 mt-1.5">
              {booking.nights} nights · {booking.guests} guests
            </p>
            <p className="text-sm font-bold mt-1" style={{ color: BRAND_RED }}>
              {totalPrice}
            </p>
          </div>
        </div>

        <h2 className="mt-6 mb-2.5 text-lg font-semibold text-[#1A1A1A]">Payment Method</h2>

        <div className="space-y-2.5">
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

        <div
          className="mt-6 rounded-2xl p-4 flex items-center justify-between border"
          style={{ backgroundColor: `${BRAND_RED}0F`, borderColor: `${BRAND_RED}33` }}
        >
          <span className="text-sm text-[#1A1A1A]">Total Amount</span>
          <span className="text-lg font-bold" style={{ color: BRAND_RED }}>
            {totalPrice}
          </span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 pt-3 pb-6 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full h-[52px] rounded-2xl text-white text-base font-bold disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            style={{
              backgroundColor:
                selected === "esewa" ? ESEWA_GREEN : selected === "khalti" ? KHALTI_PURPLE : BRAND_RED,
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
      className="w-full bg-white rounded-[14px] p-4 flex items-center gap-3.5 text-left transition-all"
      style={{
        border: `${selected ? 2 : 1}px solid ${selected ? color : "#E5E7EB"}`,
        boxShadow: selected ? `0 2px 8px ${color}1F` : "none",
      }}
    >
      <div
        className="w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}1A` }}
      >
        <span className="text-xl">{emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#1A1A1A]">{label}</span>
          {badge && (
            <span
              className="text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${color}1F`, color }}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>
      </div>
      <div
        className="w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center transition-colors"
        style={{
          backgroundColor: selected ? color : "transparent",
          border: `2px solid ${selected ? color : "#D1D5DB"}`,
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
  return (
    <div className="bg-white rounded-[14px] p-4 border border-gray-200 space-y-3">
      <div>
        <label className="text-xs text-gray-500">Card Number</label>
        <input
          inputMode="numeric"
          placeholder="1234 5678 9012 3456"
          className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2"
          style={{ ["--tw-ring-color" as string]: BRAND_RED }}
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-500">Expiry</label>
          <input
            placeholder="MM/YY"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2"
            style={{ ["--tw-ring-color" as string]: BRAND_RED }}
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500">CVV</label>
          <input
            type="password"
            placeholder="123"
            className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2"
            style={{ ["--tw-ring-color" as string]: BRAND_RED }}
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500">Cardholder Name</label>
        <input
          placeholder="As on card"
          className="mt-1 w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2"
          style={{ ["--tw-ring-color" as string]: BRAND_RED }}
        />
      </div>
    </div>
  );
}