import { useEffect, useLayoutEffect, useRef, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { LogoAnimProvider } from './context/LogoAnim';
import { PageTransitionProvider, usePageTransition } from './context/PageTransition';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import About from './components/About';

// Seções abaixo do fold — carregadas só quando necessário
const Services          = lazy(() => import('./components/Services'));
const ProcessoBuild     = lazy(() => import('./components/ProcessoBuild'));
const Projects          = lazy(() => import('./components/Projects'));
const Testimonials      = lazy(() => import('./components/Testimonials'));
const Contact           = lazy(() => import('./components/Contact'));
const Footer            = lazy(() => import('./components/Footer'));

// Página da história — o chunk é pré-carregado assim que a transição começa
const loadHistoria = () => import('./components/Historia');
const Historia     = lazy(loadHistoria);

gsap.registerPlugin(ScrollTrigger);
// barra de endereço do celular aparecendo/sumindo não deve recalcular os pins (evita "pulos")
ScrollTrigger.config({ ignoreMobileResize: true });

function Home() {
  const { notifyPageReady } = usePageTransition();
  useLayoutEffect(() => { notifyPageReady(); }, [notifyPageReady]);

  return (
    <>
      <Navbar />
      <Hero />
      <Ticker />
      <About />
      <Suspense fallback={null}>
        <hr className="section-divider" />
        <Services />
        <ProcessoBuild />
        <hr className="section-divider" />
        <Projects />
        <hr className="section-divider" />
        <Testimonials />
        <hr className="section-divider" />
        <Contact />
        <Footer />
      </Suspense>
    </>
  );
}

function Pages() {
  const { page } = usePageTransition();
  if (page === 'historia') {
    return (
      <Suspense fallback={null}>
        <Historia />
      </Suspense>
    );
  }
  return <Home />;
}

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => { lenis.raf(time * 1000); };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(raf);
    };
  }, []);

  return (
    <LogoAnimProvider>
      <PageTransitionProvider lenisRef={lenisRef} prefetch={loadHistoria}>
        <ScrollProgress />
        <CustomCursor />
        <Pages />
      </PageTransitionProvider>
    </LogoAnimProvider>
  );
}

export default App;
