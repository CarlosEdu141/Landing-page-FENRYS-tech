import { useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { LogoAnimProvider } from './context/LogoAnim';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import About from './components/About';

// Seções abaixo do fold — carregadas só quando necessário
const Services          = lazy(() => import('./components/Services'));
const ProcessoCircuito  = lazy(() => import('./components/ProcessoCircuito'));
const Projects          = lazy(() => import('./components/Projects'));
const Testimonials      = lazy(() => import('./components/Testimonials'));
const Contact           = lazy(() => import('./components/Contact'));
const Footer            = lazy(() => import('./components/Footer'));

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => { lenis.raf(time * 1000); });
    };
  }, []);

  return (
    <LogoAnimProvider>
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <Hero />
      <Ticker />
      <About />
      <Suspense fallback={null}>
        <hr className="section-divider" />
        <Services />
        <ProcessoCircuito />
        <hr className="section-divider" />
        <Projects />
        <hr className="section-divider" />
        <Testimonials />
        <hr className="section-divider" />
        <Contact />
        <Footer />
      </Suspense>
    </LogoAnimProvider>
  );
}

export default App;
