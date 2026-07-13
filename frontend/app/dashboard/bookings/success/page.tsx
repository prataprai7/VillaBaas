"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getTokenCookie } from "@/lib/api/cookies";

const API_URL   = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";
const BRAND_RED = "#DA0B00";

const VILLAS: Record<number, { name: string; location: string; img: string }> = {
  1:  { name: "Methlang Villa",       location: "Lakeside, Pokhara, Gandaki",        img: "https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=800&q=85" },
  2:  { name: "The Hideout Villa",    location: "Fewa Lakeside, Pokhara, Gandaki",   img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=85" },
  3:  { name: "Fewa Lake Retreat",    location: "Lakeside, Pokhara, Gandaki",        img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=85" },
  4:  { name: "The Pipal Tree",       location: "Patan Durbar, Lalitpur, Bagmati",   img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=85" },
  5:  { name: "Villa De Amore",       location: "Bhaktapur Durbar, Bagmati",         img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=85" },
  6:  { name: "Archid Villa",         location: "Nagarkot Hill, Bhaktapur, Bagmati", img: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=85" },
  7:  { name: "Mustang Stone House",  location: "Lo Manthang, Upper Mustang",        img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85" },
  8:  { name: "Chitwan Safari Lodge", location: "Sauraha, Chitwan, Narayani",        img: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=85" },
  9:  { name: "Lumbini Zen Villa",    location: "Lumbini Peace Zone, Rupandehi",     img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=85" },
  10: { name: "Ilam Tea Garden Villa",location: "Ilam Bazaar, Ilam, Province 1",     img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=85" },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" });
}

function genBookingId() {
  return "VB" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function InfoBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div style={{
      flex: 1, background: "#EEEEEE", borderRadius: 12,
      padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
    }}>
      <div style={{ flexShrink: 0, color: BRAND_RED }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: "0.62rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1C1C1C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();

  const villaId  = Number(searchParams.get("villaId")  || 1);
  const checkIn  = searchParams.get("checkIn")  || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests   = Number(searchParams.get("guests")   || 1);
  const total    = Number(searchParams.get("total")    || 0);

  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1;

  const villa     = VILLAS[villaId];
  const bookingId = useState(() => genBookingId())[0];
  const token     = getTokenCookie(); // available for future API calls

  // When backend booking endpoint is ready, fetch booking details using token:
  // useEffect(() => {
  //   const id = searchParams.get("bookingId");
  //   if (!id || !token) return;
  //   fetch(`${API_URL}/api/v1/bookings/${id}`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   }).then(r => r.json()).then(d => { /* populate from d.data */ });
  // }, [token]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [animate,      setAnimate]      = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarSrc   = user?.profileImage ? `${API_URL}${user.profileImage}` : null;

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#EEEEEE", fontFamily: "'DM Sans', sans-serif", color: "#1C1C1C", margin: 0, padding: 0 }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 300,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.9rem 4vw",
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid #ebebeb",
        boxShadow: "0 1px 16px rgba(0,0,0,0.06)",
      }}>
        <a href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: BRAND_RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="1.8">
              <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"/>
              <path d="M9 22V12h6v10"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700, color: "#1C1C1C" }}>VillaBaas</span>
        </a>

        <div style={{ display: "flex", gap: "2rem" }}>
          {[
            { label: "Home",     href: "/dashboard" },
            { label: "Villas",   href: "/dashboard/villas" },
            { label: "Bookings", href: "/dashboard/bookings" },
            { label: "About",    href: "#" },
          ].map(l => (
            <a key={l.label} href={l.href} style={{ fontSize: "0.88rem", color: "#888", fontWeight: 400, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#1C1C1C")}
              onMouseLeave={e => (e.currentTarget.style.color = "#888")}
            >{l.label}</a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.83rem", color: "#888" }}>
            Welcome, <strong style={{ color: "#1C1C1C" }}>{user?.firstName}</strong>
          </span>
          {user && (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <div onClick={() => setDropdownOpen(v => !v)} style={{
                width: 38, height: 38, borderRadius: "50%",
                background: avatarSrc ? "transparent" : BRAND_RED,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.78rem", fontWeight: 700, color: "#fff",
                cursor: "pointer", overflow: "hidden",
                border: `2.5px solid ${dropdownOpen ? BRAND_RED : "transparent"}`,
                transition: "border 0.2s",
              }}>
                {avatarSrc ? <img src={avatarSrc} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <>{user.firstName?.[0]}{user.lastName?.[0]}</>}
              </div>
              {dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 12px)", right: 0,
                  background: "#fff", borderRadius: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
                  border: "1px solid #f0f0f0", minWidth: 210, zIndex: 999, overflow: "hidden",
                }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f5" }}>
                    <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1C1C1C", marginBottom: 2 }}>{user.firstName} {user.lastName}</p>
                    <p style={{ fontSize: "0.72rem", color: "#aaa" }}>{user.email}</p>
                  </div>
                  <a href="/dashboard/profile" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", textDecoration: "none", fontSize: "0.84rem", color: "#1C1C1C" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#888" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    My Profile
                  </a>
                  <button onClick={() => { setDropdownOpen(false); logout(); }} style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "12px 16px", background: "transparent", border: "none",
                    fontSize: "0.84rem", color: BRAND_RED, cursor: "pointer",
                    borderTop: "1px solid #f5f5f5", fontFamily: "'DM Sans', sans-serif", textAlign: "left",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fff5f5")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke={BRAND_RED} strokeWidth="1.8">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "2.5rem 4vw 4rem" }}>

        {/* ── SUCCESS ICON ── */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", marginBottom: "2rem",
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s ease",
        }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            background: "#F0FDF4",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "1.25rem",
            boxShadow: "0 8px 32px rgba(22,163,74,0.2)",
          }}>
            <svg viewBox="0 0 24 24" width="56" height="56" fill="none">
              <circle cx="12" cy="12" r="12" fill="#16A34A" opacity="0.15"/>
              <circle cx="12" cy="12" r="10" fill="#16A34A"/>
              <polyline points="7 12.5 10.5 16 17 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 700, color: "#1C1C1C", marginBottom: 8 }}>
            Booking Confirmed!
          </h1>
          <p style={{ fontSize: "0.92rem", color: "#888", lineHeight: 1.7, maxWidth: 320 }}>
            Your villa has been booked successfully.<br />Get ready for an amazing stay!
          </p>
        </div>

        {/* ── BOOKING CARD ── */}
        <div style={{
          background: "#fff", borderRadius: 20, overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s ease 0.15s",
        }}>
          {/* Villa image */}
          {villa && (
            <img src={villa.img} alt={villa.name} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
          )}

          <div style={{ padding: "1.5rem" }}>
            {/* Villa name + location */}
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#1C1C1C", marginBottom: 4 }}>
              {villa?.name || "Villa"}
            </h2>
            <p style={{ fontSize: "0.78rem", color: "#888", display: "flex", alignItems: "center", gap: 4, marginBottom: "1.25rem" }}>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#bbb" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {villa?.location || "Nepal"}
            </p>

            {/* Booking ID */}
            <div style={{
              background: "rgba(218,11,0,0.06)", borderRadius: 10,
              padding: "10px 14px", display: "flex",
              justifyContent: "space-between", alignItems: "center",
              marginBottom: "1.25rem",
            }}>
              <span style={{ fontSize: "0.72rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.08em" }}>Booking ID</span>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: BRAND_RED }}>#{bookingId}</span>
            </div>

            {/* Info boxes — check-in / check-out */}
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <InfoBox label="Check-in" value={checkIn ? fmtDate(checkIn) : "—"} icon={
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={BRAND_RED} strokeWidth="1.8">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
              } />
              <InfoBox label="Check-out" value={checkOut ? fmtDate(checkOut) : "—"} icon={
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={BRAND_RED} strokeWidth="1.8">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              } />
            </div>

            {/* Info boxes — guests / nights */}
            <div style={{ display: "flex", gap: 10, marginBottom: "1.25rem" }}>
              <InfoBox label="Guests" value={`${guests} guest${guests > 1 ? "s" : ""}`} icon={
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={BRAND_RED} strokeWidth="1.8">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
              } />
              <InfoBox label="Duration" value={`${nights} night${nights > 1 ? "s" : ""}`} icon={
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={BRAND_RED} strokeWidth="1.8">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
              } />
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#f0f0f0", marginBottom: "1.25rem" }} />

            {/* Total paid */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "#555" }}>Total Paid</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#16A34A" }}>
                NPR {total.toLocaleString()}
              </span>
            </div>

            {/* Payment status */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", color: "#888" }}>Payment Status</span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#F0FDF4", border: "1px solid #86EFAC",
                borderRadius: 20, padding: "4px 12px",
                fontSize: "0.75rem", fontWeight: 700, color: "#16A34A",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A" }} />
                Paid
              </span>
            </div>
          </div>
        </div>

        {/* ── BUTTONS ── */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 12, marginTop: "2rem",
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s ease 0.3s",
        }}>
          <button onClick={() => router.push("/dashboard")} style={{
            width: "100%", height: 52,
            background: BRAND_RED, color: "#fff", border: "none",
            borderRadius: 14, fontSize: "0.95rem", fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Back to Home
          </button>

          <button onClick={() => router.push("/dashboard/bookings")} style={{
            width: "100%", height: 52,
            background: "transparent", color: BRAND_RED,
            border: `1.5px solid ${BRAND_RED}`,
            borderRadius: 14, fontSize: "0.95rem", fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(218,11,0,0.06)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            View My Bookings
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}