"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "./Modal";
import { handleDeleteVilla } from "@/lib/actions/admin/villa-action";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089";

export default function VillaTable({
    data,
    pagination,
    search,
}: {
    data: any[];
    pagination: any;
    search: string;
}) {
    const router = useRouter();
    const params = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [target, setTarget] = useState<any | null>(null);
    const [deleteError, setDeleteError] = useState("");

    const page       = pagination?.page       ?? 1;
    const limit      = pagination?.limit      ?? 10;
    const totalPages = pagination?.totalPages ?? 1;
    const total      = pagination?.total      ?? 0;

    function setQuery(next: Record<string, string | number>) {
        const q = new URLSearchParams(params.toString());
        Object.entries(next).forEach(([k, v]) => q.set(k, String(v)));
        router.push(`/admin/villas?${q.toString()}`);
    }

    function onSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const value = (new FormData(e.currentTarget).get("search") as string) ?? "";
        setQuery({ search: value, page: 1 });
    }

    function onDelete() {
        if (!target) return;
        setDeleteError("");
        startTransition(async () => {
            const result = await handleDeleteVilla(target._id);
            if (result.success) {
                setTarget(null);
                router.refresh();
            } else {
                setDeleteError(result.message || "Failed to delete villa");
            }
        });
    }

    const inp: React.CSSProperties = {
        height: 40, border: "1.5px solid #E8E2D9", borderRadius: 8,
        padding: "0 14px", fontSize: "0.85rem", color: "#1a1a1a",
        background: "#FAF7F2", outline: "none", fontFamily: "'DM Sans', sans-serif",
    };

    const btn: React.CSSProperties = {
        height: 40, border: "1.5px solid #1A1A1A", borderRadius: 8,
        padding: "0 18px", fontSize: "0.75rem", fontWeight: 700,
        letterSpacing: "0.08em", textTransform: "uppercase",
        background: "#1A1A1A", color: "#fff", cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
    };

    const outlineBtn: React.CSSProperties = {
        height: 40, border: "1.5px solid #ebebeb", borderRadius: 8,
        padding: "0 18px", fontSize: "0.75rem", fontWeight: 700,
        letterSpacing: "0.08em", textTransform: "uppercase",
        background: "#fff", color: "#1a1a1a", cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
    };

    return (
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.75rem", gap: "1rem" }}>
                <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>Villas</h2>
                    <p style={{ fontSize: "0.8rem", color: "#aaa" }}>{total} total villas</p>
                </div>
                <a href="/admin/villas/create" style={{ ...btn, textDecoration: "none", display: "flex", alignItems: "center" }}>
                    + New Villa
                </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", gap: "1rem", flexWrap: "wrap" }}>
                <form onSubmit={onSearch} style={{ display: "flex", gap: 8 }}>
                    <input name="search" defaultValue={search} placeholder="Search by name, location, type..." style={{ ...inp, width: 300 }} />
                    <button type="submit" style={outlineBtn}>Search</button>
                </form>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.72rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em" }}>Rows</span>
                    <select value={limit} onChange={e => setQuery({ limit: e.target.value, page: 1 })} style={{ ...inp, width: 80, padding: "0 10px" }}>
                        {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ border: "1px solid #ebebeb", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                        <thead>
                            <tr style={{ background: "#FAF7F2", borderBottom: "1px solid #ebebeb" }}>
                                {["Villa", "Location", "Price/Night", "Capacity", "Tag", "Actions"].map(h => (
                                    <th key={h} style={{ padding: "12px 16px", textAlign: h === "Actions" ? "right" : "left", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.length ? data.map((v, i) => (
                                <tr key={v._id} style={{ borderBottom: i < data.length - 1 ? "1px solid #f5f5f5" : "none" }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#fafaf9")}
                                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                                >
                                    <td style={{ padding: "14px 16px", color: "#1a1a1a", fontWeight: 500 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <img src={`${API_URL}${v.img}`} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
                                            {v.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 16px", color: "#666" }}>{v.location}</td>
                                    <td style={{ padding: "14px 16px", color: "#666" }}>Rs. {v.price?.toLocaleString()}</td>
                                    <td style={{ padding: "14px 16px", color: "#666" }}>{v.guests} guests · {v.rooms} rooms · {v.baths} baths</td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 100, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(201,169,110,0.15)", color: "#8B6914" }}>
                                            {v.tag}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                                            <a href={`/admin/villas/${v._id}/edit`} style={{ fontSize: "0.75rem", fontWeight: 600, color: "#888", textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>Edit</a>
                                            <button onClick={() => setTarget(v)} style={{ fontSize: "0.75rem", fontWeight: 600, color: "#888", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase", padding: 0, fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#aaa", fontSize: "0.88rem" }}>No villas found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.25rem" }}>
                <span style={{ fontSize: "0.8rem", color: "#aaa" }}>Page {page} of {totalPages}</span>
                <div style={{ display: "flex", gap: 8 }}>
                    <button disabled={page <= 1} onClick={() => setQuery({ page: page - 1 })} style={{ ...outlineBtn, opacity: page <= 1 ? 0.4 : 1 }}>← Prev</button>
                    <button disabled={page >= totalPages} onClick={() => setQuery({ page: page + 1 })} style={{ ...outlineBtn, opacity: page >= totalPages ? 0.4 : 1 }}>Next →</button>
                </div>
            </div>

            <Modal open={!!target} onClose={() => { setTarget(null); setDeleteError(""); }} title="Delete Villa">
                <p style={{ fontSize: "0.88rem", color: "#555", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                    Are you sure you want to delete <strong style={{ color: "#1a1a1a" }}>{target?.name}</strong>? This action cannot be undone.
                </p>
                {deleteError && <p style={{ fontSize: "0.8rem", color: "#C0392B", marginBottom: "1rem" }}>{deleteError}</p>}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button onClick={() => { setTarget(null); setDeleteError(""); }} style={outlineBtn}>Cancel</button>
                    <button onClick={onDelete} disabled={isPending} style={{ ...btn, background: "#C0392B", borderColor: "#C0392B", opacity: isPending ? 0.6 : 1 }}>
                        {isPending ? "Deleting…" : "Delete"}
                    </button>
                </div>
            </Modal>
        </div>
    );
}