"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserCookie, clearAuthCookies } from "@/lib/api/cookies";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const VILLAS = [
  {
    name: "Pokhara Lakeside Villa",
    loc: "Pokhara, Gandaki",
    price: "NPR 45,000 / night",
    rating: 4.9,
    badge: "Best Seller",
    img: "https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=800&q=85",
  },
  {
    name: "Nagarkot Mountain Retreat",
    loc: "Nagarkot, Bagmati",
    price: "NPR 32,000 / night",
    rating: 4.8,
    badge: "Best Seller",
    img: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=85",
  },
  {
    name: "Chitwan Jungle Estate",
    loc: "Chitwan, Narayani",
    price: "NPR 28,000 / night",
    rating: 4.7,
    badge: null,
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=85",
  },
  {
    name: "Mustang Desert Villa",
    loc: "Upper Mustang, Gandaki",
    price: "NPR 55,000 / night",
    rating: 5.0,
    badge: "New",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85",
  },
];

const OFFERS = [
  {
    tag: "25% OFF",
    title: "Himalayan Escape Package",
    desc: "Includes daily breakfast and a complimentary spa session",
    expires: "Expires Aug 31",
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=700&q=85",
  },
  {
    tag: "20% OFF",
    title: "Romantic Getaway",
    desc: "Special couples package with private dining by the lake",
    expires: "Expires Sep 20",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700&q=85",
  },
  {
    tag: "20% OFF",
    title: "Early Bird Special",
    desc: "Book 60 days in advance and save on any luxury villa",
    expires: "Expires Aug 31",
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700&q=85",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Shrestha",
    loc: "Kathmandu, Nepal",
    text: "We stayed at the Pokhara villa for our anniversary — the mountain views at dawn were unlike anything we've experienced. VillaBaas made every detail effortless.",
    stars: 5,
    avatar: "https://i.pravatar.cc/80?img=47",
  },
  {
    name: "James Holloway",
    loc: "London, UK",
    text: "I've travelled across Asia for work, and nothing compares to the serenity of the Nagarkot retreat. A truly world-class experience tucked in the Himalayas.",
    stars: 5,
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    name: "Anita Gurung",
    loc: "Pokhara, Nepal",
    text: "The team at VillaBaas goes beyond just booking — they curate experiences. From jungle safaris in Chitwan to bonfire evenings, every moment was magical.",
    stars: 5,
    avatar: "https://i.pravatar.cc/80?img=32",
  },
];

const NAV_LINKS = [
    { label: "Home",        href: "/dashboard" },
    { label: "Villas",      href: "/dashboard/villas" },
    { label: "Experiences", href: "#" },
    { label: "About",       href: "#" },
];


const fullBleed: React.CSSProperties = {
  width: "100vw",
  marginLeft: "calc(-50vw + 50%)",
  boxSizing: "border-box",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser]               = useState<User | null>(null);
  const [destination, setDestination] = useState("Pokhara");
  const [checkIn, setCheckIn]         = useState("Mar 15, 2025");
  const [checkOut, setCheckOut]       = useState("Mar 18, 2025");
  const [guests, setGuests]           = useState(2);
  const [email, setEmail]             = useState("");
  const [footerEmail, setFooterEmail] = useState("");
  const [hoveredVilla, setHoveredVilla] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = getUserCookie() as User | null;
    if (!stored) { router.replace("/login"); return; }
    setUser(stored);
  }, [router]);

    useEffect(() => {
    if (user === null) {
      // give AuthContext time to load from cookie
      const t = setTimeout(() => {
        if (!user) router.replace("/login");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [user, router]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      html, body { margin: 0 !important; padding: 0 !important; overflow-x: hidden !important; }
      * { box-sizing: border-box; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    clearAuthCookies();
    router.push("/login");
  }

  if (!user) return null;

  

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      color: "#1a1a1a",
      overflowX: "hidden",
      margin: 0,
      padding: 0,
    }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        ...fullBleed,
        position: "sticky",
        top: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 4vw",
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid #ebebeb",
        boxShadow: "0 1px 20px rgba(0,0,0,0.06)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "linear-gradient(135deg,#1A1A1A,#2d2517)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#E8D5B0" strokeWidth="1.6">
              <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"/>
              <path d="M9 22V12h6v10"/>
            </svg>
          </div>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.25rem", fontWeight: 600, letterSpacing: "0.04em",
          }}>VillaBaas</span>
        </div>

        {/* Nav links */}
        {NAV_LINKS.map((l) => (
    <a key={l.label} href={l.href} style={{
        fontSize: "0.88rem",
        color: "#555",
        textDecoration: "none",
        fontWeight: 400,
        transition: "color 0.2s",
    }}
    onMouseEnter={e => (e.currentTarget.style.color = "#1a1a1a")}
    onMouseLeave={e => (e.currentTarget.style.color = "#555")}
    >{l.label}</a>
))}

        {/* Right — avatar with dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.1rem" }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#666" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>

          {/* Avatar + dropdown wrapper */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            {/* Clickable avatar */}
            <div
              onClick={() => setDropdownOpen((v) => !v)}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg,#C9A96E,#e8c97a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.78rem", fontWeight: 700, color: "#1a1a1a",
                flexShrink: 0, cursor: "pointer",
                border: dropdownOpen ? "2.5px solid #C9A96E" : "2.5px solid transparent",
                boxShadow: dropdownOpen ? "0 0 0 3px rgba(201,169,110,0.2)" : "none",
                transition: "all 0.2s",
              }}
            >
              {user.firstName[0]}{user.lastName[0]}
            </div>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 12px)", right: 0,
                background: "#fff", borderRadius: 14,
                boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
                border: "1px solid #f0f0f0",
                minWidth: 210, zIndex: 999,
                overflow: "hidden",
                animation: "fadeDown 0.15s ease",
              }}>
                <style>{`
                  @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                  }
                `}</style>

                {/* User info */}
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f5" }}>
                  <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>
                    {user.firstName} {user.lastName}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "#aaa" }}>{user.email}</p>
                </div>

                {/*  FIXED: was missing the opening <a tag */}
                <a
                  href="/dashboard/profile"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 16px", textDecoration: "none",
                    fontSize: "0.84rem", color: "#1a1a1a",
                    background: "transparent", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#888" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  My Profile
                </a>

                {/* Sign Out */}
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "12px 16px",
                    background: "transparent", border: "none",
                    fontSize: "0.84rem", color: "#C0392B",
                    cursor: "pointer", textAlign: "left",
                    borderTop: "1px solid #f5f5f5",
                    transition: "background 0.15s",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fff5f5")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#C0392B" strokeWidth="1.8">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Welcome text */}
          <span style={{ fontSize: "0.83rem", color: "#555" }}>
            Welcome, <strong style={{ color: "#1a1a1a" }}>{user.firstName}</strong>
          </span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ ...fullBleed, position: "relative", height: "92vh", minHeight: 560 }}>
        <img
          src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-885171494011814801/original/d3076352-6619-4709-ac7c-e8a9aa7ae9c1.jpeg"
          alt="Nepal luxury villa"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, rgba(10,6,2,0.72) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 100%, rgba(40,20,0,0.45) 0%, transparent 70%)",
        }} />

        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -52%)",
          textAlign: "center", color: "#fff",
          width: "92%", maxWidth: 740,
        }}>
          <div style={{
            display: "inline-block",
            background: "rgba(201,169,110,0.9)",
            borderRadius: 100, padding: "5px 20px",
            fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase",
            marginBottom: "1.4rem", color: "#1a1a1a", fontWeight: 700,
          }}>
            The Ultimate Villa Experience
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.6rem, 5.8vw, 4.2rem)",
            fontWeight: 400, lineHeight: 1.1, marginBottom: "1.1rem",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}>
            Discover Your Perfect<br />
            <em style={{ fontStyle: "italic", color: "#E8D5B0" }}>Getaway in Nepal</em>
          </h1>

          <p style={{
            fontSize: "1rem", color: "rgba(255,255,255,0.78)",
            fontWeight: 300, lineHeight: 1.75, marginBottom: "2.8rem",
            textShadow: "0 1px 8px rgba(0,0,0,0.4)",
          }}>
            Handpicked luxury villas nestled in the Himalayas, lakesides,<br />and jungles of Nepal. Start your journey today.
          </p>

          {/* Search bar */}
          <div style={{
            display: "flex", background: "#fff", borderRadius: 14,
            overflow: "hidden", boxShadow: "0 16px 60px rgba(0,0,0,0.35)",
            maxWidth: 720, margin: "0 auto",
          }}>
            {[
              { label: "Destination", value: destination, onChange: (v: string) => setDestination(v), flex: "1 1 180px" },
              { label: "Check In",    value: checkIn,     onChange: (v: string) => setCheckIn(v),     flex: "1 1 130px" },
              { label: "Check Out",   value: checkOut,    onChange: (v: string) => setCheckOut(v),    flex: "1 1 130px" },
            ].map((field) => (
              <div key={field.label} style={{ flex: field.flex, padding: "16px 20px", borderRight: "1px solid #f0f0f0" }}>
                <div style={{ fontSize: "0.6rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 5 }}>
                  {field.label}
                </div>
                <input value={field.value} onChange={e => field.onChange(e.target.value)} style={{
                  border: "none", outline: "none", fontSize: "0.9rem",
                  color: "#1a1a1a", width: "100%", background: "transparent",
                  fontFamily: "'DM Sans', sans-serif",
                }} />
              </div>
            ))}
            <div style={{ flex: "0 0 80px", padding: "16px 18px", borderRight: "1px solid #f0f0f0" }}>
              <div style={{ fontSize: "0.6rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 5 }}>Guests</div>
              <input type="number" value={guests} min={1} onChange={e => setGuests(Number(e.target.value))} style={{
                border: "none", outline: "none", fontSize: "0.9rem",
                color: "#1a1a1a", width: "100%", background: "transparent",
                fontFamily: "'DM Sans', sans-serif",
              }} />
            </div>
            <button style={{
              flex: "0 0 auto",
              background: "linear-gradient(135deg,#1A1A1A 0%,#2d2517 100%)",
              color: "#E8D5B0", border: "none", padding: "0 28px",
              fontSize: "0.88rem", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              display: "flex", alignItems: "center", gap: 8, letterSpacing: "0.02em",
            }}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              Search
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "2rem" }}>
            {["500+ Villas", "Instant Booking", "24/7 Support"].map(b => (
              <span key={b} style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ color: "#C9A96E" }}>✓</span> {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED VILLAS ── */}
      <div style={{ ...fullBleed, background: "#fff", padding: "6rem 5vw" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A96E", fontWeight: 600, marginBottom: "0.6rem" }}>
              Handpicked for You
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.9rem,3.5vw,2.8rem)", fontWeight: 400, marginBottom: "0.8rem" }}>
              Featured Villas
            </h2>
            <p style={{ color: "#888", fontSize: "0.93rem", maxWidth: 460, margin: "0 auto", lineHeight: 1.75 }}>
              Exceptional properties across Nepal's most breathtaking landscapes — each one curated for comfort, character, and connection.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {VILLAS.map((v) => (
              <div key={v.name}
                onMouseEnter={() => setHoveredVilla(v.name)}
                onMouseLeave={() => setHoveredVilla(null)}
                style={{
                  borderRadius: 18, overflow: "hidden",
                  border: "1px solid #f0f0f0", background: "#fff",
                  boxShadow: hoveredVilla === v.name ? "0 16px 48px rgba(0,0,0,0.13)" : "0 2px 14px rgba(0,0,0,0.06)",
                  transform: hoveredVilla === v.name ? "translateY(-4px)" : "translateY(0)",
                  transition: "all 0.28s ease", cursor: "pointer",
                }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img src={v.img} alt={v.name} style={{
                    width: "100%", height: 200, objectFit: "cover", display: "block",
                    transform: hoveredVilla === v.name ? "scale(1.05)" : "scale(1)",
                    transition: "transform 0.45s ease",
                  }} />
                  {v.badge && (
                    <span style={{
                      position: "absolute", top: 13, left: 13,
                      background: "#fff", borderRadius: 100, padding: "4px 12px",
                      fontSize: "0.63rem", fontWeight: 700, color: "#1a1a1a",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.18)", letterSpacing: "0.04em",
                    }}>{v.badge}</span>
                  )}
                  <button style={{
                    position: "absolute", top: 13, right: 13,
                    background: "rgba(255,255,255,0.85)", border: "none",
                    borderRadius: "50%", width: 32, height: 32,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", backdropFilter: "blur(4px)",
                  }}>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#999" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                  </button>
                </div>
                <div style={{ padding: "1.1rem 1.25rem 1.35rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.3rem" }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.25 }}>{v.name}</p>
                    <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: "0.8rem", fontWeight: 600, color: "#1a1a1a", marginLeft: 8, flexShrink: 0 }}>
                      <span style={{ color: "#C9A96E" }}>★</span>{v.rating}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.74rem", color: "#aaa", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 4 }}>
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#bbb" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {v.loc}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a1a1a" }}>{v.price}</span>
                    <button style={{
                      background: "#1A1A1A", color: "#fff", border: "none",
                      borderRadius: 8, padding: "7px 15px", fontSize: "0.74rem",
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    }}>View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <button style={{
              background: "transparent", border: "1.5px solid #ddd",
              borderRadius: 10, padding: "12px 34px", fontSize: "0.86rem",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              color: "#1a1a1a", fontWeight: 500, letterSpacing: "0.02em",
            }}>View All Villas</button>
          </div>
        </div>
      </div>

      {/* ── EXCLUSIVE OFFERS ── */}
      <div style={{ ...fullBleed, background: "#f8f7f5", padding: "5.5rem 5vw" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem" }}>
            <div>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A96E", fontWeight: 600, marginBottom: "0.5rem" }}>Limited Time</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.9rem,3.5vw,2.6rem)", fontWeight: 400, marginBottom: "0.5rem" }}>Exclusive Offers</h2>
              <p style={{ color: "#888", fontSize: "0.88rem", maxWidth: 360, lineHeight: 1.7 }}>Take advantage of our limited-time offers to enhance your stay.</p>
            </div>
            <a href="#" style={{ fontSize: "0.85rem", color: "#1a1a1a", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              View All Offers <span>→</span>
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {OFFERS.map((o) => (
              <div key={o.title} style={{ position: "relative", borderRadius: 18, overflow: "hidden", height: 280, cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget.querySelector("img") as HTMLImageElement).style.transform = "scale(1.06)"; }}
                onMouseLeave={e => { (e.currentTarget.querySelector("img") as HTMLImageElement).style.transform = "scale(1)"; }}
              >
                <img src={o.img} alt={o.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.08) 55%)" }} />
                <div style={{ position: "absolute", top: 16, left: 16 }}>
                  <span style={{ background: "#C9A96E", color: "#fff", borderRadius: 100, padding: "4px 12px", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em" }}>{o.tag}</span>
                </div>
                <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, color: "#fff" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.3rem" }}>{o.title}</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.72)", marginBottom: "0.4rem", lineHeight: 1.5 }}>{o.desc}</p>
                  <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", marginBottom: "0.9rem" }}>{o.expires}</p>
                  <a href="#" style={{ fontSize: "0.78rem", color: "#E8D5B0", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5, borderBottom: "1px solid rgba(232,213,176,0.4)", paddingBottom: 1 }}>View Offers →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS BAND ── */}
      <div style={{ ...fullBleed, background: "#1A1A1A", padding: "3.5rem 5vw" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", textAlign: "center" }}>
          {[
            { num: "500+", label: "Luxury Villas" },
            { num: "12K+", label: "Happy Guests" },
            { num: "14",   label: "Districts Covered" },
            { num: "4.9★", label: "Average Rating" },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.6rem", fontWeight: 400, color: "#E8D5B0", marginBottom: "0.2rem" }}>{s.num}</p>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div style={{ ...fullBleed, background: "#fff", padding: "5.5rem 5vw" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A96E", fontWeight: 600, marginBottom: "0.6rem" }}>Guest Stories</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.9rem,3.5vw,2.8rem)", fontWeight: 400, marginBottom: "0.7rem" }}>What Our Guests Say</h2>
            <p style={{ color: "#888", fontSize: "0.93rem", maxWidth: 420, margin: "0 auto", lineHeight: 1.75 }}>
              Discover why discerning travellers choose VillaBaas for their Nepal experiences.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{ background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 18, padding: "1.75rem" }}>
                <div style={{ display: "flex", marginBottom: "0.9rem" }}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} style={{ color: "#C9A96E", fontSize: "0.95rem" }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: "0.88rem", color: "#444", lineHeight: 1.8, marginBottom: "1.4rem", fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1a1a1a", marginBottom: 2 }}>{t.name}</p>
                    <p style={{ fontSize: "0.72rem", color: "#aaa" }}>{t.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── NEWSLETTER ── */}
      <div style={{ ...fullBleed, background: "linear-gradient(135deg, #1a1a1a 0%, #2d2517 100%)", padding: "5rem 5vw", textAlign: "center", color: "#fff" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 52, height: 52, borderRadius: "50%",
            background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.35)",
            marginBottom: "1.5rem",
          }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9A96E" strokeWidth="1.5">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem,3.5vw,2.5rem)", fontWeight: 400, marginBottom: "0.8rem" }}>Stay Inspired</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.92rem", lineHeight: 1.8, maxWidth: 420, margin: "0 auto 2.2rem" }}>
            Join our newsletter and be the first to discover new villa listings, exclusive offers, and travel inspiration across Nepal.
          </p>
          <div style={{
            display: "flex", maxWidth: 440, margin: "0 auto",
            borderRadius: 12, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
          }}>
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} style={{
              flex: 1, padding: "13px 18px", background: "transparent",
              border: "none", outline: "none", color: "#fff", fontSize: "0.88rem",
              fontFamily: "'DM Sans', sans-serif",
            }} />
            <button style={{
              background: "#C9A96E", border: "none", color: "#1a1a1a",
              padding: "0 24px", fontSize: "0.85rem", fontWeight: 700,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.03em",
            }}>Subscribe →</button>
          </div>
          <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.28)", marginTop: "1.1rem" }}>
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ ...fullBleed, background: "#0f0f0f", color: "rgba(255,255,255,0.5)", padding: "4rem 5vw 2rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1.6fr", gap: "3rem", marginBottom: "3rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: "0.9rem" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#2d2517,#1A1A1A)", border: "1px solid rgba(201,169,110,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#E8D5B0" strokeWidth="1.6">
                    <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"/>
                    <path d="M9 22V12h6v10"/>
                  </svg>
                </div>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "#fff", fontWeight: 600 }}>VillaBaas</span>
              </div>
              <p style={{ fontSize: "0.8rem", lineHeight: 1.8, maxWidth: 230, marginBottom: "1.2rem" }}>
                Discover Nepal's most extraordinary villas — from Himalayan retreats to jungle estates and lakeside sanctuaries.
              </p>
              <div style={{ display: "flex", gap: 14 }}>
                {["IG", "TW", "FB", "IN"].map(s => (
                  <a key={s} href="#" style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", textDecoration: "none", fontWeight: 700, letterSpacing: "0.05em" }}>{s}</a>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "1rem" }}>Company</p>
              {["About", "Careers", "Press", "Blog", "Partners"].map(l => (
                <a key={l} href="#" style={{ display: "block", fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: "0.6rem" }}>{l}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "1rem" }}>Support</p>
              {["Help Center", "Safety Info", "Cancellations", "Contact Us", "Accessibility"].map(l => (
                <a key={l} href="#" style={{ display: "block", fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: "0.6rem" }}>{l}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: "1rem" }}>Stay Updated</p>
              <p style={{ fontSize: "0.8rem", lineHeight: 1.7, marginBottom: "1rem" }}>Subscribe for villa inspiration and special offers.</p>
              <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                <input type="email" placeholder="Your email" value={footerEmail} onChange={e => setFooterEmail(e.target.value)} style={{
                  flex: 1, padding: "10px 13px", background: "rgba(255,255,255,0.05)",
                  border: "none", outline: "none", color: "#fff", fontSize: "0.8rem",
                  fontFamily: "'DM Sans', sans-serif",
                }} />
                <button style={{ background: "rgba(201,169,110,0.2)", border: "none", padding: "0 14px", color: "#C9A96E", cursor: "pointer", fontSize: "1.1rem" }}>→</button>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "rgba(255,255,255,0.28)" }}>
            <span>© 2025 VillaBaas. All rights reserved.</span>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {["Privacy", "Terms", "Cookies"].map(l => (
                <a key={l} href="#" style={{ color: "rgba(255,255,255,0.28)", textDecoration: "none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}