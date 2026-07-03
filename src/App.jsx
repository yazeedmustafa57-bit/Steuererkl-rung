import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Trust from './components/Trust';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function AuthErrorDisplay({ authError, onRetry }) {
  return (
    <div className="app-loading" style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        {authError.type === 'domain' ? '🔐' : authError.type === 'network' ? '🌐' : '⚠️'}
      </div>
      <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>
        {authError.type === 'domain' ? 'Domain nicht autorisiert' :
         authError.type === 'network' ? 'Netzwerkfehler' : 'Verbindungsfehler'}
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '450px', margin: '0 auto 1rem', lineHeight: '1.5' }}>
        {authError.message}
      </p>
      {authError.type === 'domain' && (
        <div style={{
          background: 'var(--color-surface-alt)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          margin: '1rem auto',
          maxWidth: '480px',
          textAlign: 'left',
          fontSize: '0.85rem',
          lineHeight: '1.6',
        }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>So löst du das Problem:</strong>
          <ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
            <li>Gehe zur <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-dark)', textDecoration: 'underline' }}>Firebase Console</a></li>
            <li>Wähle dein Projekt <strong>gptcall-416910</strong></li>
            <li>Gehe zu <strong>Authentication → Settings</strong></li>
            <li>Füge <code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>{window.location.origin}</code> hinzu</li>
          </ol>
        </div>
      )}
      <button className="btn btn-primary" onClick={onRetry} style={{ marginTop: '0.5rem' }}>
        Seite neu laden
      </button>
    </div>
  );
}

function AppContent() {
  const { user, loading, authError, clearAuthError } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [initError, setInitError] = useState(null);

  // Log on mount for debugging
  useEffect(() => {
    console.log('SteuerWert App – initialisiert');
    console.log('User:', user);
    console.log('Loading:', loading);
    console.log('AuthError:', authError);
  }, [user, loading, authError]);

  // Cleanup auth error when opening auth modal
  useEffect(() => {
    if (authOpen && authError) {
      clearAuthError();
    }
  }, [authOpen]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <p>SteuerWert wird geladen…</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          Verbindung zu Firebase wird hergestellt
        </p>
      </div>
    );
  }

  if (authError) {
    return <AuthErrorDisplay authError={authError} onRetry={() => window.location.reload()} />;
  }

  if (initError) {
    return (
      <div className="app-loading" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ marginBottom: '0.5rem' }}>Verbindungsfehler</h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
          Die App konnte keine Verbindung herstellen. Bitte lade die Seite neu oder versuche es später erneut.
        </p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Seite neu laden
        </button>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <>
      <Header onAuthOpen={() => setAuthOpen(true)} />
      <main>
        <Hero onAuthOpen={() => setAuthOpen(true)} />
        <HowItWorks onAuthOpen={() => setAuthOpen(true)} />
        <Pricing onAuthOpen={() => setAuthOpen(true)} />
        <Trust />
        <FAQ />
      </main>
      <Footer onAuthOpen={() => setAuthOpen(true)} />
      <Auth
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={() => setAuthOpen(false)}
      />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
