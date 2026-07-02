import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Trust from './components/Trust';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Auth from './components/Auth';

function App() {
  const [authOpen, setAuthOpen] = useState(false);

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
      <Auth isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default App;
