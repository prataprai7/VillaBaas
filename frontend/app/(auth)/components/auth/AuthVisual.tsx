import Link from "next/link";

interface AuthVisualProps {
  slide?: 0 | 1 | 2;
}

const slides = [
  {
    headline: (<>Escape to your<br /><em>perfect villa</em></>),
    img: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-885171494011814801/original/d3076352-6619-4709-ac7c-e8a9aa7ae9c1.jpeg",
    tag: "Featured Collection",
    stat1: { value: "40+", label: "Luxury Villas" },
    stat2: { value: "4.2★", label: "Avg. Rating" },
  },
  {
    headline: (<>Private pools,<br /><em>endless skies</em></>),
    img: "https://villa-karma.pokharahotelspage.com/data/Pics/OriginalPhoto/15744/1574486/1574486495/villa-karma-pokhara-pokhara-pic-36.JPEG",
    tag: "Top Rated",
    stat1: { value: "20+", label: "Destinations" },
    stat2: { value: "90%", label: "Satisfaction" },
  },
];

export default function AuthVisual({ slide = 0 }: AuthVisualProps) {
  const { headline, img, tag, stat1, stat2 } = slides[slide];
  return (
    <aside className="auth-visual">
      <img src={img} alt="Luxury villa" className="auth-visual__bg" />
      <div className="auth-visual__overlay" />
      <div className="auth-visual__overlay2" />
      <div className="auth-visual__corner" />

      <Link href="/" className="auth-visual__brand">
        
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
        <div className="auth-visual__dots">
          {slides.map((_, i) => (
            <div key={i} className={`dot${i === slide ? " active" : ""}`} />
          ))}
        </div>
      </div>
    </aside>
  );
}
