"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendAssistantMessage } from "@/lib/api/assistant-api";
import { resolveImageUrl, Villa } from "@/lib/api/villas-api";

const BRAND_RED = "#DA0B00";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  villas?: Villa[];
}

const SUGGESTED_PROMPTS = [
  { label: "Villas under NPR 15,000", emoji: "💰" },
  { label: "Villas in Pokhara", emoji: "📍" },
  { label: "Villas for 6+ guests", emoji: "👨‍👩‍👧‍👦" },
  { label: "How do I cancel a booking?", emoji: "❓" },
];

export default function AssistantWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(text?: string) {
    const message = (text ?? input).trim();
    if (!message || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setLoading(true);

    try {
      const result = await sendAssistantMessage(message);
      setMessages((prev) => [...prev, { role: "assistant", text: result.reply, villas: result.villas }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I ran into an issue answering that. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
  }

  // ── Collapsed bubble ──────────────────────────────────────────────
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 500,
          width: 60, height: 60, borderRadius: "50%",
          background: BRAND_RED, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 24px rgba(218,11,0,0.35)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.08)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
        aria-label="Open assistant"
      >
        <BotIcon size={28} color="#fff" />
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 500,
        width: 380, maxWidth: "calc(100vw - 32px)",
        height: minimized ? "auto" : 560,
        maxHeight: "calc(100vh - 48px)",
        background: "#fff", borderRadius: 20, overflow: "hidden",
        boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
        display: "flex", flexDirection: "column",
        fontFamily: "'DM Sans', sans-serif",
        border: "1px solid #f0f0f0",
      }}
    >
      {/* ── Header ── */}
      <div style={{
        background: BRAND_RED, padding: "0.9rem 1.1rem",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "rgba(255,255,255,0.2)", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <BotIcon size={20} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>Villa Assistant</p>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.72rem", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }} />
            AI Assistant
          </p>
        </div>
        <button onClick={clearChat} title="Clear conversation" style={iconBtnStyle}>
          <TrashIcon />
        </button>
        <button onClick={() => setMinimized((m) => !m)} title={minimized ? "Expand" : "Minimize"} style={iconBtnStyle}>
          {minimized ? <ChevronUpIcon /> : <MinusIcon />}
        </button>
        <button onClick={() => setIsOpen(false)} title="Close" style={iconBtnStyle}>
          <CloseIcon />
        </button>
      </div>

      {!minimized && (
        <>
          {/* ── Body ── */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "1.1rem", background: "#FAFAFA" }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0.5rem" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", margin: "0 auto 1rem",
                  background: `${BRAND_RED}12`, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <BotIcon size={28} color={BRAND_RED} />
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#1C1C1C", marginBottom: 4 }}>
                  Hi, I&apos;m your Villa Assistant 👋
                </p>
                <p style={{ fontSize: "0.82rem", color: "#888", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                  Ask me to find villas by budget, location, or guest count.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => handleSend(p.label)}
                      style={{
                        textAlign: "left", padding: "10px 14px", borderRadius: 10,
                        border: "1px solid #e5e5e5", background: "#fff", cursor: "pointer",
                        fontSize: "0.82rem", color: "#333", fontFamily: "'DM Sans', sans-serif",
                        display: "flex", alignItems: "center", gap: 8,
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = BRAND_RED)}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#e5e5e5")}
                    >
                      <span>{p.emoji}</span> {p.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "85%",
                      padding: "10px 14px",
                      borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      background: m.role === "user" ? BRAND_RED : "#fff",
                      color: m.role === "user" ? "#fff" : "#1C1C1C",
                      border: m.role === "assistant" ? "1px solid #ececec" : "none",
                      fontSize: "0.85rem", lineHeight: 1.55,
                    }}>
                      {m.text}
                    </div>

                    {m.villas && m.villas.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8, width: "100%" }}>
                        {m.villas.map((v) => (
                          <button
                            key={v._id}
                            onClick={() => router.push(`/dashboard/villas/${v._id}`)}
                            style={{
                              display: "flex", gap: 10, background: "#fff", border: "1px solid #ececec",
                              borderRadius: 12, padding: 8, cursor: "pointer", textAlign: "left",
                              fontFamily: "'DM Sans', sans-serif", width: "100%",
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = BRAND_RED)}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#ececec")}
                          >
                            <img
                              src={resolveImageUrl(v.img)}
                              alt={v.name}
                              style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0, background: "#eee" }}
                            />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1C1C1C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.name}</p>
                              <p style={{ fontSize: "0.72rem", color: "#888" }}>{v.location}</p>
                              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: BRAND_RED, marginTop: 2 }}>NPR {v.price.toLocaleString()}/night</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px" }}>
                    <Dot delay={0} /><Dot delay={0.15} /><Dot delay={0.3} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Input ── */}
          <div style={{ padding: "0.85rem", borderTop: "1px solid #f0f0f0", background: "#fff", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              placeholder="Type a question..."
              style={{
                flex: 1, height: 42, padding: "0 14px", borderRadius: 21,
                border: "1.5px solid #e5e5e5", outline: "none", fontSize: "0.85rem",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onFocus={(e) => (e.currentTarget.style.border = `1.5px solid ${BRAND_RED}`)}
              onBlur={(e) => (e.currentTarget.style.border = "1.5px solid #e5e5e5")}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              style={{
                width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                background: BRAND_RED, border: "none", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: !input.trim() || loading ? 0.5 : 1,
              }}
              aria-label="Send"
            >
              <SendIcon />
            </button>
          </div>
        </>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes dot-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }
      `}</style>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8,
  width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", flexShrink: 0,
};

function Dot({ delay }: { delay: number }) {
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#bbb", display: "inline-block", animation: `dot-bounce 1.2s ${delay}s infinite ease-in-out` }} />;
}

function BotIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <rect x="3" y="8" width="18" height="12" rx="3" />
      <circle cx="8.5" cy="14" r="1.3" fill={color} />
      <circle cx="15.5" cy="14" r="1.3" fill={color} />
      <path d="M12 8V4" strokeLinecap="round" />
      <circle cx="12" cy="3" r="1.3" fill={color} />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a2 2 0 012-2h0a2 2 0 012 2v2" />
    </svg>
  );
}
function MinusIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
function ChevronUpIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>;
}
function CloseIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}
function SendIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
}