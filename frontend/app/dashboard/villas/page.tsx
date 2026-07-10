"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";
const BRAND_RED = "#DA0B00";

const VILLAS = [
  {
    id: 1,
    name: "Methlang Villa",
    location: "Pokhara, Nepal",
    address: "Lakeside, Pokhara, Gandaki",
    price: 17600,
    rating: 4.6,
    reviews: 92,
    guests: 12,
    rooms: 4,
    baths: 2,
    tag: "popular",
    type: "Lakeside",
    img: "https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=800&q=85",
    amenities: ["Pool", "Mountain View", "WiFi", "Kitchen"],
    breakfastIncluded: true,
    dinnerIncluded: true,
  },
  {
    id: 2,
    name: "The Hideout Villa",
    location: "Pokhara, Nepal",
    address: "Fewa Lakeside, Pokhara, Gandaki",
    price: 15200,
    rating: 4.5,
    reviews: 68,
    guests: 8,
    rooms: 4,
    baths: 2,
    tag: "immediate",
    type: "Lakeside",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=85",
    amenities: ["WiFi", "Lake View", "Kitchen", "Air Conditioning"],
    breakfastIncluded: false,
    dinnerIncluded: false,
  },
  {
    id: 3,
    name: "Fewa Lake Retreat",
    location: "Pokhara, Nepal",
    address: "Lakeside, Pokhara, Gandaki",
    price: 14200,
    rating: 4.5,
    reviews: 54,
    guests: 6,
    rooms: 3,
    baths: 2,
    tag: "new",
    type: "Lakeside",
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=85",
    amenities: ["WiFi", "Lake View", "Garden", "Parking"],
    breakfastIncluded: false,
    dinnerIncluded: false,
  },
  {
    id: 4,
    name: "The Pipal Tree",
    location: "Kathmandu, Nepal",
    address: "Patan Durbar, Lalitpur, Bagmati",
    price: 12400,
    rating: 4.3,
    reviews: 41,
    guests: 8,
    rooms: 3,
    baths: 2,
    tag: "new",
    type: "Heritage",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=85",
    amenities: ["WiFi", "Kitchen", "Garden", "Parking"],
    breakfastIncluded: false,
    dinnerIncluded: false,
  },
  {
    id: 5,
    name: "Villa De Amore",
    location: "Kathmandu, Nepal",
    address: "Bhaktapur Durbar, Bagmati",
    price: 19500,
    rating: 4.8,
    reviews: 116,
    guests: 10,
    rooms: 4,
    baths: 3,
    tag: "immediate",
    type: "Heritage",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=85",
    amenities: ["Pool", "WiFi", "Kitchen", "Mountain View"],
    breakfastIncluded: true,
    dinnerIncluded: false,
  },
  {
    id: 6,
    name: "Archid Villa",
    location: "Nagarkot, Nepal",
    address: "Nagarkot Hill, Bhaktapur, Bagmati",
    price: 24000,
    rating: 4.7,
    reviews: 88,
    guests: 12,
    rooms: 5,
    baths: 3,
    tag: "popular",
    type: "Mountain",
    img: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=85",
    amenities: ["WiFi", "Pool", "Kitchen", "Mountain View", "Heating"],
    breakfastIncluded: true,
    dinnerIncluded: true,
  },
  {
    id: 7,
    name: "Mustang Stone House",
    location: "Mustang, Nepal",
    address: "Lo Manthang, Upper Mustang, Gandaki",
    price: 9500,
    rating: 4.9,
    reviews: 34,
    guests: 6,
    rooms: 3,
    baths: 2,
    tag: "popular",
    type: "Mountain",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85",
    amenities: ["WiFi", "Fireplace", "Heater", "Kitchen"],
    breakfastIncluded: false,
    dinnerIncluded: false,
  },
  {
    id: 8,
    name: "Chitwan Safari Lodge",
    location: "Chitwan, Nepal",
    address: "Sauraha, Chitwan, Narayani",
    price: 11500,
    rating: 4.6,
    reviews: 72,
    guests: 10,
    rooms: 4,
    baths: 4,
    tag: "popular",
    type: "Jungle",
    img: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=85",
    amenities: ["WiFi", "Air Conditioning", "Garden", "Restaurant"],
    breakfastIncluded: true,
    dinnerIncluded: true,
  },
  {
    id: 9,
    name: "Lumbini Zen Villa",
    location: "Lumbini, Nepal",
    address: "Lumbini Peace Zone, Rupandehi",
    price: 7500,
    rating: 4.7,
    reviews: 29,
    guests: 5,
    rooms: 2,
    baths: 2,
    tag: "immediate",
    type: "Jungle",
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=85",
    amenities: ["WiFi", "Meditation Space", "Bicycles"],
    breakfastIncluded: false,
    dinnerIncluded: false,
  },
  {
    id: 10,
    name: "Ilam Tea Garden Villa",
    location: "Ilam, Nepal",
    address: "Ilam Bazaar, Ilam, Province 1",
    price: 8900,
    rating: 4.4,
    reviews: 47,
    guests: 6,
    rooms: 3,
    baths: 2,
    tag: "new",
    type: "Jungle",
    img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=85",
    amenities: ["WiFi", "Garden Terrace", "Tea Tasting", "Kitchen"],
    breakfastIncluded: false,
    dinnerIncluded: false,
  },
];

const PLACES    = ["All", "Pokhara", "Kathmandu", "Chitwan", "Nagarkot", "Mustang", "Lumbini", "Ilam"];
const TYPES     = ["All", "Lakeside", "Mountain", "Jungle", "Heritage"];
const CATEGORIES = ["New", "Popular", "Immediate"];

const PRICE_RANGES = [
  { label: "Up to NPR 10,000",        min: 0,     max: 10000 },
  { label: "NPR 10,000 – 20,000",     min: 10000, max: 20000 },
  { label: "NPR 20,000 – 30,000",     min: 20000, max: 30000 },
  { label: "Above NPR 30,000",        min: 30000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Highest Rated",      value: "rating-desc" },
  { label: "Newest First",       value: "newest" },
];

const AMENITIES_FILTER = ["Pool", "WiFi", "Kitchen", "Mountain View", "Lake View", "Garden", "Breakfast Included"];

const NAV_LINKS = [
  { label: "Home",     href: "/dashboard" },
  { label: "Villas",   href: "/dashboard/villas" },
  { label: "Bookings", href: "/dashboard/bookings" },
  { label: "About",    href: "#" },
];

const tagColor = (tag: string) => {
  if (tag === "new")       return "#2563EB";
  if (tag === "popular")   return BRAND_RED;
  if (tag === "immediate") return "#16A34A";
  return "#888";
};

export default function VillasPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [selectedPlace,    setSelectedPlace]    = useState("All");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery,      setSearchQuery]      = useState("");
  const [guestCount,       setGuestCount]       = useState(1);
  const [activeType,       setActiveType]       = useState("All");
  const [priceRanges,      setPriceRanges]      = useState<number[]>([]);
  const [amenities,        setAmenities]        = useState<string[]>([]);
  const [sortBy,           setSortBy]           = useState("price-asc");
  const [visible,          setVisible]          = useState(8);
  const [dropdownOpen,     setDropdownOpen]     = useState(false);
  const [placePicker,      setPlacePicker]      = useState(false);
  const [guestPicker,      setGuestPicker]      = useState(false);
  const [hoveredVilla,     setHoveredVilla]     = useState<number | null>(null);
  const [dateRange,        setDateRange]        = useState({ checkIn: "", checkOut: "" });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const placeRef    = useRef<HTMLDivElement>(null);
  const guestRef    = useRef<HTMLDivElement>(null);

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

  const filtered = VILLAS.filter(v => {
    const matchSearch   = !searchQuery || v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPlace    = selectedPlace === "All" || v.location.toLowerCase().includes(selectedPlace.toLowerCase());
    const matchCategory = selectedCategory === null || v.tag === tagMap[selectedCategory];
    const matchType     = activeType === "All" || v.type === activeType;
    const matchPrice    = priceRanges.length === 0 || priceRanges.some(i => v.price >= PRICE_RANGES[i].min && v.price <= PRICE_RANGES[i].max);
    const matchAmen     = amenities.length === 0 || amenities.every(a => {
      if (a === "Breakfast Included") return v.breakfastIncluded;
      return v.amenities.includes(a);
    });
    const matchGuests = v.guests >= guestCount;
    return matchSearch && matchPlace && matchCategory && matchType && matchPrice && matchAmen && matchGuests;
  }).sort((a, b) => {
    if (sortBy === "price-asc")   return a.price - b.price;
    if (sortBy === "price-desc")  return b.price - a.price;
    if (sortBy === "rating-desc") return b.rating - a.rating;
    return b.id - a.id;
  });

  const shown = filtered.slice(0, visible);

  function resetFilters() {
    setSelectedPlace("All");
    setSelectedCategory(null);
    setSearchQuery("");
    setGuestCount(1);
    setActiveType("All");
    setPriceRanges([]);
    setAmenities([]);
    setSortBy("price-asc");
    setDateRange({ checkIn: "", checkOut: "" });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#EEEEEE", fontFamily: "'DM Sans', sans-serif", color: "#1C1C1C", margin: 0, padding: 0, overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 300,
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
              color: l.href === "/dashboard/villas" ? "#1C1C1C" : "#888",
              fontWeight: l.href === "/dashboard/villas" ? 600 : 400,
              textDecoration: "none",
              borderBottom: l.href === "/dashboard/villas" ? `2px solid ${BRAND_RED}` : "2px solid transparent",
              paddingBottom: 2, transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#1C1C1C")}
            onMouseLeave={e => { if (l.href !== "/dashboard/villas") e.currentTarget.style.color = "#888"; }}
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
                      display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                      textDecoration: "none", fontSize: "0.84rem", color: "#1C1C1C", background: "transparent",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >{item.icon}{item.label}</a>
                  ))}
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

      {/* ── SEARCH + FILTER BAR ── */}
      <div style={{ background: "#fff", padding: "1.5rem 4vw 1rem", borderBottom: "1px solid #ebebeb" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: "#1C1C1C", marginBottom: 2 }}>
                All Villas in Nepal
              </h1>
              <p style={{ fontSize: "0.82rem", color: "#888" }}>
                {filtered.length} villas found · Handpicked luxury stays across Nepal
              </p>
            </div>
            <button onClick={resetFilters} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
              background: "transparent", border: `1.5px solid ${BRAND_RED}`, borderRadius: 8,
              fontSize: "0.8rem", color: BRAND_RED, fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
              </svg>
              Reset Filters
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div style={{ flex: "1 1 280px", position: "relative" }}>
              <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={BRAND_RED} strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search villas, locations..."
                style={{
                  width: "100%", height: 42, paddingLeft: 38, paddingRight: 14,
                  border: "1.5px solid #e5e5e5", borderRadius: 10,
                  fontSize: "0.85rem", color: "#1C1C1C", outline: "none",
                  fontFamily: "'DM Sans', sans-serif", background: "#FAFAFA",
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
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#888" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {placePicker && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0,
                  background: "#fff", borderRadius: 12, border: "1px solid #ebebeb",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)", zIndex: 200, minWidth: 180, overflow: "hidden",
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
                </svg>
                {guestCount === 1 ? "1 Guest" : `${guestCount} Guests`}
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#888" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {guestPicker && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "#fff", borderRadius: 14, border: "1px solid #ebebeb",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)", zIndex: 200, padding: "1.25rem 1.5rem", minWidth: 180,
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

          {/* Category + Type tabs */}
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.25rem", borderBottom: "1px solid #f0f0f0", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat, i) => (
              <button key={cat} onClick={() => setSelectedCategory(selectedCategory === i ? null : i)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "0.88rem", fontWeight: selectedCategory === i ? 600 : 400,
                color: selectedCategory === i ? "#1C1C1C" : "#888",
                fontFamily: "'DM Sans', sans-serif", paddingBottom: "0.75rem",
                borderBottom: selectedCategory === i ? `3px solid ${BRAND_RED}` : "3px solid transparent",
                transition: "all 0.2s",
              }}>{cat}</button>
            ))}
            <div style={{ width: 1, background: "#e5e5e5", margin: "0 0.5rem 0.75rem" }} />
            {TYPES.map(t => (
              <button key={t} onClick={() => setActiveType(t)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "0.88rem", fontWeight: activeType === t ? 600 : 400,
                color: activeType === t ? "#1C1C1C" : "#888",
                fontFamily: "'DM Sans', sans-serif", paddingBottom: "0.75rem",
                borderBottom: activeType === t ? `3px solid ${BRAND_RED}` : "3px solid transparent",
                transition: "all 0.2s",
              }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 4vw", display: "flex", gap: "2rem", alignItems: "flex-start" }}>

        {/* ── FILTERS SIDEBAR ── */}
        <aside style={{
          width: 230, flexShrink: 0, position: "sticky", top: 88,
          background: "#fff", borderRadius: 16, padding: "1.25rem", border: "1px solid #e5e5e5",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1C1C1C" }}>Filters</p>
            <button onClick={resetFilters} style={{ fontSize: "0.72rem", color: BRAND_RED, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Clear</button>
          </div>

          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.6rem" }}>Popular Filters</p>
          {["Pool", "WiFi", "Kitchen", "Mountain View", "Lake View"].map(a => (
            <label key={a} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: "0.82rem", color: "#555" }}>
              <input type="checkbox" checked={amenities.includes(a)} onChange={() => setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])}
                style={{ accentColor: BRAND_RED, width: 15, height: 15 }} />
              {a}
            </label>
          ))}

          <div style={{ height: 1, background: "#f0f0f0", margin: "1rem 0" }} />

          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.6rem" }}>Price per Night</p>
          {PRICE_RANGES.map((r, i) => (
            <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: "0.82rem", color: "#555" }}>
              <input type="checkbox" checked={priceRanges.includes(i)} onChange={() => setPriceRanges(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                style={{ accentColor: BRAND_RED, width: 15, height: 15 }} />
              {r.label}
            </label>
          ))}

          <div style={{ height: 1, background: "#f0f0f0", margin: "1rem 0" }} />

          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.6rem" }}>Sort By</p>
          {SORT_OPTIONS.map(s => (
            <label key={s.value} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: "0.82rem", color: "#555" }}>
              <input type="radio" name="sort" value={s.value} checked={sortBy === s.value} onChange={() => setSortBy(s.value)}
                style={{ accentColor: BRAND_RED, width: 15, height: 15 }} />
              {s.label}
            </label>
          ))}
        </aside>

        {/* ── VILLA GRID ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#fff", borderRadius: 20, border: "1px solid #ebebeb" }}>
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ccc" strokeWidth="1.5" style={{ marginBottom: "1rem" }}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
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
              {shown.map(v => (
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
                  <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                    <img src={v.img} alt={v.name} style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      transform: hoveredVilla === v.id ? "scale(1.04)" : "scale(1)",
                      transition: "transform 0.4s",
                    }} />
                    <span style={{
                      position: "absolute", top: 12, left: 12,
                      background: tagColor(v.tag), color: "#fff",
                      padding: "4px 12px", borderRadius: 20,
                      fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>{v.tag}</span>
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
                    <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 12 }}>
                      {[1,2,3,4,5].map(i => (
                        <span key={i} style={{ color: i <= Math.floor(v.rating) ? "#F59E0B" : "#e5e5e5", fontSize: "0.78rem" }}>★</span>
                      ))}
                      <span style={{ fontSize: "0.7rem", color: "#aaa", marginLeft: 3 }}>{v.rating} · {v.reviews} reviews</span>
                    </div>
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
                          height: 36, padding: "0 18px", background: BRAND_RED, color: "#fff",
                          border: "none", borderRadius: 10, fontSize: "0.78rem", fontWeight: 600,
                          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "opacity 0.2s",
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

          {visible < filtered.length && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button onClick={() => setVisible(v => v + 4)} style={{
                height: 44, padding: "0 32px", background: "transparent",
                border: `1.5px solid ${BRAND_RED}`, borderRadius: 10,
                fontSize: "0.85rem", fontWeight: 600, color: BRAND_RED,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = BRAND_RED;
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = BRAND_RED;
              }}
              >Show More</button>
            </div>
          )}
        </div>
      </div>

      {/* ── STATS BAND ── */}
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

      {/* ── FOOTER ── */}
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
          nav > div:nth-child(2) { display: none !important; }
          aside { display: none !important; }
        }
      `}</style>
    </div>
  );
}