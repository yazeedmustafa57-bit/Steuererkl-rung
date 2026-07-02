const stats = [
  { value: '8 Mio.+', label: 'Steuererklärungen' },
  { value: '4,5 Mrd. €', label: 'zurückgeholt' },
  { value: '4,8 ★', label: 'aus 255.000+ Bewertungen' },
];

const testimonials = [
  {
    quote: 'Super App! Man kann immer wieder in die einzelnen Sparten umswitchen um zu korrigieren! Und das Ergebnis stimmt, das Finanzamt zahlt exakt die Summe aus, die in der App berechnet wurde!',
    name: 'Janina S.',
    source: 'Google Play Store',
    rating: 5,
  },
  {
    quote: 'Idiotensicher. Natürlich muss man alle nötigen Daten zur Hand haben. Dann leitet die App mit einfach verständlichen Fragen durch alle relevanten Punkte. Es hat tatsächlich Spaß gemacht.',
    name: 'DJ Patrice',
    source: 'Apple App Store',
    rating: 5,
  },
];

function StarIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill={filled ? '#F8C677' : 'none'}>
      <path
        d="M8 1.5L10.1 5.8L15 6.4L11.5 9.8L12.3 14.7L8 12.4L3.7 14.7L4.5 9.8L1 6.4L5.9 5.8L8 1.5Z"
        stroke={filled ? '#F8C677' : '#D4D4D4'}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Trust() {
  return (
    <section id="trust" className="trust section">
      <div className="container">
        <h2 className="section-title">Das sagen unsere Nutzer:innen</h2>
        <p className="section-subtitle">
          Über 8 Millionen Steuererklärungen wurden bereits über SteuerWert eingereicht.
        </p>

        <div className="trust__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="trust__stat">
              <span className="trust__stat-value">{stat.value}</span>
              <span className="trust__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="trust__testimonials">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-card__stars">
                {Array.from({ length: 5 }, (_, j) => (
                  <StarIcon key={j} filled={j < t.rating} />
                ))}
              </div>
              <p className="testimonial-card__quote">"{t.quote}"</p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__source">{t.source}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
