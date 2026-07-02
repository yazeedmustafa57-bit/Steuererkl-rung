import { useState } from 'react';

const navLinks = [
  { label: 'So funktioniert\'s', href: '#how-it-works' },
  { label: 'Preise', href: '#pricing' },
  { label: 'Ratgeber', href: '#faq' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#" className="header__logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#ADEE68"/>
            <path d="M10 22L16 10L22 22" stroke="#0C0B0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 17H19" stroke="#0C0B0A" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span>SteuerFlow</span>
        </a>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="header__nav-link" onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#hero" className="btn btn-primary header__nav-cta">Kostenlos starten</a>
        </nav>

        <button className="header__toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
          <span className={`header__toggle-bar ${menuOpen ? 'open' : ''}`} />
          <span className={`header__toggle-bar ${menuOpen ? 'open' : ''}`} />
          <span className={`header__toggle-bar ${menuOpen ? 'open' : ''}`} />
        </button>
      </div>
    </header>
  );
}
