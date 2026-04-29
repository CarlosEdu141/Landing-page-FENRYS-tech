import './index.css';
import { LogoAnimProvider } from './context/LogoAnim';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import About from './components/About';
import Services from './components/Services';
import Process from './components/Process';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingCTA from './components/FloatingCTA';

function App() {
  return (
    <LogoAnimProvider>
      <Navbar />
      <Hero />
      <Ticker />
      <About />
      <div className="section-divider" role="separator" />
      <Services />
      <div className="section-divider" role="separator" />
      <Process />
      <div className="section-divider" role="separator" />
      <Projects />
      <div className="section-divider" role="separator" />
      <Testimonials />
      <div className="section-divider" role="separator" />
      <Contact />
      <Footer />
      <FloatingCTA />
    </LogoAnimProvider>
  );
}

export default App;