"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyKhaltiPayment } from "@/lib/api/bookings-api";

const BRAND_RED = "#DA0B00";

type VerifyState = "verifying" | "success" | "failed" | "pending";

export default function KhaltiReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerifyState>("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    const bookingId = searchParams.get("purchase_order_id"); // Khalti echoes this back
    const statusParam = searchParams.get("status");

    if (!pidx || !bookingId) {
      setState("failed");
      setMessage("Missing payment reference from Khalti.");
      return;
    }

    if (statusParam === "User canceled") {
      setState("failed");
      setMessage("Payment was canceled.");
      return;
    }

    async function verify() {
      try {
        const result = await verifyKhaltiPayment(pidx!, bookingId!);

        if (result._id) {
          // Booking is confirmed paid — result IS the updated booking.
          setState("success");
          router.push(`/dashboard/bookings/success?bookingId=${result._id}`);
          return;
        }

        if (result.status === "Pending" || result.status === "Initiated") {
          setState("pending");
          setMessage("Your payment is still processing. This can take a moment — please don't close this page.");
        } else {
          setState("failed");
          setMessage(`Payment ${String(result.status || "could not be confirmed").toLowerCase()}.`);
        }
      } catch (err) {
        setState("failed");
        setMessage(err instanceof Error ? err.message : "Could not verify payment");
      }
    }

    verify();
  }, [searchParams, router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "2rem" }}>
      {state === "verifying" && (
        <>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #E5E7EB", borderTopColor: "#5C2D91", animation: "khalti-spin 0.8s linear infinite" }} />
          <p style={{ marginTop: 20, fontSize: "0.95rem", color: "#555" }}>Confirming your payment with Khalti...</p>
        </>
      )}

      {state === "pending" && (
        <p style={{ fontSize: "1rem", color: "#92400E", textAlign: "center", maxWidth: 360 }}>{message}</p>
      )}

      {state === "failed" && (
        <>
          <p style={{ fontSize: "1rem", color: BRAND_RED, textAlign: "center", maxWidth: 360, marginBottom: "1.5rem" }}>{message}</p>
          <button
            onClick={() => router.push("/dashboard/bookings")}
            style={{ padding: "10px 24px", background: BRAND_RED, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
          >
            Back to Bookings
          </button>
        </>
      )}

      <style>{`
        @keyframes khalti-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}