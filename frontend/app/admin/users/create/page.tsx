import VillaForm from "../../_components/VillaForm";

export default function Page() {
    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <a href="/admin/villas" style={{ fontSize: "0.78rem", color: "#aaa", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                ← Back to villas
            </a>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 600, color: "#1a1a1a", margin: "1rem 0 2rem" }}>
                New Villa
            </h2>
            <VillaForm />
        </div>
    );
}