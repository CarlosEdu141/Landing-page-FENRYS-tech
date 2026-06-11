import { LogoAnimProvider } from './context/LogoAnim';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
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

function App() {
  return (
    <LogoAnimProvider>
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <Hero />
      <Ticker />
      <About />
      <hr className="section-divider" />
      <Services />
      <hr className="section-divider" />
      <Process />
      <hr className="section-divider" />
      <Projects />
      <hr className="section-divider" />
      <Testimonials />
      <hr className="section-divider" />
      <Contact />
      <Footer />
    </LogoAnimProvider>
  );
}

export default App;