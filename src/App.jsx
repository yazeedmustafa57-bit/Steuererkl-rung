import { useState } from 'react';
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

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <p>SteuerWert wird geladen…</p>
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
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
