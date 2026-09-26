import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLogoAnim } from './LogoAnim';

const Ctx = createContext(null);
export const usePageTransition = () => useContext(Ctx);

const ROUTES = { home: '/', historia: '/historia' };

function pageFromPath(pathname) {
  return pathname.replace(/\/+$/, '') === ROUTES.historia ? 'historia' : 'home';
}

// Safari sofre com vários drop-shadow animados — usa um brilho mais simples
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Raio necessário para um círculo centrado em (x, y) cobrir a viewport inteira
function coverRadius(x, y) {
  const w = window.innerWidth, h = window.innerHeight;
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 40;
}

/* ── Overlay imperativo (fora do React, sobrevive à troca de página) ── */
function createOverlay(cx, cy) {
  const root = document.createElement('div');
  root.setAttribute('aria-hidden', 'true');
  Object.assign(root.style, {
    position: 'fixed', inset: '0', zIndex: '9995',
    pointerEvents: 'auto', overflow: 'hidden',
  });

  const portal = document.createElement('div');
  Object.assign(portal.style, {
    position: 'absolute', inset: '0',
    background: `radial-gradient(circle at ${cx}px ${cy}px,
      rgba(124,63,255,0.35) 0%, rgba(79,124,255,0.12) 28%, var(--navy) 62%)`,
    backgroundColor: 'var(--navy)',
    clipPath: `circle(0px at ${cx}px ${cy}px)`,
    willChange: 'clip-path',
  });
  root.appendChild(portal);

  // Ondas de choque saindo da logo
  const waves = [0, 1, 2].map((i) => {
    const w = document.createElement('div');
    Object.assign(w.style, {
      position: 'absolute', left: `${cx}px`, top: `${cy}px`,
      width: '10px', height: '10px', borderRadius: '50%',
      border: `${i === 1 ? 2 : 1}px solid ${i % 2 ? 'rgba(124,63,255,0.8)' : 'rgba(79,124,255,0.8)'}`,
      boxShadow: '0 0 24px rgba(124,63,255,0.5)',
      opacity: '0',
    });
    root.appendChild(w);
    return w;
  });

  const logo = document.createElement('img');
  logo.src = `${import.meta.env.BASE_URL}Fenrys_transparente.png`;
  logo.alt = '';
  Object.assign(logo.style, {
    position: 'absolute', left: `${cx}px`, top: `${cy}px`,
    willChange: 'transform, filter, opacity',
  });
  root.appendChild(logo);
  gsap.set([...waves, logo], { xPercent: -50, yPercent: -50 });

  document.body.appendChild(root);
  return { root, portal, waves, logo };
}

export function PageTransitionProvider({ lenisRef, prefetch, children }) {
  const { triggerReturn } = useLogoAnim();
  const [page, setPage] = useState(() => pageFromPath(window.location.pathname));
  const pageRef = useRef(page);
  const busy = useRef(false);
  const readyResolver = useRef(null);

  /* Cada página chama notifyPageReady() ao montar — a transição espera por isso */
  const notifyPageReady = useCallback(() => {
    readyResolver.current?.();
    readyResolver.current = null;
  }, []);

  const switchPage = useCallback(async (next) => {
    if (next === pageRef.current) return;
    const ready = new Promise((res) => {
      readyResolver.current = res;
      setTimeout(res, 4000); // fallback: nunca trava a tela
    });
    triggerReturn(); // reseta a logo voadora do About
    pageRef.current = next;
    flushSync(() => setPage(next));
    await ready;
  }, [triggerReturn]);

  const scrollToTarget = useCallback(async (hash) => {
    const lenis = lenisRef.current;
    let el = null;
    if (hash) {
      // Seções lazy podem demorar alguns frames para existir no DOM
      const start = performance.now();
      while (!(el = document.querySelector(hash)) && performance.now() - start < 2500) {
        await new Promise(requestAnimationFrame);
      }
    }
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(el || 0, { immediate: true, force: true });
    } else {
      // sem Lenis: desliga o smooth do CSS só neste salto ('instant' quebra Safari antigo)
      const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, top);
      html.style.scrollBehavior = prev;
    }
    ScrollTrigger.refresh();
  }, [lenisRef]);

  /* ══════════════════════════════════════════════
     IDA — mergulho na logo
     ══════════════════════════════════════════════ */
  const goToHistory = useCallback(async (sourceEl) => {
    if (busy.current || page === 'historia') return;
    busy.current = true;
    const loading = prefetch?.();

    if (prefersReduced() || !sourceEl) {
      await loading;
      window.history.pushState({}, '', ROUTES.historia);
      await switchPage('historia');
      await scrollToTarget(null);
      busy.current = false;
      return;
    }

    const r  = sourceEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const size = Math.max(r.width, 120);
    const R  = coverRadius(cx, cy);

    const { root, portal, waves, logo } = createOverlay(cx, cy);
    logo.style.width = `${size}px`;
    sourceEl.style.visibility = 'hidden';
    lenisRef.current?.stop();

    const tl = gsap.timeline();
    // 1. Logo gira e acende
    tl.to(logo, {
      rotate: 360, scale: 1.25, duration: 0.75, ease: 'back.out(1.6)',
      filter: isSafari
        ? 'drop-shadow(0 0 28px rgba(124,63,255,0.9))'
        : 'drop-shadow(0 0 24px rgba(124,63,255,1)) drop-shadow(0 0 60px rgba(79,124,255,0.8)) brightness(1.2)',
    });
    // 2. Ondas de choque
    tl.fromTo(waves,
      { scale: 0, opacity: 0.9 },
      { scale: (R * 2) / 10, opacity: 0, duration: 1.1, ease: 'power2.out', stagger: 0.12 },
      0.35);
    // 3. Portal se expande a partir da logo, logo "engole" a câmera
    tl.to(portal, {
      clipPath: `circle(${R}px at ${cx}px ${cy}px)`, duration: 0.85, ease: 'power3.inOut',
    }, 0.55);
    tl.to(logo, { scale: 9, opacity: 0, duration: 0.85, ease: 'power3.in' }, 0.6);

    await Promise.all([tl.then(), loading]);

    window.history.pushState({}, '', ROUTES.historia);
    await switchPage('historia');
    await scrollToTarget(null);
    lenisRef.current?.start();

    // 4. Véu some e a página da história surge por baixo
    await gsap.to(root, { opacity: 0, duration: 0.7, ease: 'power2.out' }).then();
    root.remove();
    busy.current = false;
  }, [page, prefetch, switchPage, scrollToTarget, lenisRef]);

  /* ══════════════════════════════════════════════
     VOLTA — portal fecha sobre a home
     ══════════════════════════════════════════════ */
  const goHome = useCallback(async (hash = '#sobre') => {
    if (busy.current) return;
    if (page === 'home') { scrollToTarget(hash); return; }
    busy.current = true;

    if (prefersReduced()) {
      window.history.pushState({}, '', ROUTES.home);
      await switchPage('home');
      await scrollToTarget(hash);
      busy.current = false;
      return;
    }

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const R  = coverRadius(cx, cy);
    const { root, portal, logo } = createOverlay(cx, cy);
    logo.style.width = '150px';
    gsap.set(logo, { scale: 0.4, opacity: 0 });
    lenisRef.current?.stop();

    const tl = gsap.timeline();
    tl.to(portal, { clipPath: `circle(${R}px at ${cx}px ${cy}px)`, duration: 0.7, ease: 'power3.inOut' });
    tl.to(logo, {
      scale: 1, opacity: 1, rotate: -360, duration: 0.7, ease: 'power3.out',
      filter: 'drop-shadow(0 0 30px rgba(124,63,255,0.9))',
    }, 0.25);
    await tl.then();

    window.history.pushState({}, '', ROUTES.home);
    await switchPage('home');
    await scrollToTarget(hash);
    lenisRef.current?.start();

    const out = gsap.timeline();
    out.to(logo, { scale: 0.2, opacity: 0, rotate: -540, duration: 0.5, ease: 'power2.in' });
    out.to(portal, { clipPath: `circle(0px at ${cx}px ${cy}px)`, duration: 0.8, ease: 'power3.inOut' }, 0.2);
    await out.then();
    root.remove();
    busy.current = false;
  }, [page, switchPage, scrollToTarget, lenisRef]);

  /* Botões voltar/avançar do navegador — troca direta, sem animação */
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    const onPop = async () => {
      const next = pageFromPath(window.location.pathname);
      if (busy.current || next === pageRef.current) return; // popstate de âncora (#sobre etc.)
      await switchPage(next);
      scrollToTarget(next === 'home' ? '#sobre' : null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [switchPage, scrollToTarget]);

  return (
    <Ctx.Provider value={{ page, goToHistory, goHome, notifyPageReady }}>
      {children}
    </Ctx.Provider>
  );
}
