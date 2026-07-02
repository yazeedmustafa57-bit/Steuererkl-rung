export default function Footer({ onAuthOpen }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cta">
          <h2 className="footer__cta-title">Bereit für deine Steuer?</h2>
          <p className="footer__cta-desc">
            Starte kostenlos und sieh sofort, wie viel Geld du zurückbekommst.
          </p>
          <button className="btn btn-primary footer__cta-btn" onClick={onAuthOpen}>
            Jetzt kostenlos starten
          </button>
        </div>
        <div className="footer__divider" />
        <div className="footer__bottom">
          <div className="footer__brand">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#ADEE68"/>
              <path d="M10 22L16 10L22 22" stroke="#0C0B0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 17H19" stroke="#0C0B0A" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="footer__brand-name">SteuerWert</span>
          </div>
          <div className="footer__links">
            <a href="#">Impressum</a>
            <a href="#">Datenschutz</a>
            <a href="#">AGB</a>
            <a href="#">Cookie-Einstellungen</a>
          </div>
          <p className="footer__copyright">
            © {new Date().getFullYear()} SteuerWert. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
