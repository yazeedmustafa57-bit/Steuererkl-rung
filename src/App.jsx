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

function AppContent() {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [initError, setInitError] = useState(null);

  // Log on mount for debugging
  useEffect(() => {
    console.log('SteuerWert App – initialisiert');
    console.log('User:', user);
    console.log('Loading:', loading);
  }, [user, loading]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <p>SteuerWert wird geladen…</p>
      </div>
    );
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
    return <Dashboard onLogout={() => {}} />;
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
