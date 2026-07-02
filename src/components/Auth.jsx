import { useState } from 'react';

export default function Auth({ isOpen, onClose }) {
  const [mode, setMode] = useState('select');

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      setMode('select');
    }
  };

  const handleClose = () => {
    onClose();
    setMode('select');
  };

  const handleEmailNext = (e) => {
    e.preventDefault();
    // In a real app, this would send OTP or create account
    alert('E-Mail-Registrierung würde hier starten. (Demo)');
  };

  const handleGoogle = () => {
    alert('Google-Anmeldung würde hier starten. (Demo)');
  };

  const handleApple = () => {
    alert('Apple-Anmeldung würde hier starten. (Demo)');
  };

  return (
    <div className="auth-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <button className="auth-close" onClick={handleClose} aria-label="Schließen">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="auth-header">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#ADEE68"/>
            <path d="M10 22L16 10L22 22" stroke="#0C0B0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 17H19" stroke="#0C0B0A" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <h2 className="auth-title">Willkommen bei SteuerWert</h2>
          <p className="auth-desc">
            {mode === 'select'
              ? 'Erstelle ein Konto oder melde dich an, um deine Steuererklärung zu starten.'
              : 'Mit deiner E-Mail-Adresse fortfahren.'}
          </p>
        </div>

        {mode === 'select' ? (
          <div className="auth-options">
            <button className="auth-btn auth-btn--email" onClick={() => setMode('email')}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="3" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M1 5L10 11L19 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              Mit E-Mail-Adresse fortfahren
            </button>

            <button className="auth-btn auth-btn--google" onClick={handleGoogle}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18.4 10.23c0-.68-.06-1.34-.17-1.97H10v3.73h4.71a4.43 4.43 0 0 1-1.92 2.91v2.42h3.11c1.82-1.68 2.87-4.15 2.87-7.09z" fill="#4285F4"/>
                <path d="M10 19c2.6 0 4.78-.86 6.37-2.33l-3.11-2.42c-.86.58-1.96.92-3.26.92-2.5 0-4.63-1.69-5.38-3.97H1.4v2.5A9.6 9.6 0 0 0 10 19z" fill="#34A853"/>
                <path d="M4.62 11.2a5.78 5.78 0 0 1 0-3.7v-2.5H1.4a9.6 9.6 0 0 0 0 8.7l3.22-2.5z" fill="#FBBC05"/>
                <path d="M10 3.83c1.42 0 2.69.49 3.69 1.44l2.77-2.77C14.78.99 12.6 0 10 0 6.11 0 2.81 2.22 1.4 5.5l3.22 2.5C5.37 5.52 7.5 3.83 10 3.83z" fill="#EA4335"/>
              </svg>
              Mit Google fortfahren
            </button>

            <button className="auth-btn auth-btn--apple" onClick={handleApple}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15.17 10.6c-.02-2.05 1.67-3.04 1.74-3.09-.95-1.39-2.42-1.58-2.95-1.6-1.25-.13-2.44.74-3.08.74-.63 0-1.62-.72-2.66-.7-1.37.02-2.63.8-3.34 2.03-1.42 2.47-.36 6.13 1.02 8.13.68.98 1.48 2.08 2.54 2.04 1.02-.04 1.4-.66 2.63-.66s1.58.66 2.65.64c1.1-.02 1.8-1 2.47-1.99.77-1.13 1.09-2.22 1.11-2.28-.02-.01-2.13-.82-2.15-3.25z" fill="currentColor"/>
                <path d="M13.28 3.3c.55-.67.92-1.6.82-2.52-.8.03-1.77.53-2.34 1.2-.52.6-.97 1.56-.85 2.48.9.07 1.82-.45 2.37-1.16z" fill="currentColor"/>
              </svg>
              Mit Apple fortfahren
            </button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleEmailNext}>
            <div className="auth-field">
              <label htmlFor="auth-email" className="auth-label">E-Mail-Adresse</label>
              <input
                id="auth-email"
                type="email"
                className="auth-input"
                placeholder="deine@email.de"
                required
              />
            </div>
            <button type="submit" className="auth-btn auth-btn--primary">
              Weiter mit E-Mail
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p className="auth-legal">
            Mit der Anmeldung stimmst du unseren <a href="#">AGB</a> und{' '}
            <a href="#">Datenschutzbestimmungen</a> zu.
          </p>
          {mode !== 'select' && (
            <button className="auth-back" onClick={() => setMode('select')}>
              ← Andere Optionen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
