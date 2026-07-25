"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";
const BRAND_RED = "#DA0B00";

const NAV_LINKS = [
  { label: "Home",     href: "/dashboard" },
  { label: "Villas",   href: "/dashboard/villas" },
  { label: "Bookings", href: "/dashboard/bookings" },
  { label: "About",    href: "/dashboard/about" },
];

const LANDSCAPES = [
  {
    name: "The Himalayas",
    tag: "Mountain",
    desc: "Wake to sunrise over snow peaks in Nagarkot and Dhulikhel, where the air is thin and the views run for a hundred miles.",
    img: "https://i.pinimg.com/736x/aa/c6/ac/aac6ac0c8a9f97095eb618df7f9eccf3.jpg",
  },
  {
    name: "The Lakesides",
    tag: "Water",
    desc: "Villas along Phewa Lake in Pokhara put you a few steps from still water, paddleboats, and the Annapurna range reflected on the surface.",
    img: "https://res.cloudinary.com/kmadmin/image/upload/v1735629428/kiomoi/lakeside_pokhara_9605.png",
  },
  {
    name: "The Jungles",
    tag: "Wild",
    desc: "Near Chitwan and Lumbini, stays back onto forest edges where rhinos graze at dawn and the birdsong starts before you do.",
    img: "https://www.greenmansionsresort.com/green/userfiles/images/about.jpg",
  },
];

const VALUES = [
  {
    title: "Verified in person",
    desc: "Every villa on VillaBaas is visited and photographed by our team before it's listed — no stock photos, no surprises at check-in.",
  },
  {
    title: "Local hosts, first",
    desc: "We work directly with Nepali homeowners and hosts, keeping more of what you pay inside the communities you're visiting.",
  },
  {
    title: "One point of contact",
    desc: "From booking to checkout, a single VillaBaas coordinator handles the details, so questions don't get lost between owner and guest.",
  },
];

export default function AboutPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarSrc = user?.profileImage ? `${API_URL}${user.profileImage}` : null;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const t = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(t)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#EEEEEE", fontFamily: "'DM Sans', sans-serif", color: "#1C1C1C" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.9rem 4vw",
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(14px)",
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
              fontSize: "0.88rem",
              color: l.label === "About" ? "#1C1C1C" : "#888",
              fontWeight: l.label === "About" ? 600 : 400,
              textDecoration: "none",
              borderBottom: l.label === "About" ? `2px solid ${BRAND_RED}` : "2px solid transparent",
              paddingBottom: 2,
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#1C1C1C")}
            onMouseLeave={e => { if (l.label !== "About") e.currentTarget.style.color = "#888"; }}
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
                {avatarSrc
                  ? <img src={avatarSrc} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <>{user.firstName?.[0]}{user.lastName?.[0]}</>
                }
              </div>
              {dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 12px)", right: 0,
                  background: "#fff", borderRadius: 16,
                  boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
                  border: "1px solid #f0f0f0",
                  minWidth: 210, zIndex: 999, overflow: "hidden",
                }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f5" }}>
                    <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1C1C1C", marginBottom: 2 }}>{user.firstName} {user.lastName}</p>
                    <p style={{ fontSize: "0.72rem", color: "#aaa" }}>{user.email}</p>
                  </div>
                  <a href="/dashboard/profile" onClick={() => setDropdownOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", textDecoration: "none", fontSize: "0.84rem", color: "#1C1C1C" }}>My Profile</a>
                  <a href="/dashboard/bookings" onClick={() => setDropdownOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", textDecoration: "none", fontSize: "0.84rem", color: "#1C1C1C" }}>My Bookings</a>
                  <button onClick={() => { setDropdownOpen(false); logout(); }} style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 16px",
                    background: "transparent", border: "none", fontSize: "0.84rem", color: BRAND_RED,
                    cursor: "pointer", borderTop: "1px solid #f5f5f5", fontFamily: "'DM Sans', sans-serif", textAlign: "left",
                  }}>Sign Out</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <div style={{ height: 70 }} />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", padding: "5.5rem 4vw 4rem", overflow: "hidden" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND_RED, marginBottom: "1rem" }}>
            About VillaBaas
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 700, lineHeight: 1.15, color: "#1C1C1C", marginBottom: "1.4rem" }}>
            A closer way to see<br /><span style={{ color: BRAND_RED, fontStyle: "italic" }}>Nepal</span>, from the inside
          </h1>
          <p style={{ fontSize: "1rem", color: "#666", lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
            VillaBaas connects travellers with private villas across Nepal's mountains, lakesides, and jungles — each one visited, verified, and hosted by people who actually live there.
          </p>
        </div>
      </div>

      {/* ── THREE LANDSCAPES (signature section) ─────────────────────────── */}
      <div style={{ padding: "0 4vw 4rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {LANDSCAPES.map(l => (
            <div key={l.name} style={{
              position: "relative", height: 420, borderRadius: 20, overflow: "hidden", cursor: "default",
            }}>
              <img src={l.img} alt={l.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 45%, transparent 70%)" }} />
              <div style={{ position: "absolute", top: 20, left: 20 }}>
                <span style={{
                  fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                  color: "#fff", background: "rgba(218,11,0,0.85)", padding: "5px 12px", borderRadius: 100,
                }}>{l.tag}</span>
              </div>
              <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, color: "#fff" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.6rem" }}>{l.name}</h3>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>{l.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── STORY ──────────────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", padding: "5rem 4vw" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3.5rem", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: BRAND_RED, marginBottom: "0.8rem" }}>
              Our Story
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#1C1C1C", marginBottom: "1.2rem", lineHeight: 1.25 }}>
              Built by people who kept getting the address wrong
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.85, marginBottom: "1rem" }}>
              VillaBaas started with a simple frustration: booking a villa in Nepal usually meant a photo from ten years ago, a phone number that didn't answer, and an address that didn't exist. We built VillaBaas to close that gap — a single place where every listing has been seen, every host is reachable, and every booking is confirmed before you land.
            </p>
            <p style={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.85 }}>
              Today that means villas from Pokhara's lakeside to the ridgelines above Nagarkot, each one chosen because it's a real, well-kept place someone would actually want to stay.
            </p>
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", height: 380 }}>
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000"
              alt="Nepal countryside"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      {/* ── VALUES ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: "5rem 4vw" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: BRAND_RED, marginBottom: "0.7rem" }}>
              How We Work
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#1C1C1C" }}>
              What every booking includes
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {VALUES.map(v => (
              <div key={v.title} style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 16, padding: "1.75rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#1C1C1C", marginBottom: "0.6rem" }}>{v.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#888", lineHeight: 1.75 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <div style={{ background: BRAND_RED, padding: "4rem 4vw", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>
          Ready to find your villa?
        </h2>
        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", marginBottom: "1.75rem" }}>
          Browse verified stays across Nepal's mountains, lakes, and jungles.
        </p>
        <button onClick={() => router.push("/dashboard/villas")} style={{
          background: "#fff", color: BRAND_RED, border: "none",
          padding: "13px 32px", borderRadius: 10, fontSize: "0.88rem", fontWeight: 700,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em",
        }}>
          Browse Villas
        </button>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{ background: "#1C1C1C", color: "rgba(255,255,255,0.5)", padding: "2rem 4vw" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: BRAND_RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="1.8">
                <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"/>
                <path d="M9 22V12h6v10"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#fff", fontWeight: 700 }}>VillaBaas</span>
          </div>
          <p style={{ fontSize: "0.75rem" }}>© 2025 VillaBaas. All rights reserved.</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Cookies"].map(l => (
              <a key={l} href="#" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}