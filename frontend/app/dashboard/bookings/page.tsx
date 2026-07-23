"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getMyBookings, cancelBooking, Booking, BookingStatus } from "@/lib/api/bookings-api";
import { resolveImageUrl } from "@/lib/api/villas-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";
const BRAND_RED = "#DA0B00";

const TABS: { label: string; statuses: BookingStatus[] }[] = [
  { label: "Upcoming", statuses: ["unpaid", "paid"] },
  { label: "Completed", statuses: ["completed"] },
  { label: "Cancelled", statuses: ["cancelled"] },
];

const NAV_LINKS = [
  { label: "Home", href: "/dashboard" },
  { label: "Villas", href: "/dashboard/villas" },
  { label: "Bookings", href: "/dashboard/bookings" },
  { label: "About", href: "#" },
];

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" });
}

function statusColor(s: BookingStatus) {
  if (s === "unpaid") return { bg: "#FFF7ED", border: "#FDBA74", text: "#C2650A" };
  if (s === "paid") return { bg: "#FFF5F5", border: "#FECACA", text: BRAND_RED };
  if (s === "completed") return { bg: "#F0FDF4", border: "#86EFAC", text: "#16A34A" };
  return { bg: "#F9FAFB", border: "#E5E7EB", text: "#6B7280" };
}

function statusLabel(s: BookingStatus) {
  if (s === "unpaid") return "Awaiting Payment";
  if (s === "paid") return "Upcoming";
  if (s === "completed") return "Completed ✓";
  return "Cancelled";
}

export default function BookingsPage() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarSrc = user?.profileImage ? `${API_URL}${user.profileImage}` : null;

  async function loadBookings() {
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Could not load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = bookings.filter((b) => TABS[activeTab].statuses.includes(b.status));

  async function handleCancel(id: string) {
    setCancelling(true);
    try {
      await cancelBooking(id);
      await loadBookings();
      setCancelTarget(null);
      setToast({ msg: "Booking cancelled successfully", type: "success" });
    } catch (err) {
      setToast({ msg: err instanceof Error ? err.message : "Could not cancel booking", type: "error" });
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#EEEEEE", fontFamily: "'DM Sans', sans-serif", color: "#1C1C1C", margin: 0, padding: 0 }}>
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 1000,
          background: toast.type === "success" ? "#16A34A" : BRAND_RED,
          color: "#fff", padding: "12px 20px", borderRadius: 12,
          fontSize: "0.85rem", fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          animation: "slideIn 0.25s ease",
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
              <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" />
              <path d="M9 22V12h6v10" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700, color: "#1C1C1C" }}>VillaBaas</span>
        </a>

        <div style={{ display: "flex", gap: "2rem" }}>
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} style={{
              fontSize: "0.88rem",
              color: l.href === "/dashboard/bookings" ? "#1C1C1C" : "#888",
              fontWeight: l.href === "/dashboard/bookings" ? 600 : 400,
              textDecoration: "none",
              borderBottom: l.href === "/dashboard/bookings" ? `2px solid ${BRAND_RED}` : "2px solid transparent",
              paddingBottom: 2,
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1C1C")}
              onMouseLeave={(e) => { if (l.href !== "/dashboard/bookings") e.currentTarget.style.color = "#888"; }}
            >{l.label}</a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.83rem", color: "#888" }}>
            Welcome, <strong style={{ color: "#1C1C1C" }}>{user?.firstName}</strong>
          </span>
          {user && (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <div onClick={() => setDropdownOpen((v) => !v)} style={{
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
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#888" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    My Profile
                  </a>
                  <button onClick={() => { setDropdownOpen(false); logout(); }} style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "12px 16px", background: "transparent", border: "none",
                    fontSize: "0.84rem", color: BRAND_RED, cursor: "pointer",
                    borderTop: "1px solid #f5f5f5", fontFamily: "'DM Sans', sans-serif", textAlign: "left",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke={BRAND_RED} strokeWidth="1.8">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ── PAGE HEADER ── */}
      <div style={{ background: "#fff", padding: "2rem 4vw 1.5rem", borderBottom: "1px solid #ebebeb" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <a href="/dashboard" style={{ color: "#aaa", textDecoration: "none", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 4 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = BRAND_RED)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              Home
            </a>
            <span style={{ color: "#ccc", fontSize: "0.8rem" }}>/</span>
            <span style={{ fontSize: "0.82rem", color: "#1C1C1C" }}>My Bookings</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#1C1C1C", marginBottom: 4 }}>
            My Bookings
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#888", lineHeight: 1.6 }}>
            Manage your villa reservations all in one place.
          </p>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 4vw" }}>
        <div style={{ display: "flex", background: "#E5E5E5", borderRadius: 14, padding: 4, marginBottom: "2rem" }}>
          {TABS.map((tab, i) => (
            <button key={tab.label} onClick={() => setActiveTab(i)} style={{
              flex: 1, height: 42, border: "none", borderRadius: 10,
              fontSize: "0.88rem", fontWeight: 600, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              background: activeTab === i ? BRAND_RED : "transparent",
              color: activeTab === i ? "#fff" : "#888",
              transition: "all 0.2s",
              boxShadow: activeTab === i ? "0 4px 14px rgba(218,11,0,0.25)" : "none",
            }}>
              {tab.label}
              <span style={{
                marginLeft: 6, fontSize: "0.72rem",
                background: activeTab === i ? "rgba(255,255,255,0.25)" : "#e0e0e0",
                color: activeTab === i ? "#fff" : "#888",
                padding: "2px 7px", borderRadius: 10,
              }}>
                {bookings.filter((b) => tab.statuses.includes(b.status)).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#888" }}>Loading your bookings...</div>
        ) : loadError ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#fff", borderRadius: 20, border: "1px solid #ebebeb" }}>
            <p style={{ fontSize: "0.9rem", color: BRAND_RED, marginBottom: "1rem" }}>{loadError}</p>
            <button onClick={loadBookings} style={{ padding: "10px 24px", background: BRAND_RED, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "#fff", borderRadius: 20, border: "1px solid #ebebeb" }}>
            <div style={{ marginBottom: "1rem" }}>
              {activeTab === 0 ? (
                <svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="#ccc" strokeWidth="1.3">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              ) : activeTab === 1 ? (
                <svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="#ccc" strokeWidth="1.3">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="#ccc" strokeWidth="1.3">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#aaa", marginBottom: 6 }}>
              No {TABS[activeTab].label.toLowerCase()} bookings
            </p>
            <p style={{ fontSize: "0.85rem", color: "#bbb", marginBottom: "1.5rem" }}>
              Your {TABS[activeTab].label.toLowerCase()} stays will appear here
            </p>
            <a href="/dashboard/villas" style={{
              display: "inline-block", padding: "10px 24px",
              background: BRAND_RED, color: "#fff", textDecoration: "none",
              borderRadius: 10, fontSize: "0.85rem", fontWeight: 600,
            }}>Browse Villas</a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.map((b) => {
              const sc = statusColor(b.status);
              return (
                <div key={b._id} style={{
                  background: "#fff", borderRadius: 20, overflow: "hidden",
                  border: "1px solid #f0f0f0",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  transition: "box-shadow 0.2s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)")}
                >
                  <div style={{ display: "flex", gap: 0 }}>
                    <div style={{ width: 180, flexShrink: 0, position: "relative" }}>
                      <img src={resolveImageUrl(b.image)} alt={b.villaName} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 160, display: "block" }} />
                      <div style={{
                        position: "absolute", top: 10, left: 10,
                        background: sc.bg, border: `1px solid ${sc.border}`,
                        borderRadius: 20, padding: "3px 10px",
                        fontSize: "0.65rem", fontWeight: 700, color: sc.text,
                      }}>{statusLabel(b.status)}</div>
                    </div>

                    <div style={{ flex: 1, padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#1C1C1C" }}>{b.villaName}</h3>
                          <span style={{ fontSize: "0.72rem", color: "#aaa" }}>#{b._id.slice(-8).toUpperCase()}</span>
                        </div>
                        <p style={{ fontSize: "0.78rem", color: "#888", display: "flex", alignItems: "center", gap: 4, marginBottom: "1rem" }}>
                          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#bbb" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                          </svg>
                          {b.location}
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1rem" }}>
                          {[
                            { label: "Check-in", value: fmtDate(b.checkIn) },
                            { label: "Check-out", value: fmtDate(b.checkOut) },
                          ].map((d) => (
                            <div key={d.label} style={{ background: "#F5F5F5", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={BRAND_RED} strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                              </svg>
                              <div>
                                <p style={{ fontSize: "0.6rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>{d.label}</p>
                                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1C1C1C" }}>{d.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: "flex", gap: "1.25rem", marginBottom: "1rem" }}>
                          <span style={{ fontSize: "0.78rem", color: "#888", display: "flex", alignItems: "center", gap: 5 }}>
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#aaa" strokeWidth="1.8">
                              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                            </svg>
                            {b.guests} guests
                          </span>
                          <span style={{ fontSize: "0.78rem", color: "#888", display: "flex", alignItems: "center", gap: 5 }}>
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#aaa" strokeWidth="1.8">
                              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                            </svg>
                            {b.nights} nights
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <p style={{ fontSize: "0.65rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Total</p>
                          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700, color: BRAND_RED }}>
                            NPR {b.totalPrice.toLocaleString()}
                          </p>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          {(b.status === "unpaid" || b.status === "paid") && (
                            <button onClick={() => setCancelTarget(b._id)} style={{
                              height: 36, padding: "0 16px",
                              background: "transparent", border: "1.5px solid #e5e5e5",
                              borderRadius: 8, fontSize: "0.8rem", fontWeight: 600,
                              color: "#555", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                            }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#aaa"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e5e5"; }}
                            >Cancel</button>
                          )}
                          {b.status === "unpaid" && (
                            <a href={`/dashboard/bookings/payment?villaId=&checkIn=${b.checkIn}&checkOut=${b.checkOut}&guests=${b.guests}&total=${b.totalPrice}`} style={{
                              height: 36, padding: "0 16px",
                              background: BRAND_RED, border: "none",
                              borderRadius: 8, fontSize: "0.8rem", fontWeight: 600,
                              color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                              display: "flex", alignItems: "center", textDecoration: "none",
                            }}>Pay Now</a>
                          )}
                          {b.status === "completed" && (
                            <a href="/dashboard/villas" style={{
                              height: 36, padding: "0 16px",
                              background: "#F0FDF4", border: "1px solid #86EFAC",
                              borderRadius: 8, fontSize: "0.8rem", fontWeight: 600,
                              color: "#16A34A", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                              display: "flex", alignItems: "center", textDecoration: "none",
                            }}>Book Again</a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── CANCEL MODAL ── */}
      {cancelTarget && (
        <div onClick={() => !cancelling && setCancelTarget(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "2rem", width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#FFF5F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={BRAND_RED} strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, textAlign: "center", color: "#1C1C1C", marginBottom: 8 }}>
              Cancel Booking
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#888", textAlign: "center", lineHeight: 1.7, marginBottom: "1.75rem" }}>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setCancelTarget(null)} disabled={cancelling} style={{ flex: 1, height: 44, background: "#F5F5F5", border: "none", borderRadius: 12, fontSize: "0.88rem", fontWeight: 600, color: "#555", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Keep it</button>
              <button onClick={() => handleCancel(cancelTarget)} disabled={cancelling} style={{ flex: 1, height: 44, background: BRAND_RED, border: "none", borderRadius: 12, fontSize: "0.88rem", fontWeight: 600, color: "#fff", cursor: cancelling ? "not-allowed" : "pointer", opacity: cancelling ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif" }}>
                {cancelling ? "Cancelling..." : "Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}