import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import Marquee from './components/Marquee';
import AmbientHalos from './components/AmbientHalos';
import Login from './components/Login';
import Dashboard from './dashboard/Dashboard';
import { getToken, clearToken } from './lib/auth.js';

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
  // Minimal route split: no router dep — we branch on the path.
  // /login   → Login form
  // /dashboard*  → Dashboard (guarded: requires JWT in localStorage)
  // anything else → public landing
  if (typeof window === 'undefined') return <Landing />;

  const path = window.location.pathname;

  if (path === '/login') {
    return <Login />;
  }

  if (path.startsWith('/dashboard')) {
    if (!getToken()) {
      // Replace so the back button doesn't bounce back to /dashboard.
      window.location.replace('/login');
      return null;
    }
    return (
      <Dashboard
        onLogout={() => {
          clearToken();
          window.location.href = '/login';
        }}
      />
    );
  }

  return <Landing />;
}

export default App;
