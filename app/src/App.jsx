import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import Marquee from './components/Marquee';
import AmbientHalos from './components/AmbientHalos';
import Dashboard from './dashboard/Dashboard';

function Landing() {
  return (
    <>
      <ScrollProgress />
      <AmbientHalos />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Contact />
      </main>
      <Marquee
        tone="dark"
        items={[
          'Prenota il tuo rituale',
          'Via Nazionale 206 · Ponticino',
          'Aperto fino a venerdì incluso',
          'WhatsApp 3458889593',
          'Cosmetici biologici',
          'Tre cabine per te',
        ]}
      />
      <Footer />
    </>
  );
}

function App() {
  // Minimal route split: /dashboard* renders the gestionale, anything
  // else renders the public landing. No router dependency; the dev
  // server already serves index.html for every deep link.
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
    return <Dashboard />;
  }
  return <Landing />;
}

export default App;
