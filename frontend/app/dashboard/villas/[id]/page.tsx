"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getVillaById, Villa } from "@/lib/api/villas-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";
const BRAND_RED = "#DA0B00";

const NAV_LINKS = [
  { label: "Home",     href: "/dashboard" },
  { label: "Villas",   href: "/dashboard/villas" },
  { label: "Bookings", href: "/dashboard/bookings" },
  { label: "About",    href: "#" },
];

export default function VillaDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const { user, logout } = useAuth();

  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [villa, setVilla] = useState<Villa | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isFavorite,    setIsFavorite]    = useState(false);
  const [guests,        setGuests]        = useState(2);
  const [checkIn,       setCheckIn]       = useState("");
  const [checkOut,      setCheckOut]      = useState("");
  const [guestModal,    setGuestModal]    = useState(false);
  const [activeImg,     setActiveImg]     = useState(0);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarSrc = user?.profileImage ? `${API_URL}${user.profileImage}` : null;

  useEffect(() => {
    if (!id) {
      setLoadError("Invalid villa id");
      setLoading(false);
      return;
    }
    getVillaById(id)
      .then((data) => {
        setVilla(data);
        setGuests(Math.min(2, data.guests));
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Could not load villa"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ fontSize: "1rem", color: "#888" }}>Loading villa...</p>
      </div>
    );
  }

  if (loadError || !villa) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ fontSize: "1.2rem", color: "#aaa", marginBottom: "1rem" }}>{loadError || "Villa not found"}</p>
        <button onClick={() => router.push("/dashboard/villas")} style={{ padding: "10px 24px", background: BRAND_RED, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          ← Back to Villas
        </button>
      </div>
    );
  }

  // Captured here, after the guard, so the handleBook closure below doesn't
  // hit TS's "possibly null" limitation on closured variables.
  const currentVilla = villa;

  const allImages = [currentVilla.img, ...currentVilla.additionalImages];

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0;

  const totalPrice = nights > 0 ? currentVilla.price * nights : currentVilla.price;

  function handleBook() {
    if (!checkIn || !checkOut) {
      const el = document.getElementById("check-in-input") as HTMLInputElement;
      el?.focus();
      return;
    }
    router.push(`/dashboard/villas/${currentVilla._id}/book?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  }


  const card: React.CSSProperties = {
    background: "#fff", borderRadius: 16, padding: "1.25rem", marginBottom: "1rem",
    border: "1px solid #f0f0f0",
  };

  const sectionTitle: React.CSSProperties = {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.15rem", fontWeight: 700,
    color: "#1C1C1C", marginBottom: "0.75rem",
  };

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
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} style={{
              fontSize: "0.88rem", color: "#888", fontWeight: 400,
              textDecoration: "none", transition: "color 0.2s",
            }}
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

      {/* ── BACK BREADCRUMB ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "0.75rem 4vw" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 8 }}>
          <a href="/dashboard/villas" style={{ fontSize: "0.8rem", color: "#888", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}
            onMouseEnter={e => (e.currentTarget.style.color = BRAND_RED)}
            onMouseLeave={e => (e.currentTarget.style.color = "#888")}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Villas
          </a>
          <span style={{ color: "#ccc", fontSize: "0.8rem" }}>/</span>
          <span style={{ fontSize: "0.8rem", color: "#1C1C1C", fontWeight: 500 }}>{villa.name}</span>
        </div>
      </div>

      {/* ── HERO IMAGE ── */}
      <div style={{ position: "relative", height: "55vh", minHeight: 380, overflow: "hidden", background: "#111" }}>
        <img src={allImages[activeImg].startsWith("http") ? allImages[activeImg] : `${API_URL}${allImages[activeImg]}`} alt={villa.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9, transition: "opacity 0.3s" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />

        <div style={{
          position: "absolute", bottom: 20, right: 24,
          background: "rgba(255,255,255,0.95)", borderRadius: 20,
          padding: "6px 14px", display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ color: "#FFB800", fontSize: "0.9rem" }}>★</span>
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1C1C1C" }}>{villa.rating}</span>
          <span style={{ fontSize: "0.75rem", color: "#888" }}>{villa.reviews} reviews</span>
        </div>

        <button onClick={() => setIsFavorite(v => !v)} style={{
          position: "absolute", top: 20, right: 24,
          background: "rgba(255,255,255,0.95)", border: "none",
          borderRadius: 12, padding: "10px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill={isFavorite ? BRAND_RED : "none"} stroke={BRAND_RED} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>

        {allImages.length > 1 && (
          <div style={{ position: "absolute", bottom: 20, left: 24, display: "flex", gap: 6 }}>
            {allImages.map((_, i) => (
              <button key={i} onClick={() => setActiveImg(i)} style={{
                width: i === activeImg ? 24 : 8, height: 8,
                borderRadius: 4, border: "none", cursor: "pointer",
                background: i === activeImg ? "#fff" : "rgba(255,255,255,0.5)",
                transition: "all 0.2s",
                padding: 0,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* ── THUMBNAIL STRIP ── */}
      {allImages.length > 1 && (
        <div style={{ background: "#fff", padding: "0.75rem 4vw", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 10, overflowX: "auto" }}>
            {allImages.map((img, i) => (
              <div key={i} onClick={() => setActiveImg(i)} style={{
                width: 90, height: 68, borderRadius: 10, overflow: "hidden",
                flexShrink: 0, cursor: "pointer",
                border: `2px solid ${i === activeImg ? BRAND_RED : "transparent"}`,
                transition: "border 0.2s",
              }}>
                <img src={img.startsWith("http") ? img : `${API_URL}${img}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 4vw 6rem", display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "flex-start" }}>

        {/* LEFT COLUMN */}
        <div>
          <div style={{ ...card }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#1C1C1C", marginBottom: 6 }}>{villa.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 14 }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#888" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span style={{ fontSize: "0.85rem", color: "#888" }}>{villa.address}</span>
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: BRAND_RED }}>
              NPR {villa.price.toLocaleString()} <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#aaa", fontWeight: 400 }}>/ night</span>
            </p>
          </div>

          <div style={{ ...card, display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", gap: 0 }}>
            {[
              { icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={BRAND_RED} strokeWidth="1.8"><path d="M2 4v16M22 4v16M2 12h20M7 8h.01M7 16h.01M17 8h.01M17 16h.01"/></svg>, value: String(villa.rooms), label: "Bedrooms" },
              { icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={BRAND_RED} strokeWidth="1.8"><path d="M9 6 C9 3 15 3 15 6 L15 12 L9 12 Z"/><path d="M3 12h18v3a6 6 0 01-6 6H9a6 6 0 01-6-6v-3z"/></svg>, value: String(villa.baths), label: "Bathrooms" },
              { icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={BRAND_RED} strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>, value: String(villa.guests), label: "Max Guests" },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div style={{ background: "#f0f0f0", height: "100%" }} />}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1.25rem", gap: 6 }}>
                  {s.icon}
                  <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1C1C1C" }}>{s.value}</span>
                  <span style={{ fontSize: "0.72rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {(villa.breakfastIncluded || villa.dinnerIncluded) && (
            <div style={card}>
              <p style={sectionTitle}>Included in Package</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "1rem" }}>
                {villa.breakfastIncluded && (
                  <span style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 20, padding: "5px 14px", fontSize: "0.82rem", color: "#16A34A", fontWeight: 600 }}>🍳 Breakfast Included</span>
                )}
                {villa.dinnerIncluded && (
                  <span style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 20, padding: "5px 14px", fontSize: "0.82rem", color: "#16A34A", fontWeight: 600 }}>🍽️ Dinner Included</span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <button style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: "0.82rem", color: "#888", fontFamily: "'DM Sans', sans-serif" }}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  Share
                </button>
                <button onClick={() => setIsFavorite(v => !v)} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: "0.82rem", color: isFavorite ? BRAND_RED : "#888", fontFamily: "'DM Sans', sans-serif" }}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill={isFavorite ? BRAND_RED : "none"} stroke={isFavorite ? BRAND_RED : "#888"} strokeWidth="1.8">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                  {isFavorite ? "Saved to favourites" : "Add to favourites"}
                </button>
              </div>
            </div>
          )}

          {villa.description && (
            <div style={card}>
              <p style={sectionTitle}>Overview</p>
              <p style={{ fontSize: "0.88rem", color: "#555", lineHeight: 1.8 }}>{villa.description}</p>
            </div>
          )}

          {villa.houseRules.length > 0 && (
            <div style={card}>
              <p style={sectionTitle}>House Rules</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {villa.houseRules.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={BRAND_RED} strokeWidth="2.2" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span style={{ fontSize: "0.85rem", color: "#555", lineHeight: 1.6 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {villa.amenities.length > 0 && (
            <div style={card}>
              <p style={sectionTitle}>Amenities</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {villa.amenities.map(a => (
                  <span key={a} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 16px", borderRadius: 20,
                    background: "#EEEEEE", fontSize: "0.82rem", color: "#555", fontWeight: 500,
                  }}>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={BRAND_RED} strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Booking card */}
        <div style={{ position: "sticky", top: 88 }}>
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.1)", border: "1px solid #f0f0f0" }}>

            <div style={{ background: BRAND_RED, padding: "1.25rem 1.5rem" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>
                NPR {villa.price.toLocaleString()}
              </p>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)" }}>per night · all taxes included</p>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.75rem" }}>Plan Your Stay</p>

              <div style={{ border: "1.5px solid #e5e5e5", borderRadius: 12, padding: "12px 14px", marginBottom: 8, cursor: "pointer", position: "relative" }}
                onClick={() => {
                  const el = document.getElementById("check-in-input") as HTMLInputElement;
                  el?.showPicker?.();
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={BRAND_RED} strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                  </svg>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.65rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Check-in / Check-out</p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input id="check-in-input" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                        style={{ border: "none", outline: "none", fontSize: "0.88rem", color: "#1C1C1C", fontFamily: "'DM Sans', sans-serif", background: "transparent", cursor: "pointer" }}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <span style={{ color: "#aaa" }}>→</span>
                      <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                        style={{ border: "none", outline: "none", fontSize: "0.88rem", color: "#1C1C1C", fontFamily: "'DM Sans', sans-serif", background: "transparent", cursor: "pointer" }}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ border: "1.5px solid #e5e5e5", borderRadius: 12, padding: "12px 14px", marginBottom: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                onClick={() => setGuestModal(true)}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={BRAND_RED} strokeWidth="1.8">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.65rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Guests</p>
                  <p style={{ fontSize: "0.88rem", color: "#1C1C1C" }}>{guests} guest{guests > 1 ? "s" : ""}</p>
                </div>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#888" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>

              {nights > 0 && (
                <div style={{ background: "#FFF5F5", border: `1px solid rgba(218,11,0,0.2)`, borderRadius: 12, padding: "14px", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.85rem", color: "#555" }}>NPR {villa.price.toLocaleString()} × {nights} nights</span>
                    <span style={{ fontSize: "0.85rem", color: "#1C1C1C", fontWeight: 600 }}>NPR {(villa.price * nights).toLocaleString()}</span>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(218,11,0,0.15)", paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1C1C1C" }}>Total</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: BRAND_RED }}>NPR {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button onClick={handleBook} style={{
                width: "100%", height: 50,
                background: BRAND_RED, color: "#fff", border: "none",
                borderRadius: 14, fontSize: "0.95rem", fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.04em", transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                {!checkIn || !checkOut ? "Check Availability" : "Book Now"}
              </button>

              <p style={{ fontSize: "0.72rem", color: "#aaa", textAlign: "center", marginTop: 10 }}>You won't be charged yet</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── GUEST PICKER MODAL ── */}
      {guestModal && (
        <div onClick={() => setGuestModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", width: "100%", maxWidth: 480, borderRadius: "24px 24px 0 0", padding: "1.5rem 1.75rem 2.5rem" }}>
            <div style={{ width: 40, height: 4, background: "#e0e0e0", borderRadius: 2, margin: "0 auto 1.25rem" }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, textAlign: "center", marginBottom: 6 }}>Number of Guests</p>
            <p style={{ fontSize: "0.82rem", color: "#aaa", textAlign: "center", marginBottom: "1.5rem" }}>Max {currentVilla.guests} guests</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem", marginBottom: "1.75rem" }}>
              <button onClick={() => setGuests(g => Math.max(1, g - 1))} disabled={guests <= 1} style={{
                width: 44, height: 44, borderRadius: "50%",
                background: guests <= 1 ? "#e5e5e5" : BRAND_RED,
                border: "none", color: "#fff", fontSize: "1.4rem",
                cursor: guests <= 1 ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>−</button>
              <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "#1C1C1C", minWidth: 50, textAlign: "center" }}>{guests}</span>
              <button onClick={() => setGuests(g => Math.min(currentVilla.guests, g + 1))} disabled={guests >= currentVilla.guests} style={{
                width: 44, height: 44, borderRadius: "50%",
                background: guests >= currentVilla.guests ? "#e5e5e5" : BRAND_RED,
                border: "none", color: "#fff", fontSize: "1.4rem",
                cursor: guests >= currentVilla.guests ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>+</button>
            </div>
            <button onClick={() => setGuestModal(false)} style={{
              width: "100%", height: 50, background: BRAND_RED, border: "none",
              borderRadius: 14, color: "#fff", fontSize: "0.95rem", fontWeight: 700,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Confirm</button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.6; }
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; }
          .booking-sticky { position: static !important; }
        }
      `}</style>
    </div>
  );
}