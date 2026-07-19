"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";

const VILLAS = [
  {
    id: 1,
    name: "Methlang Villa",
    location: "Pokhara, Nepal",
    price: 17600,
    rating: 4.6,
    reviews: 92,
    guests: 12,
    rooms: 4,
    baths: 2,
    tag: "popular",
    img: "https://l.icdbcdn.com/oh/bae4bc48-3f95-4610-b83e-0e02eb91110e.jpg",
    amenities: ["Pool", "Mountain View", "WiFi", "Kitchen"],
    breakfastIncluded: true,
    dinnerIncluded: true,
  },
  {
    id: 2,
    name: "The Hideout Villa",
    location: "Pokhara, Nepal",
    price: 15200,
    rating: 4.5,
    reviews: 68,
    guests: 8,
    rooms: 4,
    baths: 2,
    tag: "immediate",
    img: "https://villathehideoutpokhara.np-hotel.com/data/Photos/OriginalPhoto/15839/1583906/1583906483/photo-the-hideout-villa-pokhara-pokhara-5.JPEG",
    amenities: ["WiFi", "Lake View", "Kitchen", "Air Conditioning"],
    breakfastIncluded: false,
    dinnerIncluded: false,
  },
  {
    id: 3,
    name: "Villa Karma Pokhara",
    location: "Pokhara, Nepal",
    price: 14200,
    rating: 4.5,
    reviews: 54,
    guests: 6,
    rooms: 3,
    baths: 2,
    tag: "new",
    img: "https://a0.muscache.com/im/pictures/miso/Hosting-1135974458065631357/original/b39e7d07-95cf-40fb-828b-5ae4dd376397.jpeg?im_w=1440",
    amenities: ["WiFi", "Lake View", "Garden", "Parking"],
    breakfastIncluded: false,
    dinnerIncluded: false,
  },
  {
    id: 4,
    name: "The Pipal Tree",
    location: "Kathmandu, Nepal",
    price: 12400,
    rating: 4.3,
    reviews: 41,
    guests: 8,
    rooms: 3,
    baths: 2,
    tag: "new",
    img: "https://media.vrbo.com/lodging/100000000/99800000/99794400/99794388/9ead10f2.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
    amenities: ["WiFi", "Kitchen", "Garden", "Parking"],
    breakfastIncluded: false,
    dinnerIncluded: false,
  },
  {
    id: 5,
    name: "Villa De Amore",
    location: "Kathmandu, Nepal",
    price: 19500,
    rating: 4.8,
    reviews: 116,
    guests: 10,
    rooms: 4,
    baths: 3,
    tag: "immediate",
    img: "https://www.villasnepal.com/storage/802/conversions/01KWTWP3A7QH4BZMQXAXNDW9Y8-hero_avif.webp",
    amenities: ["Pool", "WiFi", "Kitchen", "Mountain View"],
    breakfastIncluded: true,
    dinnerIncluded: false,
  },
  {
    id: 6,
    name: "Archid Villa",
    location: "Nagarkot, Nepal",
    price: 24000,
    rating: 4.7,
    reviews: 88,
    guests: 12,
    rooms: 5,
    baths: 3,
    tag: "popular",
    img: "https://archidvilla.com/wp-content/uploads/2026/05/6.jpeg",
    amenities: ["WiFi", "Pool", "Kitchen", "Mountain View", "Heating"],
    breakfastIncluded: true,
    dinnerIncluded: true,
  },
  {
    id: 7,
    name: "Farmhouse In Dhulikhel",
    location: "Kathmandu, Nepal",
    price: 9500,
    rating: 4.9,
    reviews: 34,
    guests: 6,
    rooms: 3,
    baths: 2,
    tag: "popular",
    img: "https://www.villasnepal.com/storage/213/conversions/01KCR3VQMHGZC8RC5HFJW17D36-hero_avif.webp",
    amenities: ["WiFi", "Fireplace", "Heater", "Kitchen"],
    breakfastIncluded: false,
    dinnerIncluded: false,
  },
  {
    id: 8,
    name: "Bella Vista Thecho",
    location: "Kathmandu, Nepal",
    price: 11500,
    rating: 4.6,
    reviews: 72,
    guests: 10,
    rooms: 4,
    baths: 4,
    tag: "popular",
    img: "https://www.villasnepal.com/storage/890/conversions/01KXSRPJ7HWBMGA4YRMQGMQF7D-hero_avif.webp",
    amenities: ["WiFi", "Air Conditioning", "Garden", "Restaurant"],
    breakfastIncluded: true,
    dinnerIncluded: true,
  },
  {
    id: 9,
    name: "Leopard Villa at Tiger Palace by Soaltee",
    location: "Lumbini, Nepal",
    price: 7500,
    rating: 4.7,
    reviews: 29,
    guests: 5,
    rooms: 2,
    baths: 2,
    tag: "immediate",
    img: "https://www.villasnepal.com/storage/330/conversions/01KHWRQJY78ARMKX5KVWWGX712-thumb_avif.webp",
    amenities: ["WiFi", "Meditation Space", "Bicycles"],
    breakfastIncluded: false,
    dinnerIncluded: false,
  },
  {
    id: 10,
    name: "Farmhouse In Nagarkot",
    location: "Nagarkot, Nepal",
    price: 8900,
    rating: 4.4,
    reviews: 47,
    guests: 6,
    rooms: 3,
    baths: 2,
    tag: "new",
    img: "https://www.villasnepal.com/storage/364/conversions/01KK6B9NDV1YBWNYNE92DGEPNS-hero_avif.webp",
    amenities: ["WiFi", "Garden Terrace", "Tea Tasting", "Kitchen"],
    breakfastIncluded: false,
    dinnerIncluded: false,
  },
];

const PLACES = ["All", "Pokhara", "Kathmandu", "Chitwan", "Nagarkot", "Mustang", "Lumbini", "Ilam"];
const CATEGORIES = ["New", "Popular", "Immediate"];
const BRAND_RED = "#DA0B00";

const NAV_LINKS = [
  { label: "Home",     href: "/dashboard" },
  { label: "Villas",   href: "/dashboard/villas" },
  { label: "Bookings", href: "/dashboard/bookings" },
  { label: "About",    href: "#" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [selectedPlace, setSelectedPlace]     = useState("All");
  const [selectedCategory, setSelectedCategory] = useState(1); // Popular
  const [searchQuery, setSearchQuery]         = useState("");
  const [guestCount, setGuestCount]           = useState(1);
  const [dateRange, setDateRange]             = useState({ checkIn: "", checkOut: "" });
  const [dropdownOpen, setDropdownOpen]       = useState(false);
  const [placePicker, setPlacePicker]         = useState(false);
  const [guestPicker, setGuestPicker]         = useState(false);
  const [hoveredVilla, setHoveredVilla]       = useState<number | null>(null);
  const [hoveredFeatured, setHoveredFeatured] = useState<number | null>(null);

  const dropdownRef  = useRef<HTMLDivElement>(null);
  const placeRef     = useRef<HTMLDivElement>(null);
  const guestRef     = useRef<HTMLDivElement>(null);

  const avatarSrc = user?.profileImage ? `${API_URL}${user.profileImage}` : null;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const t = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(t)) setDropdownOpen(false);
      if (placeRef.current  && !placeRef.current.contains(t))     setPlacePicker(false);
      if (guestRef.current  && !guestRef.current.contains(t))     setGuestPicker(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const tagMap: Record<number, string> = { 0: "new", 1: "popular", 2: "immediate" };
  const filteredVillas = VILLAS.filter(v => {
    const matchCategory = v.tag === tagMap[selectedCategory];
    const matchPlace    = selectedPlace === "All" || v.location.toLowerCase().includes(selectedPlace.toLowerCase());
    const matchSearch   = !searchQuery || v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGuests   = v.guests >= guestCount;
    return matchCategory && matchPlace && matchSearch && matchGuests;
  });

  const featuredVillas = VILLAS.filter(v => v.rating >= 4.5);

  function resetFilters() {
    setSelectedPlace("Pokhara");
    setSelectedCategory(1);
    setSearchQuery("");
    setGuestCount(1);
    setDateRange({ checkIn: "", checkOut: "" });
  }

  const tagColor = (tag: string) => {
    if (tag === "new")       return "#2563EB";
    if (tag === "popular")   return BRAND_RED;
    if (tag === "immediate") return "#16A34A";
    return "#888";
  };

  const dateLabel = dateRange.checkIn && dateRange.checkOut
    ? `${dateRange.checkIn} → ${dateRange.checkOut}`
    : "Add Dates";

  return (
    <div style={{ minHeight: "100vh", background: "#EEEEEE", fontFamily: "'DM Sans', sans-serif", color: "#1C1C1C", margin: 0, padding: 0, overflowX: "hidden" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 300,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.9rem 4vw",
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid #ebebeb",
        boxShadow: "0 1px 16px rgba(0,0,0,0.06)",
      }}>
        {/* Logo */}
        <a href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: BRAND_RED,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="1.8">
              <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"/>
              <path d="M9 22V12h6v10"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700, color: "#1C1C1C", letterSpacing: "0.01em" }}>VillaBaas</span>
        </a>

        {/* Nav links */}
        <div style={{ display: "flex", gap: "2rem" }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} style={{
              fontSize: "0.88rem",
              color: l.href === "/dashboard" ? "#1C1C1C" : "#888",
              fontWeight: l.href === "/dashboard" ? 600 : 400,
              textDecoration: "none",
              borderBottom: l.href === "/dashboard" ? `2px solid ${BRAND_RED}` : "2px solid transparent",
              paddingBottom: 2,
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#1C1C1C")}
            onMouseLeave={e => { if (l.href !== "/dashboard") e.currentTarget.style.color = "#888"; }}
            >{l.label}</a>
          ))}
        </div>

        {/* Right — avatar */}
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
                  {[
                    { label: "My Profile",  href: "/dashboard/profile",  icon: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#888" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                    { label: "My Bookings", href: "/dashboard/bookings", icon: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#888" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
                  ].map(item => (
                    <a key={item.label} href={item.href} onClick={() => setDropdownOpen(false)} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 16px", textDecoration: "none",
                      fontSize: "0.84rem", color: "#1C1C1C", background: "transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >{item.icon}{item.label}</a>
                  ))}
                  <button onClick={() => { setDropdownOpen(false); logout(); }} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "12px 16px",
                    background: "transparent", border: "none",
                    fontSize: "0.84rem", color: BRAND_RED,
                    cursor: "pointer", borderTop: "1px solid #f5f5f5",
                    fontFamily: "'DM Sans', sans-serif", textAlign: "left",
                    transition: "background 0.15s",
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

      {/* ── HERO SECTION ─────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", height: "92vh", minHeight: 560, overflow: "hidden" }}>
        <img
          src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-885171494011814801/original/d3076352-6619-4709-ac7c-e8a9aa7ae9c1.jpeg"
          alt="Nepal luxury villa"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, rgba(10,6,2,0.72) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 100%, rgba(40,20,0,0.45) 0%, transparent 70%)" }} />

        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -52%)",
          textAlign: "center", color: "#fff",
          width: "92%", maxWidth: 740,
        }}>
          <div style={{
            display: "inline-block",
            background: "rgba(218,11,0,0.85)",
            borderRadius: 100, padding: "5px 20px",
            fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase",
            marginBottom: "1.4rem", color: "#fff", fontWeight: 700,
          }}>
            The Ultimate Villa Experience
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.6rem, 5.8vw, 4.2rem)",
            fontWeight: 700, lineHeight: 1.1, marginBottom: "1.1rem",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
          }}>
            Discover Your Perfect<br />
            <span style={{ color: "#FFCDD0", fontStyle: "italic" }}>Getaway in Nepal</span>
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
              { label: "Destination", placeholder: "Pokhara", flex: "1 1 180px" },
              { label: "Check In",    placeholder: "Check in date", flex: "1 1 130px" },
              { label: "Check Out",   placeholder: "Check out date", flex: "1 1 130px" },
            ].map((field) => (
              <div key={field.label} style={{ flex: field.flex, padding: "16px 20px", borderRight: "1px solid #f0f0f0" }}>
                <div style={{ fontSize: "0.6rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 5 }}>
                  {field.label}
                </div>
                <input placeholder={field.placeholder} style={{ border: "none", outline: "none", fontSize: "0.9rem", color: "#1a1a1a", width: "100%", background: "transparent", fontFamily: "'DM Sans', sans-serif" }} />
              </div>
            ))}
            <div style={{ flex: "0 0 80px", padding: "16px 18px", borderRight: "1px solid #f0f0f0" }}>
              <div style={{ fontSize: "0.6rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 5 }}>Guests</div>
              <input type="number" defaultValue={2} min={1} style={{ border: "none", outline: "none", fontSize: "0.9rem", color: "#1a1a1a", width: "100%", background: "transparent", fontFamily: "'DM Sans', sans-serif" }} />
            </div>
            <button style={{
              flex: "0 0 auto",
              background: BRAND_RED,
              color: "#fff", border: "none", padding: "0 28px",
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
                <span style={{ color: "#FFCDD0" }}>✓</span> {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── SEARCH + FILTER SECTION ─────────────────────────────────────────── */}
      <div style={{ background: "#fff", padding: "1.5rem 4vw 1rem", borderBottom: "1px solid #ebebeb" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Title row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "#1C1C1C", marginBottom: 2 }}>
                Find Your Perfect Villa
              </h1>
              <p style={{ fontSize: "0.82rem", color: "#888" }}>
                Handpicked luxury stays across Nepal's most breathtaking destinations
              </p>
            </div>
            <button onClick={resetFilters} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", background: "transparent",
              border: `1.5px solid ${BRAND_RED}`, borderRadius: 8,
              fontSize: "0.8rem", color: BRAND_RED, fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
              </svg>
              Reset Filters
            </button>
          </div>

          {/* Search + filters row */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>

            {/* Search */}
            <div style={{ flex: "1 1 280px", position: "relative" }}>
              <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={BRAND_RED} strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search villas, locations..."
                style={{
                  width: "100%", height: 42, paddingLeft: 38, paddingRight: 14,
                  border: "1.5px solid #e5e5e5", borderRadius: 10,
                  fontSize: "0.85rem", color: "#1C1C1C", outline: "none",
                  fontFamily: "'DM Sans', sans-serif", background: "#FAFAFA",
                  transition: "border 0.2s",
                }}
                onFocus={e => (e.currentTarget.style.border = `1.5px solid ${BRAND_RED}`)}
                onBlur={e => (e.currentTarget.style.border = "1.5px solid #e5e5e5")}
              />
            </div>

            {/* Place picker */}
            <div ref={placeRef} style={{ position: "relative" }}>
              <button onClick={() => setPlacePicker(v => !v)} style={{
                height: 42, padding: "0 16px", display: "flex", alignItems: "center", gap: 8,
                border: `1.5px solid ${placePicker ? BRAND_RED : "#e5e5e5"}`, borderRadius: 10,
                background: "#FAFAFA", cursor: "pointer", fontSize: "0.85rem",
                color: "#1C1C1C", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
              }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={BRAND_RED} strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {selectedPlace}
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#888" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {placePicker && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0,
                  background: "#fff", borderRadius: 12, border: "1px solid #ebebeb",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)", zIndex: 200,
                  minWidth: 180, overflow: "hidden",
                }}>
                  {PLACES.map(p => (
                    <button key={p} onClick={() => { setSelectedPlace(p); setPlacePicker(false); }} style={{
                      display: "block", width: "100%", padding: "10px 16px",
                      textAlign: "left", background: p === selectedPlace ? "#FFF5F5" : "transparent",
                      border: "none", cursor: "pointer", fontSize: "0.84rem",
                      color: p === selectedPlace ? BRAND_RED : "#1C1C1C",
                      fontWeight: p === selectedPlace ? 600 : 400,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>{p}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Date range */}
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={BRAND_RED} strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                <input type="date" value={dateRange.checkIn}
                  onChange={e => setDateRange(d => ({ ...d, checkIn: e.target.value }))}
                  style={{
                    height: 42, paddingLeft: 32, paddingRight: 10,
                    border: "1.5px solid #e5e5e5", borderRadius: 10,
                    fontSize: "0.82rem", color: "#1C1C1C", outline: "none",
                    fontFamily: "'DM Sans', sans-serif", background: "#FAFAFA", cursor: "pointer",
                  }}
                  onFocus={e => (e.currentTarget.style.border = `1.5px solid ${BRAND_RED}`)}
                  onBlur={e => (e.currentTarget.style.border = "1.5px solid #e5e5e5")}
                />
              </div>
              <div style={{ position: "relative" }}>
                <input type="date" value={dateRange.checkOut}
                  onChange={e => setDateRange(d => ({ ...d, checkOut: e.target.value }))}
                  style={{
                    height: 42, paddingLeft: 12, paddingRight: 10,
                    border: "1.5px solid #e5e5e5", borderRadius: 10,
                    fontSize: "0.82rem", color: "#1C1C1C", outline: "none",
                    fontFamily: "'DM Sans', sans-serif", background: "#FAFAFA", cursor: "pointer",
                  }}
                  onFocus={e => (e.currentTarget.style.border = `1.5px solid ${BRAND_RED}`)}
                  onBlur={e => (e.currentTarget.style.border = "1.5px solid #e5e5e5")}
                />
              </div>
            </div>

            {/* Guest picker */}
            <div ref={guestRef} style={{ position: "relative" }}>
              <button onClick={() => setGuestPicker(v => !v)} style={{
                height: 42, padding: "0 16px", display: "flex", alignItems: "center", gap: 8,
                border: `1.5px solid ${guestPicker ? BRAND_RED : "#e5e5e5"}`, borderRadius: 10,
                background: "#FAFAFA", cursor: "pointer", fontSize: "0.85rem",
                color: "#1C1C1C", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
              }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={BRAND_RED} strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
                {guestCount === 1 ? "1 Guest" : `${guestCount} Guests`}
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#888" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {guestPicker && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "#fff", borderRadius: 14, border: "1px solid #ebebeb",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)", zIndex: 200,
                  padding: "1.25rem 1.5rem", minWidth: 180,
                }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1C1C1C", marginBottom: "1rem" }}>Number of Guests</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
                    <button onClick={() => setGuestCount(g => Math.max(1, g - 1))} style={{
                      width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${BRAND_RED}`,
                      background: "transparent", color: BRAND_RED, fontSize: "1.2rem",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>−</button>
                    <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1C1C1C", minWidth: 28, textAlign: "center" }}>{guestCount}</span>
                    <button onClick={() => setGuestCount(g => Math.min(20, g + 1))} style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: BRAND_RED, border: "none", color: "#fff", fontSize: "1.2rem",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>+</button>
                  </div>
                  <button onClick={() => setGuestPicker(false)} style={{
                    width: "100%", marginTop: "1rem", height: 36, background: BRAND_RED,
                    border: "none", borderRadius: 8, color: "#fff", fontSize: "0.82rem",
                    fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}>Apply</button>
                </div>
              )}
            </div>
          </div>

          {/* Category tabs — matches mobile exactly */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "1.25rem", borderBottom: "1px solid #f0f0f0", paddingBottom: "0" }}>
            {CATEGORIES.map((cat, i) => (
              <button key={cat} onClick={() => setSelectedCategory(i)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "0.88rem", fontWeight: i === selectedCategory ? 600 : 400,
                color: i === selectedCategory ? "#1C1C1C" : "#888",
                fontFamily: "'DM Sans', sans-serif",
                paddingBottom: "0.75rem",
                borderBottom: i === selectedCategory ? `3px solid ${BRAND_RED}` : "3px solid transparent",
                transition: "all 0.2s",
              }}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 4vw" }}>

        {/* ── PLACE LABEL ──────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#1C1C1C" }}>
              {selectedPlace === "All" ? "All Locations" : selectedPlace}
            </h2>
            <span style={{ fontSize: "0.78rem", color: "#888", background: "#f0f0f0", padding: "3px 10px", borderRadius: 20 }}>
              {filteredVillas.length} villas
            </span>
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{
              fontSize: "0.8rem", color: BRAND_RED, background: "none",
              border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Clear search ×</button>
          )}
        </div>

        {/* ── FEATURED VILLAS (horizontal scroll) ──────────────────────────── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#1C1C1C" }}>
              Featured Villas
            </h3>
            <span style={{
              fontSize: "0.72rem", fontWeight: 700, color: BRAND_RED,
              background: "#FFF0F0", padding: "4px 12px", borderRadius: 20,
              letterSpacing: "0.04em",
            }}>✦ Special Offers</span>
          </div>
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.75rem", scrollbarWidth: "none" }}>
            {featuredVillas.map(v => (
              <div key={v.id}
                onMouseEnter={() => setHoveredFeatured(v.id)}
                onMouseLeave={() => setHoveredFeatured(null)}
                style={{
                  flexShrink: 0, width: 220, height: 200,
                  borderRadius: 16, overflow: "hidden", position: "relative", cursor: "pointer",
                  boxShadow: hoveredFeatured === v.id ? "0 12px 40px rgba(0,0,0,0.18)" : "0 4px 16px rgba(0,0,0,0.08)",
                  transform: hoveredFeatured === v.id ? "translateY(-4px)" : "translateY(0)",
                  transition: "all 0.25s",
                }}>
                <img src={v.img} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover",
                  transform: hoveredFeatured === v.id ? "scale(1.05)" : "scale(1)", transition: "transform 0.4s" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%)" }} />
                {/* Rating badge */}
                <div style={{
                  position: "absolute", top: 10, right: 10,
                  background: "rgba(255,255,255,0.92)", borderRadius: 20,
                  padding: "3px 8px", display: "flex", alignItems: "center", gap: 3,
                }}>
                  <span style={{ color: "#F59E0B", fontSize: "0.75rem" }}>★</span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1C1C1C" }}>{v.rating}</span>
                </div>
                <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, color: "#fff" }}>
                  <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>{v.location}</p>
                  <p style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: 3, lineHeight: 1.2 }}>{v.name}</p>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600 }}>NPR {v.price.toLocaleString()} / night</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── VILLA GRID ────────────────────────────────────────────────────── */}
        {filteredVillas.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#fff", borderRadius: 20, border: "1px solid #ebebeb" }}>
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ccc" strokeWidth="1.5" style={{ marginBottom: "1rem" }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6M11 8v6" transform="rotate(45 11 11)"/>
            </svg>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#aaa", marginBottom: "0.5rem" }}>No villas found</p>
            <p style={{ fontSize: "0.84rem", color: "#bbb", marginBottom: "1.25rem" }}>Try adjusting your filters or location</p>
            <button onClick={resetFilters} style={{
              padding: "10px 24px", background: BRAND_RED, color: "#fff",
              border: "none", borderRadius: 10, fontSize: "0.84rem",
              fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Reset Filters</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {filteredVillas.map(v => (
              <div key={v.id}
                onMouseEnter={() => setHoveredVilla(v.id)}
                onMouseLeave={() => setHoveredVilla(null)}
                style={{
                  background: "#fff", borderRadius: 20, overflow: "hidden",
                  boxShadow: hoveredVilla === v.id ? "0 12px 40px rgba(0,0,0,0.1)" : "0 4px 16px rgba(0,0,0,0.06)",
                  transform: hoveredVilla === v.id ? "translateY(-4px)" : "translateY(0)",
                  transition: "all 0.25s", cursor: "pointer",
                }}
                onClick={() => router.push(`/dashboard/villas/${v.id}`)}
              >
                {/* Image */}
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <img src={v.img} alt={v.name} style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transform: hoveredVilla === v.id ? "scale(1.04)" : "scale(1)",
                    transition: "transform 0.4s",
                  }} />
                  {/* Tag badge */}
                  <span style={{
                    position: "absolute", top: 12, left: 12,
                    background: tagColor(v.tag), color: "#fff",
                    padding: "4px 12px", borderRadius: 20,
                    fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}>{v.tag}</span>
                  {/* Meal badges */}
                  {(v.breakfastIncluded || v.dinnerIncluded) && (
                    <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", gap: 4 }}>
                      {v.breakfastIncluded && (
                        <span style={{ background: "rgba(255,255,255,0.92)", borderRadius: 20, padding: "3px 8px", fontSize: "0.6rem", fontWeight: 600, color: "#16A34A" }}>🍳 Breakfast</span>
                      )}
                      {v.dinnerIncluded && (
                        <span style={{ background: "rgba(255,255,255,0.92)", borderRadius: 20, padding: "3px 8px", fontSize: "0.6rem", fontWeight: 600, color: "#16A34A" }}>🍽️ Dinner</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: "14px 16px 16px" }}>
                  <p style={{ fontSize: "0.72rem", color: "#888", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#bbb" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {v.location}
                  </p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "#1C1C1C", marginBottom: 6, lineHeight: 1.3 }}>{v.name}</h3>
                  <p style={{ fontSize: "0.75rem", color: "#888", marginBottom: 8 }}>
                    Up to {v.guests} guests · {v.rooms} rooms · {v.baths} baths
                  </p>

                  {/* Stars */}
                  <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 12 }}>
                    {[1,2,3,4,5].map(i => (
                      <span key={i} style={{ color: i <= Math.floor(v.rating) ? "#F59E0B" : "#e5e5e5", fontSize: "0.78rem" }}>★</span>
                    ))}
                    <span style={{ fontSize: "0.7rem", color: "#aaa", marginLeft: 3 }}>{v.rating} · {v.reviews} reviews</span>
                  </div>

                  {/* Price + CTA */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: BRAND_RED, lineHeight: 1 }}>
                        NPR {v.price.toLocaleString()}
                      </p>
                      <p style={{ fontSize: "0.68rem", color: "#aaa" }}>per night</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); router.push(`/dashboard/villas/${v.id}`); }}
                      style={{
                        height: 36, padding: "0 18px",
                        background: BRAND_RED, color: "#fff",
                        border: "none", borderRadius: 10,
                        fontSize: "0.78rem", fontWeight: 600,
                        cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── GUEST STORIES ────────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", padding: "5rem 4vw" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: BRAND_RED, fontWeight: 700, marginBottom: "0.6rem" }}>
              Guest Stories
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, color: "#1C1C1C", marginBottom: "0.7rem" }}>
              What Our Guests Say
            </h2>
            <p style={{ color: "#888", fontSize: "0.93rem", maxWidth: 420, margin: "0 auto", lineHeight: 1.75 }}>
              Discover why discerning travellers choose VillaBaas for their Nepal experiences.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[
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
            ].map((t) => (
              <div key={t.name} style={{ background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 20, padding: "1.75rem" }}>
                <div style={{ display: "flex", marginBottom: "0.9rem" }}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} style={{ color: "#F59E0B", fontSize: "0.95rem" }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: "0.88rem", color: "#444", lineHeight: 1.8, marginBottom: "1.4rem", fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1C1C1C", marginBottom: 2 }}>{t.name}</p>
                    <p style={{ fontSize: "0.72rem", color: "#aaa" }}>{t.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS BAND ───────────────────────────────────────────────────────── */}
      <div style={{ background: BRAND_RED, padding: "3rem 4vw", marginTop: "2rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", textAlign: "center" }}>
          {[
            { num: "500+", label: "Luxury Villas" },
            { num: "12K+", label: "Happy Guests" },
            { num: "14",   label: "Districts Covered" },
            { num: "4.8★", label: "Average Rating" },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: "#fff", marginBottom: "0.2rem" }}>{s.num}</p>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        @media (max-width: 768px) {
          nav { padding: 0.75rem 4vw !important; }
          nav > div:nth-child(2) { display: none !important; }
        }
      `}</style>
    </div>
  );
}