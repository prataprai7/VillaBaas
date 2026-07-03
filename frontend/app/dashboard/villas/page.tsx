"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";

const VILLAS = [
    {
        id: 1,
        name: "Pokhara Lakeside Villa",
        address: "Lakeside, Pokhara, Gandaki",
        location: "Pokhara, Nepal",
        price: 45000,
        rating: 4.9,
        reviews: 128,
        img: "https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=600&q=80",
        amenities: ["Mountain View", "Private Pool", "Free WiFi"],
        badge: "Best Seller",
        type: "Lakeside",
    },
    {
        id: 2,
        name: "Nagarkot Mountain Retreat",
        address: "Nagarkot Hill, Bhaktapur, Bagmati",
        location: "Nagarkot, Nepal",
        price: 32000,
        rating: 4.8,
        reviews: 94,
        img: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=600&q=80",
        amenities: ["Himalaya View", "Fireplace", "Breakfast Included"],
        badge: null,
        type: "Mountain",
    },
    {
        id: 3,
        name: "Chitwan Jungle Estate",
        address: "Sauraha, Chitwan, Narayani",
        location: "Chitwan, Nepal",
        price: 28000,
        rating: 4.7,
        reviews: 76,
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        amenities: ["Safari Access", "Garden", "Room Service"],
        badge: "New",
        type: "Jungle",
    },
    {
        id: 4,
        name: "Mustang Desert Villa",
        address: "Lo Manthang, Upper Mustang, Gandaki",
        location: "Upper Mustang, Nepal",
        price: 55000,
        rating: 5.0,
        reviews: 42,
        img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
        amenities: ["Desert View", "Rooftop Deck", "Private Chef"],
        badge: "Luxury",
        type: "Mountain",
    },
    {
        id: 5,
        name: "Kathmandu Heritage Haveli",
        address: "Patan Durbar Square, Lalitpur, Bagmati",
        location: "Lalitpur, Nepal",
        price: 38000,
        rating: 4.6,
        reviews: 110,
        img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
        amenities: ["Heritage Building", "City View", "Free WiFi"],
        badge: null,
        type: "Heritage",
    },
    {
        id: 6,
        name: "Bandipur Hilltop Villa",
        address: "Bandipur Bazaar, Tanahun, Gandaki",
        location: "Bandipur, Nepal",
        price: 22000,
        rating: 4.5,
        reviews: 58,
        img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
        amenities: ["Valley View", "Garden", "Breakfast Included"],
        badge: null,
        type: "Heritage",
    },
    {
        id: 7,
        name: "Rara Lake Wilderness Villa",
        address: "Rara National Park, Mugu, Karnali",
        location: "Mugu, Nepal",
        price: 62000,
        rating: 5.0,
        reviews: 24,
        img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
        amenities: ["Lake View", "Trekking Access", "All Inclusive"],
        badge: "Luxury",
        type: "Lakeside",
    },
    {
        id: 8,
        name: "Ilam Tea Garden Cottage",
        address: "Ilam Bazaar, Ilam, Province 1",
        location: "Ilam, Nepal",
        price: 18000,
        rating: 4.4,
        reviews: 87,
        img: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=600&q=80",
        amenities: ["Tea Garden", "Garden", "Free WiFi"],
        badge: null,
        type: "Jungle",
    },
];

const TYPES = ["All", "Lakeside", "Mountain", "Jungle", "Heritage"];

const PRICE_RANGES = [
    { label: "Up to NPR 25,000", min: 0, max: 25000 },
    { label: "NPR 25,000 – 40,000", min: 25000, max: 40000 },
    { label: "NPR 40,000 – 60,000", min: 40000, max: 60000 },
    { label: "Above NPR 60,000", min: 60000, max: Infinity },
];

const SORT_OPTIONS = [
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Highest Rated", value: "rating-desc" },
    { label: "Newest First", value: "newest" },
];

const AMENITIES_FILTER = [
    "Mountain View", "Private Pool", "Free WiFi",
    "Breakfast Included", "Room Service", "Garden",
];

export default function VillasPage() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const [search, setSearch]           = useState("");
    const [activeType, setActiveType]   = useState("All");
    const [priceRanges, setPriceRanges] = useState<number[]>([]);
    const [amenities, setAmenities]     = useState<string[]>([]);
    const [sortBy, setSortBy]           = useState("price-asc");
    const [visible, setVisible]         = useState(6);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            const t = e.target as HTMLElement;
            if (!t.closest("[data-dropdown]")) setDropdownOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const avatarSrc = user?.profileImage ? `${API_URL}${user.profileImage}` : null;

    const filtered = VILLAS.filter(v => {
        const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.location.toLowerCase().includes(search.toLowerCase());
        const matchType   = activeType === "All" || v.type === activeType;
        const matchPrice  = priceRanges.length === 0 || priceRanges.some(i => v.price >= PRICE_RANGES[i].min && v.price <= PRICE_RANGES[i].max);
        const matchAmen   = amenities.length === 0 || amenities.every(a => v.amenities.includes(a));
        return matchSearch && matchType && matchPrice && matchAmen;
    }).sort((a, b) => {
        if (sortBy === "price-asc")    return a.price - b.price;
        if (sortBy === "price-desc")   return b.price - a.price;
        if (sortBy === "rating-desc")  return b.rating - a.rating;
        return b.id - a.id;
    });

    const shown = filtered.slice(0, visible);

    function togglePriceRange(i: number) {
        setPriceRanges(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
    }

    function toggleAmenity(a: string) {
        setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
    }

    function clearFilters() {
        setPriceRanges([]);
        setAmenities([]);
        setActiveType("All");
        setSearch("");
        setSortBy("price-asc");
    }

    const inp: React.CSSProperties = {
        height: 42, border: "1.5px solid #E8E2D9", borderRadius: 8,
        padding: "0 14px", fontSize: "0.85rem", color: "#1a1a1a",
        background: "#FAF7F2", outline: "none", fontFamily: "'DM Sans', sans-serif",
    };

    return (
        <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a", margin: 0, padding: 0 }}>

            {/* ── NAVBAR ── */}
            <nav style={{
                position: "sticky", top: 0, zIndex: 200,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "1rem 4vw",
                background: "rgba(255,255,255,0.97)",
                backdropFilter: "blur(14px)",
                borderBottom: "1px solid #ebebeb",
                boxShadow: "0 1px 20px rgba(0,0,0,0.06)",
            }}>
                <a href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#1A1A1A,#2d2517)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#E8D5B0" strokeWidth="1.6">
                            <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"/>
                            <path d="M9 22V12h6v10"/>
                        </svg>
                    </div>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 600, letterSpacing: "0.04em", color: "#1a1a1a" }}>VillaBaas</span>
                </a>

                <div style={{ display: "flex", gap: "2rem" }}>
                    {[
                        { label: "Home",        href: "/dashboard" },
                        { label: "Villas",      href: "/dashboard/villas" },
                        { label: "Experiences", href: "#" },
                        { label: "About",       href: "#" },
                    ].map(l => (
                        <a key={l.label} href={l.href} style={{
                            fontSize: "0.88rem",
                            color: l.href === "/dashboard/villas" ? "#1a1a1a" : "#555",
                            fontWeight: l.href === "/dashboard/villas" ? 600 : 400,
                            textDecoration: "none",
                            borderBottom: l.href === "/dashboard/villas" ? "2px solid #C9A96E" : "2px solid transparent",
                            paddingBottom: 2,
                        }}>{l.label}</a>
                    ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#666" strokeWidth="1.8">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>

                    {user && (
                        <div data-dropdown style={{ position: "relative" }}>
                            <div onClick={() => setDropdownOpen(v => !v)} style={{
                                width: 36, height: 36, borderRadius: "50%",
                                background: avatarSrc ? "transparent" : "linear-gradient(135deg,#C9A96E,#e8c97a)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "0.78rem", fontWeight: 700, color: "#1a1a1a",
                                cursor: "pointer", overflow: "hidden",
                                border: dropdownOpen ? "2.5px solid #C9A96E" : "2.5px solid transparent",
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
                                    background: "#fff", borderRadius: 14,
                                    boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
                                    border: "1px solid #f0f0f0",
                                    minWidth: 210, zIndex: 999, overflow: "hidden",
                                }}>
                                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f5" }}>
                                        <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>{user.firstName} {user.lastName}</p>
                                        <p style={{ fontSize: "0.72rem", color: "#aaa" }}>{user.email}</p>
                                    </div>
                                    <a href="/dashboard/profile" onClick={() => setDropdownOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", textDecoration: "none", fontSize: "0.84rem", color: "#1a1a1a" }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#888" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        My Profile
                                    </a>
                                    <button onClick={() => { setDropdownOpen(false); logout(); }} style={{
                                        display: "flex", alignItems: "center", gap: 10, width: "100%",
                                        padding: "12px 16px", background: "transparent", border: "none",
                                        fontSize: "0.84rem", color: "#C0392B", cursor: "pointer",
                                        borderTop: "1px solid #f5f5f5", fontFamily: "'DM Sans', sans-serif", textAlign: "left",
                                    }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "#fff5f5")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#C0392B" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <span style={{ fontSize: "0.83rem", color: "#555" }}>
                        Welcome, <strong style={{ color: "#1a1a1a" }}>{user?.firstName}</strong>
                    </span>
                </div>
            </nav>

            {/* ── HERO STRIP ── */}
            <div style={{
                background: "linear-gradient(135deg,#1A1A1A 0%,#2d2517 100%)",
                padding: "3rem 4vw 2.5rem",
                color: "#fff",
            }}>
                <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A96E", fontWeight: 700, marginBottom: "0.5rem" }}>
                        Explore Nepal
                    </p>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 300, fontStyle: "italic", color: "#fff", marginBottom: "0.75rem" }}>
                        Discover <em style={{ fontStyle: "normal", color: "#E8D5B0" }}>Luxury Villas</em>
                    </h1>
                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", maxWidth: 500, lineHeight: 1.7, marginBottom: "1.75rem" }}>
                        Hand-picked villas nestled in Nepal's most breathtaking destinations — from Himalayan retreats to jungle estates.
                    </p>

                    {/* Search bar */}
                    <div style={{ display: "flex", gap: 10, maxWidth: 560, flexWrap: "wrap" }}>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by villa name or location…"
                            style={{ ...inp, flex: "1 1 300px", background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff" }}
                        />
                        <button style={{
                            height: 42, padding: "0 22px", background: "#C9A96E", border: "none",
                            borderRadius: 8, fontSize: "0.85rem", fontWeight: 700, color: "#1a1a1a",
                            cursor: "pointer", fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
                        }}>
                            Search
                        </button>
                    </div>

                    {/* Type tabs */}
                    <div style={{ display: "flex", gap: 8, marginTop: "1.5rem", flexWrap: "wrap" }}>
                        {TYPES.map(t => (
                            <button key={t} onClick={() => setActiveType(t)} style={{
                                padding: "6px 16px", borderRadius: 100,
                                fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif",
                                background: activeType === t ? "#C9A96E" : "rgba(255,255,255,0.08)",
                                color: activeType === t ? "#1a1a1a" : "rgba(255,255,255,0.65)",
                                border: activeType === t ? "none" : "1px solid rgba(255,255,255,0.15)",
                                transition: "all 0.18s",
                            }}>{t}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2.5rem 4vw", display: "flex", gap: "2.5rem", alignItems: "flex-start" }}>

                {/* ── FILTERS SIDEBAR ── */}
                <aside style={{
                    width: 240, flexShrink: 0, position: "sticky", top: 88,
                    background: "#fff", border: "1px solid #ebebeb", borderRadius: 14,
                    padding: "1.5rem",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a1a1a" }}>Filters</p>
                        <button onClick={clearFilters} style={{ fontSize: "0.72rem", color: "#C9A96E", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Clear</button>
                    </div>

                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.75rem" }}>Villa Type</p>
                    {TYPES.filter(t => t !== "All").map(t => (
                        <label key={t} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: "0.82rem", color: "#555" }}>
                            <input type="checkbox" checked={activeType === t} onChange={() => setActiveType(prev => prev === t ? "All" : t)}
                                style={{ accentColor: "#C9A96E", width: 15, height: 15 }} />
                            {t}
                        </label>
                    ))}

                    <div style={{ height: 1, background: "#f0f0f0", margin: "1.25rem 0" }} />

                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.75rem" }}>Price per Night</p>
                    {PRICE_RANGES.map((r, i) => (
                        <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: "0.82rem", color: "#555" }}>
                            <input type="checkbox" checked={priceRanges.includes(i)} onChange={() => togglePriceRange(i)}
                                style={{ accentColor: "#C9A96E", width: 15, height: 15 }} />
                            {r.label}
                        </label>
                    ))}

                    <div style={{ height: 1, background: "#f0f0f0", margin: "1.25rem 0" }} />

                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.75rem" }}>Amenities</p>
                    {AMENITIES_FILTER.map(a => (
                        <label key={a} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: "0.82rem", color: "#555" }}>
                            <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)}
                                style={{ accentColor: "#C9A96E", width: 15, height: 15 }} />
                            {a}
                        </label>
                    ))}

                    <div style={{ height: 1, background: "#f0f0f0", margin: "1.25rem 0" }} />

                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", marginBottom: "0.75rem" }}>Sort By</p>
                    {SORT_OPTIONS.map(s => (
                        <label key={s.value} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: "0.82rem", color: "#555" }}>
                            <input type="radio" name="sort" value={s.value} checked={sortBy === s.value} onChange={() => setSortBy(s.value)}
                                style={{ accentColor: "#C9A96E", width: 15, height: 15 }} />
                            {s.label}
                        </label>
                    ))}
                </aside>

                {/* ── VILLA LIST ── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                        <p style={{ fontSize: "0.85rem", color: "#888" }}>
                            Showing <strong style={{ color: "#1a1a1a" }}>{Math.min(visible, filtered.length)}</strong> of <strong style={{ color: "#1a1a1a" }}>{filtered.length}</strong> villas
                        </p>
                    </div>

                    {filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "5rem 2rem", border: "1px solid #ebebeb", borderRadius: 14, background: "#fafaf8" }}>
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#aaa", marginBottom: "0.5rem" }}>No villas found</p>
                            <p style={{ fontSize: "0.85rem", color: "#bbb", marginBottom: "1.25rem" }}>Try adjusting your filters or search term</p>
                            <button onClick={clearFilters} style={{ padding: "10px 24px", background: "#1A1A1A", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            {shown.map(v => (
                                <div key={v.id} style={{
                                    display: "flex", gap: "1.5rem",
                                    border: "1px solid #ebebeb", borderRadius: 14,
                                    overflow: "hidden", background: "#fff",
                                    transition: "box-shadow 0.2s, transform 0.2s",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 40px rgba(0,0,0,0.1)";
                                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                                }}
                                >
                                    {/* Image */}
                                    <div style={{ position: "relative", flexShrink: 0, width: 240 }}>
                                        <img src={v.img} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 180 }} />
                                        {v.badge && (
                                            <span style={{
                                                position: "absolute", top: 12, left: 12,
                                                background: "#fff", borderRadius: 100,
                                                padding: "4px 12px", fontSize: "0.62rem",
                                                fontWeight: 700, color: "#1a1a1a",
                                                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                                                letterSpacing: "0.04em",
                                            }}>{v.badge}</span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1, padding: "1.25rem 1.25rem 1.25rem 0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                        <div>
                                            <p style={{ fontSize: "0.72rem", color: "#aaa", marginBottom: "0.3rem" }}>{v.address}</p>
                                            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "0.4rem" }}>
                                                {v.name}
                                            </h2>

                                            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: "0.9rem" }}>
                                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#bbb" strokeWidth="2">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                                                </svg>
                                                <span style={{ fontSize: "0.78rem", color: "#aaa" }}>{v.location}</span>
                                            </div>

                                            {/* Amenity tags */}
                                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1rem" }}>
                                                {v.amenities.map(a => (
                                                    <span key={a} style={{
                                                        display: "inline-flex", alignItems: "center", gap: 5,
                                                        padding: "4px 12px", borderRadius: 100,
                                                        border: "1px solid #E8E2D9", background: "#FAF7F2",
                                                        fontSize: "0.7rem", color: "#8B6914", fontWeight: 600,
                                                    }}>
                                                        ✓ {a}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price + CTA */}
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                                                    {[1,2,3,4,5].map(i => (
                                                        <span key={i} style={{ color: i <= Math.round(v.rating) ? "#C9A96E" : "#ddd", fontSize: "0.85rem" }}>★</span>
                                                    ))}
                                                    <span style={{ fontSize: "0.75rem", color: "#aaa", marginLeft: 4 }}>{v.rating} · {v.reviews} reviews</span>
                                                </div>
                                                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 600, color: "#1a1a1a", lineHeight: 1 }}>
                                                    NPR {v.price.toLocaleString()}
                                                    <span style={{ fontSize: "0.78rem", color: "#aaa", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}> /night</span>
                                                </p>
                                            </div>
                                            <button style={{
                                                height: 42, padding: "0 22px",
                                                background: "#1A1A1A", color: "#fff",
                                                border: "none", borderRadius: 8,
                                                fontSize: "0.82rem", fontWeight: 600,
                                                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                                                letterSpacing: "0.04em",
                                                transition: "background 0.2s",
                                            }}
                                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#C9A96E")}
                                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#1A1A1A")}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Show More */}
                    {visible < filtered.length && (
                        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                            <button onClick={() => setVisible(v => v + 4)} style={{
                                height: 46, padding: "0 36px",
                                background: "transparent", border: "1.5px solid #1A1A1A",
                                borderRadius: 8, fontSize: "0.85rem", fontWeight: 600,
                                color: "#1a1a1a", cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif",
                                transition: "background 0.2s, color 0.2s",
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.background = "#1A1A1A";
                                (e.currentTarget as HTMLElement).style.color = "#fff";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.background = "transparent";
                                (e.currentTarget as HTMLElement).style.color = "#1a1a1a";
                            }}
                            >
                                Show More
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── FOOTER ── */}
            <footer style={{ background: "#0f0f0f", color: "rgba(255,255,255,0.5)", padding: "2rem 4vw", marginTop: "3rem" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <p style={{ fontSize: "0.75rem" }}>© 2025 VillaBaas. All rights reserved.</p>
                    <div style={{ display: "flex", gap: "1.5rem" }}>
                        {["Privacy", "Terms", "Cookies"].map(l => (
                            <a key={l} href="#" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>{l}</a>
                        ))}
                    </div>
                </div>
            </footer>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
                * { box-sizing: border-box; }
                input::placeholder { color: rgba(255,255,255,0.35) !important; }
                @media (max-width: 768px) {
                    .villas-main { flex-direction: column !important; }
                    .villas-sidebar { width: 100% !important; position: static !important; }
                    .villa-card { flex-direction: column !important; }
                    .villa-card-img { width: 100% !important; height: 200px !important; }
                }
            `}</style>
        </div>
    );
}