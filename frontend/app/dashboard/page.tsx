"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserCookie, clearAuthCookies } from "@/lib/api/cookies";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router  = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = getUserCookie() as User | null;
    if (!stored) {
      router.replace("/login");
      return;
    }
    setUser(stored);
  }, [router]);

  function handleLogout() {
    clearAuthCookies();
    router.push("/login");
  }

  if (!user) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1A1A1A 0%, #2d2517 100%)",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.25rem 2.5rem",
        borderBottom: "1px solid rgba(201,169,110,0.15)",
        background: "rgba(0,0,0,0.2)", backdropFilter: "blur(10px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "rgba(201,169,110,0.15)",
            border: "1px solid rgba(201,169,110,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#E8D5B0" strokeWidth="1.5">
              <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"/>
              <path d="M9 22V12h6v10"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 600, color: "#fff", letterSpacing: "0.04em" }}>
            VillaBaas
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
            Welcome, <strong style={{ color: "#E8D5B0" }}>{user.firstName} {user.lastName}</strong>
          </span>
          <button onClick={handleLogout} style={{
            background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.35)",
            color: "#E8D5B0", borderRadius: "8px", padding: "7px 18px",
            fontSize: "0.8rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", textAlign: "center" }}>
        <div style={{
          background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.25)",
          borderRadius: "100px", padding: "6px 20px", marginBottom: "2rem",
          fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9A96E",
        }}>
          ✓ Authentication Successful
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
          fontWeight: 300, fontStyle: "italic",
          color: "#fff", lineHeight: 1.15, marginBottom: "1rem",
        }}>
          Your dream villa<br />
          <em style={{ color: "#E8D5B0", fontStyle: "normal" }}>awaits, {user.firstName}</em>
        </h1>

        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", fontWeight: 300, maxWidth: "40ch", lineHeight: 1.7, marginBottom: "3rem" }}>
          You&apos;re now logged in. Explore curated luxury villas across Nepal and beyond.
        </p>

        {/* Villa cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", maxWidth: "900px", width: "100%" }}>
          {[
            { name: "Pokhara Lakeside Villa",    loc: "Pokhara, Nepal",  price: "NPR 45,000/night", img: "https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=400&q=70" },
            { name: "Nagarkot Mountain Retreat",  loc: "Nagarkot, Nepal", price: "NPR 32,000/night", img: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=400&q=70" },
            { name: "Chitwan Jungle Estate",      loc: "Chitwan, Nepal",  price: "NPR 28,000/night", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=70" },
          ].map((villa) => (
            <div key={villa.name} style={{
              background: "rgba(255,255,255,0.05)", borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden",
            }}>
              <img src={villa.img} alt={villa.name} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
              <div style={{ padding: "1rem" }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "#fff", fontWeight: 500, marginBottom: "0.25rem" }}>{villa.name}</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginBottom: "0.6rem" }}>{villa.loc}</p>
                <p style={{ fontSize: "0.78rem", color: "#C9A96E", fontWeight: 500 }}>{villa.price}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
