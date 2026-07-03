import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Auth({ isOpen, onClose, onLoginSuccess }) {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, loginWithApple, resetPassword } = useAuth();
  const [mode, setMode] = useState('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [redirectMsg, setRedirectMsg] = useState('');

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode('select');
      setEmail('');
      setPassword('');
      setError('');
      setSuccessMsg('');
      setRedirectMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setRedirectMsg('');
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
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setRedirectMsg('');
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result?.user) {
        onLoginSuccess?.();
        handleClose();
      } else {
        // Redirect-based – show message
        setRedirectMsg('Weiterleitung zu Google… Bitte warten.');
        setTimeout(() => onClose(), 500);
      }
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setError('');
    setRedirectMsg('');
    setLoading(true);
    try {
      const result = await loginWithApple();
      if (result?.user) {
        onLoginSuccess?.();
        handleClose();
      } else {
        // Redirect-based – show message
        setRedirectMsg('Weiterleitung zu Apple… Bitte warten.');
        setTimeout(() => onClose(), 500);
      }
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setRedirectMsg('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccessMsg('E-Mail zum Zurücksetzen wurde gesendet. Bitte prüfe dein Postfach.');
    } catch (err) {
      setError(getErrorMessage(err.code));
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
        {redirectMsg && <div className="auth-success">{redirectMsg}</div>}

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
                <path d="M10 19c2.6 0 4.78-.86 6.37-2.33l-3.11-2.42c-.86.58-1.96.92-3.26.92-2.5 0-4.63-1.69-5.39-3.97H1.38v2.5C3.01 16.92 6.3 19 10 19z" fill="#34A853"/>
                <path d="M4.61 13.2a5.86 5.86 0 0 1 0-3.74v-2.5H1.38a9.96 9.96 0 0 0 0 8.74l3.23-2.5z" fill="#FBBC05"/>
                <path d="M10 4.09c1.32 0 2.5.45 3.44 1.35l2.58-2.59C14.66 1.2 12.46.2 10 .2 6.3.2 3.01 2.28 1.38 5.2l3.23 2.5C5.37 5.78 7.5 4.09 10 4.09z" fill="#EA4335"/>
              </svg>
              Mit Google fortfahren
            </button>

            <button className="auth-btn auth-btn--apple" onClick={handleAppleAuth} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M14.94 10.63c-.02-1.4.62-2.45 1.85-3.2-.7-1.02-1.76-1.6-3.18-1.74-1.35-.13-2.84.8-3.54.8-.72 0-1.88-.76-3.16-.74-1.63.02-3.13.96-3.97 2.44-1.7 2.98-.44 7.4 1.22 9.82.8 1.18 1.75 2.5 3 2.44 1.2-.06 1.67-.8 3.13-.8 1.44 0 1.86.8 3.14.77 1.3-.02 2.13-1.2 2.91-2.38.92-1.36 1.3-2.7 1.32-2.77-.02-.02-2.54-1-2.52-3.64z" fill="white"/>
                <path d="M12.12 3.2C12.72 2.37 13.1 1.34 13.02.2c-.95.06-2.08.52-2.72 1.22-.56.6-1.05 1.58-.96 2.5 1.02.08 1.97-.38 2.78-1.72z" fill="white"/>
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
                autoFocus
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
              {loading ? 'Wird verarbeitet…' : mode === 'register' ? 'Konto erstellen' : 'Anmelden'}
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
                autoFocus
              />
            </div>
            <button type="submit" className="auth-btn auth-btn--primary" disabled={loading}>
              {loading ? 'Wird gesendet…' : 'Link senden'}
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
          {mode === 'forgot' && (
            <button className="auth-back" onClick={() => { setError(''); setMode('email'); }}>
              ← Zurück zur Anmeldung
            </button>
          )}
          {(mode === 'email' || mode === 'register') && (
            <button className="auth-back" onClick={() => { setError(''); setMode('select'); }}>
              ← Andere Anmeldeoptionen
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
    'auth/operation-not-supported-in-this-environment': 'Diese Anmeldemethode wird auf diesem Gerät nicht unterstützt. Bitte verwende E-Mail oder Google.',
    'auth/web-context-unsupported': 'Diese Anmeldemethode wird in diesem Browser nicht unterstützt.',
    'auth/popup-blocked': 'Popup wurde blockiert. Bitte erlaube Popups in den Browser-Einstellungen.',
    'auth/unauthorized-domain': 'Diese Domain ist für die Anmeldung nicht freigeschaltet. Bitte den Admin kontaktieren.',
    'auth/operation-not-allowed': 'Apple Anmeldung ist noch nicht eingerichtet. Der Admin muss Apple in der Firebase-Konsole aktivieren. Bitte verwende vorerst E-Mail oder Google.',
    'auth/admin-restricted-operation': 'Apple Anmeldung ist noch nicht konfiguriert. Bitte verwende E-Mail oder Google.',
    'auth/redirect-cancelled-by-user': 'Die Anmeldung wurde abgebrochen.',
    'auth/redirect-operation-pending': 'Eine Anmeldung ist bereits in Bearbeitung. Bitte warte einen Moment.',
    'auth/invalid-oauth-provider': 'Apple Anmeldung ist nicht richtig konfiguriert.',
  };
  return map[code] || 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.';
}
