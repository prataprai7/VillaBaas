"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getTokenCookie } from "@/lib/api/cookies";

const API_URL   = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";
const BRAND_RED = "#DA0B00";

const VILLAS = [
  { id: 1,  name: "Methlang Villa",         location: "Lakeside, Pokhara, Gandaki",        price: 17600, rating: 4.6, reviews: 92,  rooms: 4, baths: 2, img: "https://l.icdbcdn.com/oh/bae4bc48-3f95-4610-b83e-0e02eb91110e.jpg", breakfastIncluded: true,  dinnerIncluded: true,  houseRules: ["No smoking inside the villa", "Pets are not allowed", "Check-in from 2:00 PM, check-out by 11:00 AM", "Quiet hours between 10 PM and 8 AM"] },
  { id: 2,  name: "The Hideout Villa",       location: "Fewa Lakeside, Pokhara, Gandaki",   price: 15200, rating: 4.5, reviews: 68,  rooms: 4, baths: 2, img: "https://villathehideoutpokhara.np-hotel.com/data/Photos/OriginalPhoto/15839/1583906/1583906483/photo-the-hideout-villa-pokhara-pokhara-5.JPEG", breakfastIncluded: false, dinnerIncluded: false, houseRules: ["No smoking inside the villa", "Check-in from 3:00 PM, check-out by 12:00 PM"] },
  { id: 3,  name: "Villa Karma Pokhara",       location: "Lakeside, Pokhara, Gandaki",        price: 14200, rating: 4.5, reviews: 54,  rooms: 3, baths: 2, img: "https://a0.muscache.com/im/pictures/miso/Hosting-1135974458065631357/original/812358b8-798e-4adf-8dd4-7fab045df196.jpeg?im_w=1440", breakfastIncluded: false, dinnerIncluded: false, houseRules: ["No smoking", "Check-in from 2:00 PM"] },
  { id: 4,  name: "The Pipal Tree",          location: "Patan Durbar, Lalitpur, Bagmati",   price: 12400, rating: 4.3, reviews: 41,  rooms: 3, baths: 2, img: "https://media.vrbo.com/lodging/100000000/99800000/99794400/99794388/9ead10f2.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill", breakfastIncluded: false, dinnerIncluded: false, houseRules: ["No smoking", "Respect local heritage", "Quiet hours after 10 PM"] },
  { id: 5,  name: "Villa De Amore",          location: "Bhaktapur Durbar, Bagmati",         price: 19500, rating: 4.8, reviews: 116, rooms: 4, baths: 3, img: "https://www.villasnepal.com/storage/802/conversions/01KWTWP3A7QH4BZMQXAXNDW9Y8-hero_avif.webp", breakfastIncluded: true,  dinnerIncluded: false, houseRules: ["No smoking inside", "Pets allowed with prior notice", "Check-in from 2:00 PM"] },
  { id: 6,  name: "Archid Villa",            location: "Nagarkot Hill, Bhaktapur, Bagmati", price: 24000, rating: 4.7, reviews: 88,  rooms: 5, baths: 3, img: "https://archidvilla.com/wp-content/uploads/2026/05/6.jpeg", breakfastIncluded: true,  dinnerIncluded: true,  houseRules: ["No smoking", "Check-in from 2:00 PM, check-out by 11:00 AM", "Firewood is provided — no outside fires"] },
  { id: 7,  name: "Farmhouse In Dhulikhel",     location: "Bhaktapur, Kathmandu",        price: 9500,  rating: 4.9, reviews: 34,  rooms: 3, baths: 2, img: "https://www.villasnepal.com/storage/213/conversions/01KCR3VQMHGZC8RC5HFJW17D36-hero_avif.webp", breakfastIncluded: false, dinnerIncluded: false, houseRules: ["Special permit required for Upper Mustang", "No plastic bags inside", "Respect local Buddhist customs"] },
  { id: 8,  name: "Bella Vista Thecho",    location: "Thecho, Lalitpur, Kathmandu",        price: 11500, rating: 4.6, reviews: 72,  rooms: 4, baths: 4, img: "https://www.villasnepal.com/storage/890/conversions/01KXSRPJ7HWBMGA4YRMQGMQF7D-hero_avif.webp", breakfastIncluded: true,  dinnerIncluded: true,  houseRules: ["No loud noise after 9 PM", "Do not feed animals", "Follow safari guide instructions at all times"] },
  { id: 9,  name: "Leopard Villa at Tiger Palace by Soaltee",       location: "Lumbini Peace Zone, Rupandehi",     price: 7500,  rating: 4.7, reviews: 29,  rooms: 2, baths: 2, img: "https://www.villasnepal.com/storage/330/conversions/01KHWRQJY78ARMKX5KVWWGX712-thumb_avif.webp", breakfastIncluded: false, dinnerIncluded: false, houseRules: ["Meditation silence observed 6–8 AM", "Vegetarian meals only on premises", "No alcohol"] },
  { id: 10, name: "Farmhouse In Nagarkot",   location: "Nagarkot, Bhaktapur, Province 3",     price: 8900,  rating: 4.4, reviews: 47,  rooms: 3, baths: 2, img: "https://www.villasnepal.com/storage/364/conversions/01KK6B9NDV1YBWNYNE92DGEPNS-hero_avif.webp", breakfastIncluded: false, dinnerIncluded: false, houseRules: ["No smoking near tea gardens", "Check-in from 2:00 PM", "Hiking boots recommended"] },
];

const NAV_LINKS = [
  { label: "Home",     href: "/dashboard" },
  { label: "Villas",   href: "/dashboard/villas" },
  { label: "Bookings", href: "/dashboard/bookings" },
  { label: "About",    href: "#" },
];

function fmtDate(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString("en-NP", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export default function BookingConfirmPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const params       = useParams();
  const { user, logout } = useAuth();

  const checkIn  = searchParams.get("checkIn")  || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests   = Number(searchParams.get("guests") || 1);
  const villaId  = Number(Array.isArray(params?.id) ? params.id[0] : params?.id);

  const villa = VILLAS.find(v => v.id === villaId)!;

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1;

  const totalPrice = villa ? villa.price * nights : 0;

  const [agreed,       setAgreed]       = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [toast,        setToast]        = useState<{ msg: string; type: "error" | "success" } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarSrc = user?.profileImage ? `${API_URL}${user.profileImage}` : null;
  const token     = getTokenCookie(); // read once, used in handleProceed

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  if (!villa) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.1rem", color: "#aaa", marginBottom: "1rem" }}>Villa not found</p>
          <button onClick={() => router.push("/dashboard/villas")} style={{ padding: "10px 24px", background: BRAND_RED, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer" }}>
            ← Back to Villas
          </button>
        </div>
      </div>
    );
  }

  async function handleProceed() {
    if (!agreed) {
      setToast({ msg: "Please agree to the house rules to continue", type: "error" });
      return;
    }
    if (!token) {
      setToast({ msg: "Please log in to continue", type: "error" });
      router.push("/login");
      return;
    }

    setIsLoading(true);

    // When booking API is ready, call it here with the token:
    // try {
    //   const res = await fetch(`${API_URL}/api/v1/bookings`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    //     body: JSON.stringify({ villaId: villa.id, checkIn, checkOut, guests }),
    //   });
    //   const data = await res.json();
    //   if (!res.ok) throw new Error(data.message);
    //   router.push(`/dashboard/bookings/payment?bookingId=${data.data._id}&total=${totalPrice}`);
    // } catch (err: any) {
    //   setToast({ msg: err.message || "Booking failed", type: "error" });
    // } finally {
    //   setIsLoading(false);
    // }

    // Mock — navigate to payment page with booking info
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/dashboard/bookings/payment?villaId=${villa.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&total=${totalPrice}`);
    }, 800);
  }

  const card: React.CSSProperties = {
    background: "#fff", borderRadius: 16,
    border: "1px solid #f0f0f0",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    marginBottom: "1.25rem",
    overflow: "hidden",
  };

  const sectionTitle: React.CSSProperties = {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.1rem", fontWeight: 700,
    color: "#1C1C1C", marginBottom: "0.75rem",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#EEEEEE", fontFamily: "'DM Sans', sans-serif", color: "#1C1C1C", margin: 0, padding: 0, paddingBottom: 100 }}>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 1000,
          background: toast.type === "error" ? BRAND_RED : "#16A34A",
          color: "#fff", padding: "12px 20px", borderRadius: 12,
          fontSize: "0.85rem", fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          animation: "slideIn 0.25s ease", maxWidth: 320,
        }}>
          {toast.msg}
        </div>
      )}

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

      {/* ── BREADCRUMB ── */}
      <div style={{ background: "#fff", padding: "0.75rem 4vw", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", gap: 8 }}>
          {[
            { label: "Villas",    href: "/dashboard/villas" },
            { label: villa.name, href: `/dashboard/villas/${villa.id}` },
            { label: "Confirm Booking", href: "" },
          ].map((b, i, arr) => (
            <span key={b.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {i > 0 && <span style={{ color: "#ccc", fontSize: "0.8rem" }}>/</span>}
              {b.href ? (
                <a href={b.href} style={{ fontSize: "0.8rem", color: "#888", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = BRAND_RED)}
                  onMouseLeave={e => (e.currentTarget.style.color = "#888")}
                >{b.label}</a>
              ) : (
                <span style={{ fontSize: "0.8rem", color: "#1C1C1C", fontWeight: 500 }}>{b.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 4vw" }}>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#1C1C1C", marginBottom: "0.4rem" }}>
          Confirm Booking
        </h1>
        <p style={{ fontSize: "0.88rem", color: "#888", marginBottom: "2rem" }}>
          Review your booking details before proceeding to payment.
        </p>

        {/* ── VILLA CARD ── */}
        <div style={card}>
          <img src={villa.img} alt={villa.name} style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
          <div style={{ padding: "1.25rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#1C1C1C", marginBottom: 4 }}>{villa.name}</h2>
            <p style={{ fontSize: "0.8rem", color: "#888", display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#bbb" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {villa.location}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{ color: i <= Math.floor(villa.rating) ? "#FFB800" : "#e5e5e5", fontSize: "0.85rem" }}>★</span>
              ))}
              <span style={{ fontSize: "0.75rem", color: "#aaa", marginLeft: 4 }}>{villa.rating} · {villa.reviews} reviews</span>
            </div>
          </div>
        </div>

        {/* ── BOOKING DETAILS ── */}
        <p style={sectionTitle}>Booking Details</p>
        <div style={{ ...card, padding: "1.25rem" }}>
          {[
            {
              label: "Check-in",
              value: checkIn ? fmtDate(checkIn) : "—",
              icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={BRAND_RED} strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
            },
            {
              label: "Check-out",
              value: checkOut ? fmtDate(checkOut) : "—",
              icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={BRAND_RED} strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
            },
            {
              label: "Duration",
              value: `${nights} night${nights > 1 ? "s" : ""}`,
              icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={BRAND_RED} strokeWidth="1.8"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
            },
            {
              label: "Guests",
              value: `${guests} guest${guests > 1 ? "s" : ""}`,
              icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={BRAND_RED} strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
            },
          ].map((row, i, arr) => (
            <div key={row.label}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(218,11,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {row.icon}
                </div>
                <div>
                  <p style={{ fontSize: "0.68rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{row.label}</p>
                  <p style={{ fontSize: "0.92rem", fontWeight: 600, color: "#1C1C1C" }}>{row.value}</p>
                </div>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: "#f5f5f5" }} />}
            </div>
          ))}
        </div>

        {/* ── PRICE BREAKDOWN ── */}
        <p style={sectionTitle}>Price Breakdown</p>
        <div style={{ ...card, padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: "0.88rem", color: "#555" }}>NPR {villa.price.toLocaleString()} × {nights} night{nights > 1 ? "s" : ""}</span>
            <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1C1C1C" }}>NPR {(villa.price * nights).toLocaleString()}</span>
          </div>
          {(villa.breakfastIncluded || villa.dinnerIncluded) && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: "0.88rem", color: "#555" }}>
                Meals included — {[villa.breakfastIncluded && "Breakfast", villa.dinnerIncluded && "Dinner"].filter(Boolean).join(" + ")}
              </span>
              <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#16A34A" }}>Included ✓</span>
            </div>
          )}
          <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1C1C1C" }}>Total</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: BRAND_RED }}>
              NPR {totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ── HOUSE RULES ── */}
        {villa.houseRules.length > 0 && (
          <>
            <p style={sectionTitle}>House Rules</p>
            <div style={{ ...card, padding: "1.25rem" }}>
              {villa.houseRules.slice(0, 4).map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < villa.houseRules.length - 1 ? 10 : 0 }}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke={BRAND_RED} strokeWidth="2.2" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span style={{ fontSize: "0.85rem", color: "#555", lineHeight: 1.65 }}>{r}</span>
                </div>
              ))}

              <div style={{ height: 1, background: "#f0f0f0", margin: "14px 0" }} />

              {/* Agreement checkbox */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }} onClick={() => setAgreed(v => !v)}>
                <div style={{
                  width: 22, height: 22, flexShrink: 0, marginTop: 1,
                  borderRadius: 6, border: `2px solid ${agreed ? BRAND_RED : "#d0d0d0"}`,
                  background: agreed ? BRAND_RED : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}>
                  {agreed && (
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: "0.85rem", color: "#1C1C1C", lineHeight: 1.6 }}>
                  I agree to the house rules and cancellation policy
                </span>
              </label>
            </div>
          </>
        )}
      </div>

      {/* ── STICKY BOTTOM CTA ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", padding: "1rem 4vw 1.5rem",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        zIndex: 200,
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.72rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Total Amount</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: BRAND_RED }}>
              NPR {totalPrice.toLocaleString()}
            </p>
          </div>
          <button onClick={handleProceed} disabled={isLoading} style={{
            height: 52, padding: "0 36px",
            background: isLoading ? "#aaa" : BRAND_RED,
            color: "#fff", border: "none", borderRadius: 14,
            fontSize: "0.95rem", fontWeight: 700,
            cursor: isLoading ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            display: "flex", alignItems: "center", gap: 8,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
          >
            {isLoading ? (
              <>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                Processing…
              </>
            ) : "Proceed to Payment"}
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}