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
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || '';
      const isDomainError = msg.includes('unauthorized-domain') || msg.includes('authDomain');
      const isNetworkError = msg.includes('network') || msg.includes('NetworkError');

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
              </>
            ) : (
              <>
                <span className="error-boundary-icon">⚠️</span>
                <h2>Ein Fehler ist aufgetreten</h2>
                <p>{this.state.error?.message || 'Die App konnte nicht geladen werden.'}</p>
              </>
            )}
            <button className="btn btn-primary" onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}>
              Seite neu laden
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
