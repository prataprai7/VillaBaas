import Link from "next/link";

interface AuthVisualProps {
  slide?: 0 | 1 | 2;
}

const slides = [
  {
    headline: (<>Escape to your<br /><em>perfect villa</em></>),
    sub: "Curated escapes — from Santorini cliffs to Bali rice terraces.",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80",
    tag: "Featured Collection",
    stat1: { value: "240+", label: "Luxury Villas" },
    stat2: { value: "4.9★", label: "Avg. Rating" },
  },
  {
    headline: (<>Private pools,<br /><em>endless skies</em></>),
    sub: "Every property hand-picked for luxury, privacy, and breathtaking views.",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=80",
    tag: "Top Rated",
    stat1: { value: "50+", label: "Destinations" },
    stat2: { value: "98%", label: "Satisfaction" },
  },
];

export default function AuthVisual({ slide = 0 }: AuthVisualProps) {
  const { headline, sub, img, tag, stat1, stat2 } = slides[slide];
  return (
    <aside className="auth-visual">
      <img src={img} alt="Luxury villa" className="auth-visual__bg" />
      <div className="auth-visual__overlay" />
      <div className="auth-visual__overlay2" />
      <div className="auth-visual__corner" />

      <Link href="/" className="auth-visual__brand">
        <div className="brand-icon">
          <svg viewBox="0 0 24 24">
            <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" />
            <path d="M9 22V12h6v10" />
          </svg>
        </div>
        <span className="brand-name">VillaBaas</span>
      </Link>

      <div className="auth-visual__tag">{tag}</div>

      <div className="auth-visual__stats">
        <div className="stat">
          <span className="stat__value">{stat1.value}</span>
          <span className="stat__label">{stat1.label}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat__value">{stat2.value}</span>
          <span className="stat__label">{stat2.label}</span>
        </div>
      </div>

      <div className="auth-visual__copy">
        <h1 className="auth-visual__headline">{headline}</h1>
        <p className="auth-visual__sub">{sub}</p>
        <div className="auth-visual__dots">
          {slides.map((_, i) => (
            <div key={i} className={`dot${i === slide ? " active" : ""}`} />
          ))}
        </div>
      </div>
    </aside>
  );
}
