import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Auth({ isOpen, onClose, onLoginSuccess }) {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, loginWithApple, resetPassword } = useAuth();
  const [mode, setMode] = useState('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setMode('select');
      setEmail('');
      setPassword('');
      setError('');
      setSuccessMsg('');
    }, 200);
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      onLoginSuccess?.();
      handleClose();
    } catch (err) {
      const msg = getErrorMessage(err.code);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      onLoginSuccess?.();
      handleClose();
    } catch (err) {
      const msg = getErrorMessage(err.code);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithApple();
      onLoginSuccess?.();
      handleClose();
    } catch (err) {
      const msg = getErrorMessage(err.code);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccessMsg('E-Mail zum Zurücksetzen wurde gesendet.');
      setMode('email');
    } catch (err) {
      const msg = getErrorMessage(err.code);
      setError(msg);
    } finally {
      setLoading(false);
    }
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
          <h2 className="auth-title">
            {mode === 'select' && 'Willkommen bei SteuerWert'}
            {mode === 'email' && 'Willkommen zurück'}
            {mode === 'register' && 'Konto erstellen'}
            {mode === 'forgot' && 'Passwort vergessen'}
          </h2>
          <p className="auth-desc">
            {mode === 'select' && 'Melde dich an oder erstelle ein Konto, um deine Steuererklärung zu starten.'}
            {mode === 'email' && 'Melde dich mit deiner E-Mail-Adresse an.'}
            {mode === 'register' && 'Erstelle ein Konto für deine Steuererklärung.'}
            {mode === 'forgot' && 'Gib deine E-Mail ein, wir senden dir einen Link.'}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {successMsg && <div className="auth-success">{successMsg}</div>}

        {mode === 'select' && (
          <div className="auth-options">
            <button className="auth-btn auth-btn--email" onClick={() => { setError(''); setMode('email'); }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="3" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M1 5L10 11L19 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              Mit E-Mail-Adresse fortfahren
            </button>

            <button className="auth-btn auth-btn--google" onClick={handleGoogleAuth} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18.4 10.23c0-.68-.06-1.34-.17-1.97H10v3.73h4.71a4.43 4.43 0 0 1-1.92 2.91v2.42h3.11c1.82-1.68 2.87-4.15 2.87-7.09z" fill="#4285F4"/>
                <path d="M10 19c2.6 0 4.78-.86 6.37-2.33l-3.11-2.42c-.86.58-1.96.92-3.26.92-2.5 0-4.63-1.69-5.38-3.97H1.4v2.5A9.6 9.6 0 0 0 10 19z" fill="#34A853"/>
                <path d="M4.62 11.2a5.78 5.78 0 0 1 0-3.7v-2.5H1.4a9.6 9.6 0 0 0 0 8.7l3.22-2.5z" fill="#FBBC05"/>
                <path d="M10 3.83c1.42 0 2.69.49 3.69 1.44l2.77-2.77C14.78.99 12.6 0 10 0 6.11 0 2.81 2.22 1.4 5.5l3.22 2.5C5.37 5.52 7.5 3.83 10 3.83z" fill="#EA4335"/>
              </svg>
              Mit Google fortfahren
            </button>

            <button className="auth-btn auth-btn--apple" onClick={handleAppleAuth} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15.17 10.6c-.02-2.05 1.67-3.04 1.74-3.09-.95-1.39-2.42-1.58-2.95-1.6-1.25-.13-2.44.74-3.08.74-.63 0-1.62-.72-2.66-.7-1.37.02-2.63.8-3.34 2.03-1.42 2.47-.36 6.13 1.02 8.13.68.98 1.48 2.08 2.54 2.04 1.02-.04 1.4-.66 2.63-.66s1.58.66 2.65.64c1.1-.02 1.8-1 2.47-1.99.77-1.13 1.09-2.22 1.11-2.28-.02-.01-2.13-.82-2.15-3.25z" fill="currentColor"/>
                <path d="M13.28 3.3c.55-.67.92-1.6.82-2.52-.8.03-1.77.53-2.34 1.2-.52.6-.97 1.56-.85 2.48.9.07 1.82-.45 2.37-1.16z" fill="currentColor"/>
              </svg>
              Mit Apple fortfahren
            </button>
          </div>
        )}

        {(mode === 'email' || mode === 'register') && (
          <form className="auth-form" onSubmit={handleEmailAuth}>
            <div className="auth-field">
              <label htmlFor="auth-email" className="auth-label">E-Mail-Adresse</label>
              <input
                id="auth-email"
                type="email"
                className="auth-input"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="auth-password" className="auth-label">Passwort</label>
              <input
                id="auth-password"
                type="password"
                className="auth-input"
                placeholder={mode === 'register' ? 'Mindestens 6 Zeichen' : 'Dein Passwort'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="auth-btn auth-btn--primary" disabled={loading}>
              {loading ? 'Wird verarbeitet...' : mode === 'register' ? 'Konto erstellen' : 'Anmelden'}
            </button>
            {mode === 'email' && (
              <button type="button" className="auth-link-btn" onClick={() => setMode('forgot')}>
                Passwort vergessen?
              </button>
            )}
          </form>
        )}

        {mode === 'forgot' && (
          <form className="auth-form" onSubmit={handleForgotPassword}>
            <div className="auth-field">
              <label htmlFor="forgot-email" className="auth-label">E-Mail-Adresse</label>
              <input
                id="forgot-email"
                type="email"
                className="auth-input"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-btn auth-btn--primary" disabled={loading}>
              {loading ? 'Wird gesendet...' : 'Link senden'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          {mode === 'email' && (
            <p className="auth-switch">
              Noch kein Konto?{' '}
              <button className="auth-link" onClick={() => { setError(''); setMode('register'); }}>
                Jetzt registrieren
              </button>
            </p>
          )}
          {mode === 'register' && (
            <p className="auth-switch">
              Bereits registriert?{' '}
              <button className="auth-link" onClick={() => { setError(''); setMode('email'); }}>
                Jetzt anmelden
              </button>
            </p>
          )}
          {mode !== 'select' && mode !== 'forgot' && mode !== 'email' && mode !== 'register' && (
            <button className="auth-back" onClick={() => { setError(''); setMode('select'); }}>
              ← Andere Optionen
            </button>
          )}
          {(mode === 'forgot') && (
            <button className="auth-back" onClick={() => { setError(''); setMode('email'); }}>
              ← Zurück zur Anmeldung
            </button>
          )}
          <p className="auth-legal">
            Mit der Anmeldung stimmst du unseren <a href="#">AGB</a> und{' '}
            <a href="#">Datenschutzbestimmungen</a> zu.
          </p>
        </div>
      </div>
    </div>
  );
}

function getErrorMessage(code) {
  const map = {
    'auth/user-not-found': 'Kein Konto mit dieser E-Mail gefunden.',
    'auth/wrong-password': 'Falsches Passwort. Bitte versuche es erneut.',
    'auth/email-already-in-use': 'Diese E-Mail wird bereits verwendet.',
    'auth/weak-password': 'Das Passwort muss mindestens 6 Zeichen lang sein.',
    'auth/invalid-email': 'Ungültige E-Mail-Adresse.',
    'auth/invalid-credential': 'E-Mail oder Passwort ist falsch.',
    'auth/too-many-requests': 'Zu viele Versuche. Bitte warte kurz.',
    'auth/popup-closed-by-user': 'Der Login wurde abgebrochen.',
    'auth/account-exists-with-different-credential': 'Ein Konto mit dieser E-Mail existiert bereits mit einer anderen Anmeldeart.',
    'auth/operation-not-supported-in-this-environment': 'Apple Anmeldung wird auf diesem Gerät nicht unterstützt. Bitte verwende E-Mail oder Google.',
    'auth/web-context-unsupported': 'Apple Anmeldung wird in diesem Browser nicht unterstützt. Bitte verwende Safari oder einen anderen Browser.',
  };
  return map[code] || 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.';
}
