import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SteuerWert Fehler:', error, errorInfo);
    // Log additional context
    console.error('URL:', window.location.href);
    console.error('User Agent:', navigator.userAgent);
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || '';
      const isDomainError = msg.includes('unauthorized-domain') || msg.includes('authDomain');
      const isNetworkError = msg.includes('network') || msg.includes('NetworkError') || msg.includes('ERR_NAME_NOT_RESOLVED');
      const isFirebaseInitError = msg.includes('Firebase') || msg.includes('firebase') || msg.includes('auth/');

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            {isDomainError ? (
              <>
                <span className="error-boundary-icon">🔐</span>
                <h2>Domain nicht freigegeben</h2>
                <p>Diese Domain ist in der Firebase-Konsole nicht als autorisierte Domain eingetragen.</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  Domain: <code>{window.location.origin}</code>
                </p>
                <div style={{
                  background: 'var(--color-surface-alt)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                }}>
                  <strong>So behebst du das:</strong>
                  <ol style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', lineHeight: '1.8' }}>
                    <li>Öffne die <a href="https://console.firebase.google.com" target="_blank" rel="noopener" style={{ color: '#36893B', textDecoration: 'underline' }}>Firebase Console</a></li>
                    <li>Wähle Projekt <strong>gptcall-416910</strong></li>
                    <li>Gehe zu <strong>Authentication → Settings</strong></li>
                    <li>Füge <code style={{ background: 'rgba(0,0,0,0.08)', padding: '2px 6px', borderRadius: '4px' }}>{window.location.origin}</code> hinzu</li>
                    <li>Klicke <strong>Speichern</strong> und lade die Seite neu</li>
                  </ol>
                </div>
              </>
            ) : isFirebaseInitError ? (
              <>
                <span className="error-boundary-icon">🔥</span>
                <h2>Firebase Konfigurationsfehler</h2>
                <p>Die Firebase-Verbindung konnte nicht hergestellt werden.</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  {this.state.error?.message}
                </p>
              </>
            ) : (
              <>
                <span className="error-boundary-icon">⚠️</span>
                <h2>Ein Fehler ist aufgetreten</h2>
                <p>{this.state.error?.message || 'Die App konnte nicht geladen werden.'}</p>
              </>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}>
                Seite neu laden
              </button>
              {isDomainError && (
                <button className="btn btn-outline" onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}>
                  Trotzdem fortfahren
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
