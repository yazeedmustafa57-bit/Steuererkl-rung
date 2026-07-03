import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TaxWizard from './TaxWizard';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [startTax, setStartTax] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  if (startTax) {
    return <TaxWizard onBack={() => setStartTax(false)} />;
  }

  const declarations = [
    { year: '2025', status: 'Noch nicht gestartet', refund: '–' },
    { year: '2024', status: 'In Bearbeitung', refund: 'wird berechnet' },
    { year: '2023', status: 'Abgeschlossen', refund: '1.240 €' },
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container dashboard-header__inner">
          <div className="dashboard-header__left">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#ADEE68"/>
              <path d="M10 22L16 10L22 22" stroke="#0C0B0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 17H19" stroke="#0C0B0A" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="dashboard-brand">SteuerWert</span>
          </div>
          <div className="dashboard-header__right">
            <div className="dashboard-user" onClick={() => setShowMenu(!showMenu)}>
              <div className="dashboard-avatar">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="dashboard-email">{user?.email}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`dashboard-chevron ${showMenu ? 'open' : ''}`}>
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {showMenu && (
                <div className="dashboard-dropdown">
                  <button onClick={handleLogout}>Abmelden</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-welcome">
            <h1 className="dashboard-title">Willkommen bei SteuerWert</h1>
            <p className="dashboard-subtitle">
              {user?.email ? `Angemeldet als ${user.email}` : ''}
            </p>
          </div>

          <div className="dashboard-hero-card">
            <div className="dashboard-hero-content">
              <h2>Deine Steuererklärung 2025</h2>
              <p>In nur 30 Minuten zur fertigen Steuererklärung. Einfach den Fragen folgen – wir kümmern uns um den Rest.</p>
              <button className="btn btn-primary dashboard-start-btn" onClick={() => setStartTax(true)}>
                Jetzt Steuererklärung starten
              </button>
            </div>
            <div className="dashboard-hero-icon">💰</div>
          </div>

          <h3 className="dashboard-section-title">Deine Steuererklärungen</h3>
          <div className="dashboard-table">
            <div className="dashboard-table-header">
              <span>Jahr</span>
              <span>Status</span>
              <span>Erstattung</span>
            </div>
            {declarations.map((d) => (
              <div key={d.year} className="dashboard-table-row">
                <span className="dashboard-year">{d.year}</span>
                <span className={`dashboard-status ${d.status === 'Abgeschlossen' ? 'done' : d.status === 'In Bearbeitung' ? 'progress' : ''}`}>
                  {d.status}
                </span>
                <span className="dashboard-refund">{d.refund}</span>
              </div>
            ))}
          </div>

          <div className="dashboard-info-cards">
            <div className="dashboard-info-card">
              <div className="dashboard-info-icon">📋</div>
              <h4>Belege bereithalten</h4>
              <p>Lohnsteuerbescheinigung, Vorsorgeaufwendungen, Spendenquittungen</p>
            </div>
            <div className="dashboard-info-card">
              <div className="dashboard-info-icon">🔒</div>
              <h4>Sicher & verschlüsselt</h4>
              <p>Deine Daten werden SSL-verschlüsselt übertragen und DSGVO-konform gespeichert.</p>
            </div>
            <div className="dashboard-info-card">
              <div className="dashboard-info-icon">⚡</div>
              <h4>Schnelle Bearbeitung</h4>
              <p>Durchschnittlich 6–12 Wochen Bearbeitungszeit beim Finanzamt.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
