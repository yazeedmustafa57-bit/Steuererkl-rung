export default function Hero({ onAuthOpen }) {
  return (
    <section id="hero" className="hero section">
      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            + 5 Mio. Downloads
          </div>
          <h1 className="hero__title">
            Deine Steuer in <span className="text-highlight">30 Minuten</span>.<br />
            Ganz ohne Stress.
          </h1>
          <p className="hero__subtitle">
            Einfach Beleg fotografieren, Fragen beantworten, Erstattung erhalten.
            Geführt von einer App, die Steuern endlich einfach macht.
          </p>
          <div className="hero__actions">
            <button className="btn btn-primary" onClick={onAuthOpen}>Kostenlos starten</button>
            <a href="#how-it-works" className="btn btn-outline">So funktioniert's</a>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-value">+ 5 Mio.</span>
              <span className="hero__stat-label">Downloads</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value">Ø 1.240 €</span>
              <span className="hero__stat-label">Erstattung</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value">4,8 ★</span>
              <span className="hero__stat-label">Bewertung</span>
            </div>
          </div>
        </div>
        <div className="hero__mockup">
          <div className="hero__phone">
            <div className="hero__phone-notch" />
            <div className="hero__phone-screen">
              <div className="phone-header">
                <div className="phone-header__top">
                  <span className="phone-time">09:41</span>
                  <div className="phone-battery" />
                </div>
                <div className="phone-progress">
                  <div className="phone-progress__bar" style={{ width: '65%' }} />
                </div>
                <p className="phone-step">Schritt 3 von 8</p>
              </div>
              <div className="phone-question">
                <div className="phone-question__icon">📄</div>
                <p className="phone-question__text">Hattest du im Jahr 2025<br />berufliche Ausgaben?</p>
                <div className="phone-question__actions">
                  <button className="phone-btn phone-btn--yes">Ja</button>
                  <button className="phone-btn phone-btn--no">Nein</button>
                </div>
                <p className="phone-hint">Fahrten, Arbeitsmittel, Fortbildungen, Home-Office</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
