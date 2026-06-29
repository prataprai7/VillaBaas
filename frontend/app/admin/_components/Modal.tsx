"use client";

import { useEffect } from "react";

export default function Modal({
    open,
    onClose,
    title,
    children,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0, zIndex: 50,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(0,0,0,0.55)", padding: "1rem",
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                style={{
                    width: "100%", maxWidth: 420,
                    background: "#fff", borderRadius: 14,
                    border: "1px solid #ebebeb",
                    padding: "1.75rem",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                }}
            >
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "1rem" }}>
                    {title}
                </h3>
                {children}
            </div>
        </div>
    );
}
