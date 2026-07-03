import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Auth({ isOpen, onClose, onLoginSuccess }) {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, loginWithApple, resetPassword, authError, clearAuthError } = useAuth();
  const [mode, setMode] = useState('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [redirectMsg, setRedirectMsg] = useState('');

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode('select');
      setEmail('');
      setPassword('');
      setLocalError('');
      setSuccessMsg('');
      setRedirectMsg('');
      clearAuthError();
    }
  }, [isOpen, clearAuthError]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLocalError('');
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
      setLocalError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLocalError('');
    setRedirectMsg('');
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result?.user) {
        onLoginSuccess?.();
        handleClose();
      } else {
        setRedirectMsg('Weiterleitung zu Google… Bitte warten.');
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        // User cancelled, do nothing
      } else if (err.code === 'auth/unauthorized-domain') {
        setLocalError('Diese Domain ist nicht autorisiert. Bitte Admin kontaktieren.');
      } else {
        setLocalError(getErrorMessage(err.code));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setLocalError('');
    setRedirectMsg('');
    setLoading(true);
    try {
      const result = await loginWithApple();
      if (result?.user) {
        onLoginSuccess?.();
        handleClose();
      } else {
        setRedirectMsg('Weiterleitung zu Apple… Bitte warten.');
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        // User cancelled, do nothing
      } else if (err.code === 'auth/unauthorized-domain') {
        setLocalError('Diese Domain ist nicht autorisiert. Bitte Admin kontaktieren.');
      } else if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {
        setLocalError('Apple Anmeldung ist in der Firebase-Konsole noch nicht aktiviert. Bitte verwende E-Mail oder Google.');
      } else {
        setLocalError(getErrorMessage(err.code));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLocalError('');
    setRedirectMsg('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccessMsg('E-Mail zum Zurücksetzen wurde gesendet. Bitte prüfe dein Postfach.');
    } catch (err) {
      setLocalError(getErrorMessage(err.code));
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

        {localError && <div className="auth-error">{localError}</div>}
        {authError && <div className="auth-error">{authError.message}</div>}
        {successMsg && <div className="auth-success">{successMsg}</div>}
        {redirectMsg && <div className="auth-redirect">{redirectMsg}</div>}

        {redirectMsg && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div className="app-loading-spinner" style={{ width: 32, height: 32, margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              {redirectMsg.includes('Apple') ? 'Apple' : 'Google'}-Anmeldung wird gestartet…
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Nach der Weiterleitung wirst du automatisch zurückgeleitet.
            </p>
          </div>
        )}

        {!redirectMsg && mode === 'select' && (
          <div className="auth-options">
            <button className="auth-btn auth-btn--email" onClick={() => { setLocalError(''); setMode('email'); }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="3" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 4l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Mit E-Mail fortfahren</span>
            </button>

            <button className="auth-btn auth-btn--google" onClick={handleGoogleAuth} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18.17 10.19c0-.63-.06-1.24-.17-1.83H10v3.46h4.59a4.12 4.12 0 01-1.79 2.7v2.25h2.9c1.7-1.56 2.68-3.86 2.68-6.58z" fill="#4285F4"/>
                <path d="M10 18.5c2.43 0 4.47-.8 5.96-2.18l-2.9-2.25c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.73H1.97v2.32A9 9 0 0010 18.5z" fill="#34A853"/>
                <path d="M4.95 11.45a5.43 5.43 0 010-3.46V5.67H1.97a9 9 0 000 8.1l2.98-2.32z" fill="#FBBC05"/>
                <path d="M10 4.07c1.32 0 2.5.45 3.43 1.35l2.57-2.57C14.46 1.7 12.43.83 10 .83a9 9 0 00-8.03 4.84l2.98 2.32C5.66 5.66 7.65 4.07 10 4.07z" fill="#EA4335"/>
              </svg>
              <span>Mit Google fortfahren</span>
            </button>

            <button className="auth-btn auth-btn--apple" onClick={handleAppleAuth} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M14.94 10.64c-.01-1.58.72-2.78 2.1-3.64-.79-1.14-1.98-1.77-3.57-1.9-1.52-.13-3.17.89-3.78.89-.63 0-2.01-.86-3.31-.86C4.47 5.2 2.7 6.7 2.7 9.73c0 1.14.2 2.32.61 3.54.54 1.58 2.49 5.46 4.52 5.4 1.07-.03 1.8-.77 3.16-.77 1.33 0 2.14.77 3.23.77 2.05-.03 3.8-3.55 4.3-5.14-2.73-1.3-2.58-3.75-2.58-3.89zM12.44 4.25c.84-1.01.76-1.93.72-2.25-.82.04-1.78.46-2.34 1.06-.63.66-.98 1.47-.9 2.34.84.06 1.66-.4 2.52-1.15z"/>
              </svg>
              <span>Mit Apple fortfahren</span>
            </button>

            <div className="auth-divider">
              <span>oder</span>
            </div>

            <button className="auth-btn auth-btn--register" onClick={() => { setLocalError(''); setMode('register'); }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 18c0-3.31 3.13-6 7-6s7 2.69 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Konto erstellen</span>
            </button>
          </div>
        )}

        {!redirectMsg && (mode === 'email' || mode === 'register') && (
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

        {!redirectMsg && mode === 'forgot' && (
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
              <button className="auth-link" onClick={() => { setLocalError(''); setMode('register'); }}>
                Jetzt registrieren
              </button>
            </p>
          )}
          {mode === 'register' && (
            <p className="auth-switch">
              Bereits registriert?{' '}
              <button className="auth-link" onClick={() => { setLocalError(''); setMode('email'); }}>
                Jetzt anmelden
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <button className="auth-back" onClick={() => { setLocalError(''); setMode('email'); }}>
              ← Zurück zur Anmeldung
            </button>
          )}
          {(mode === 'email' || mode === 'register') && (
            <button className="auth-back" onClick={() => { setLocalError(''); setMode('select'); }}>
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
    'auth/operation-not-supported-in-this-environment': 'Diese Anmeldemethode wird auf diesem Gerät nicht unterstützt. Bitte verwende E-Mail.',
    'auth/web-context-unsupported': 'Diese Anmeldemethode wird in diesem Browser nicht unterstützt.',
    'auth/popup-blocked': 'Popup wurde blockiert. Bitte erlaube Popups in den Browser-Einstellungen.',
    'auth/unauthorized-domain': 'Diese Domain ist für die Anmeldung nicht freigeschaltet. Bitte den Admin kontaktieren.',
    'auth/operation-not-allowed': 'Apple Anmeldung ist noch nicht eingerichtet. Bitte verwende E-Mail oder Google.',
    'auth/admin-restricted-operation': 'Apple Anmeldung ist noch nicht konfiguriert. Bitte verwende E-Mail oder Google.',
    'auth/redirect-cancelled-by-user': 'Die Anmeldung wurde abgebrochen.',
    'auth/redirect-operation-pending': 'Eine Anmeldung ist bereits in Bearbeitung. Bitte warte einen Moment.',
    'auth/invalid-oauth-provider': 'Apple Anmeldung ist nicht richtig konfiguriert.',
  };
  return map[code] || 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.';
}
