import Link from "next/link";

interface AuthVisualProps {
  slide?: 0 | 1 | 2;
}

const slides = [
  {
    headline: (
      <>
        Escape to your
        <br />
        <em>perfect villa</em>
      </>
    ),
    sub: "Best Villa you can find in Nepal.",
    img: "https://media.vrbo.com/lodging/118000000/117880000/117877700/117877678/68d2664f.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
  },
  {
    headline: (
      <>
        Private pools,
        <br />
        <em>endless skies</em>
      </>
    ),
    sub: "Every property hand-picked for luxury, privacy, and breathtaking views.",
    img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/468010416.jpg?k=52548d40c3c3e53e0250b36941c54ed1b793184b00996e29f60dc45db4401574&o=",
  },
  {
    headline: (
      <>
        Your dream stay
        <br />
        <em>awaits you</em>
      </>
    ),
    sub: "Book in minutes. Arrive to perfection. Leave unforgettable memories.",
    img: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=900&q=80",
  },
];

export default function AuthVisual({ slide = 0 }: AuthVisualProps) {
  const { headline, sub, img } = slides[slide];

  return (
    <aside className="auth-visual">
      <img src={img} alt="Luxury villa" className="auth-visual__bg" />
      <div className="auth-visual__overlay" />

      <Link href="/" className="auth-visual__brand">
        <div className="brand-icon">
          <svg viewBox="0 0 24 24">
            <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" />
            <path d="M9 22V12h6v10" />
          </svg>
        </div>
        <span className="brand-name">VillaBaas</span>
      </Link>

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
