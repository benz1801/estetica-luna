import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import Marquee from './components/Marquee';

function App() {
  return (
    <>
      <ScrollProgress />
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
          'Via dei Tigli 14 · Milano',
          'Aperto anche il sabato',
          'WhatsApp 02 2333 4455',
          'Cosmetici biologici',
          'Tre cabine per te',
        ]}
      />
      <Footer />
    </>
  );
}

export default App;
