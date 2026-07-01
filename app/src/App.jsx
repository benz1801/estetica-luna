import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import Marquee from './components/Marquee';
import AmbientHalos from './components/AmbientHalos';

function App() {
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

export default App;
