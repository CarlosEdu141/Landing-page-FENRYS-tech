import { createContext, useCallback, useContext, useRef, useState } from 'react';

const Ctx = createContext(null);
export const useLogoAnim = () => useContext(Ctx);

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function LogoAnimProvider({ children }) {
  const navIconEl   = useRef(null); // <img> da navbar
  const aboutLogoEl = useRef(null); // div .logoBg do About
  const flyEl       = useRef(null); // elemento voador imperativo
  const rafId       = useRef(null); // ID do rAF cancelável
  const phaseRef    = useRef('idle');

  const [aboutRevealed, setAboutRevealed] = useState(false);

  const triggerFly = useCallback(() => {
    if (phaseRef.current !== 'idle') return;
    phaseRef.current = 'flying';

    const nav   = navIconEl.current;
    const about = aboutLogoEl.current;
    if (!nav || !about) { phaseRef.current = 'idle'; return; }

    const navRect = nav.getBoundingClientRect();
    const startX  = navRect.left + navRect.width  / 2;
    const startY  = navRect.top  + navRect.height / 2;
    const startW  = navRect.width;
    const startH  = navRect.height;
    const endW    = 190;
    const endH    = 190;

    const TRAVEL_MS = 900;
    const SPIN_MS   = 920;

    /* ── Cria elemento voador no DOM ── */
    const fly = document.createElement('img');
    fly.src = '/FenrysIcon.png';
    fly.alt = '';
    fly.setAttribute('aria-hidden', 'true');
    flyEl.current = fly;

    Object.assign(fly.style, {
      position:        'fixed',
      left:            `${startX}px`,
      top:             `${startY}px`,
      width:           `${startW}px`,
      height:          `${startH}px`,
      opacity:         '0',
      transform:       'translate(-50%, -50%) rotate(0deg) scale(1)',
      transformOrigin: 'center center',
      zIndex:          '9999',
      pointerEvents:   'none',
      filter:          'none',
      transition:      'none',
    });
    document.body.appendChild(fly);

    /* ── Próximo frame: esconde navbar + mostra voador ── */
    requestAnimationFrame(() => {
      /* Controle imperativo — sem style prop no JSX, React não sobrescreve */
      if (navIconEl.current) {
        navIconEl.current.style.transition = 'opacity 0.25s ease';
        navIconEl.current.style.opacity    = '0';
      }
      fly.style.opacity = '1';

      /* ══════════════════════════════════════════════
         FASE 1 — VÔO
         rAF relê getBoundingClientRect() a cada frame,
         então o voador acompanha o scroll em tempo real.
         ══════════════════════════════════════════════ */
      const travelStart = performance.now();

      function travel(now) {
        if (phaseRef.current !== 'flying') return;

        const p  = Math.min((now - travelStart) / TRAVEL_MS, 1);
        const e  = easeInOutCubic(p);
        const ar = about.getBoundingClientRect();
        const cx = ar.left + ar.width  / 2;
        const cy = ar.top  + ar.height / 2;

        fly.style.left   = `${startX + (cx - startX) * e}px`;
        fly.style.top    = `${startY + (cy - startY) * e}px`;
        fly.style.width  = `${startW + (endW - startW) * e}px`;
        fly.style.height = `${startH + (endH - startH) * e}px`;

        if (p < 1) {
          rafId.current = requestAnimationFrame(travel);
          return;
        }

        /* ══════════════════════════════════════════════
           FASE 2 — GIRO + BRILHO
           CSS transition só em transform/filter.
           left/top continuam sendo atualizados via rAF
           para seguir o scroll durante o giro.
           ══════════════════════════════════════════════ */
        fly.style.transition = 'none';
        fly.style.left       = `${cx}px`;
        fly.style.top        = `${cy}px`;
        fly.style.width      = '190px';
        fly.style.height     = '190px';

        requestAnimationFrame(() => {
          /* CSS transition APENAS em transform e filter */
          fly.style.transition = [
            'transform 0.85s cubic-bezier(0.34,1.56,0.64,1)',
            'filter    0.65s ease',
          ].join(', ');
          fly.style.transform = 'translate(-50%, -50%) rotate(360deg) scale(1.2)';
          fly.style.filter    = [
            'drop-shadow(0 0 24px rgba(78,90,146,1))',
            'drop-shadow(0 0 52px rgba(107,128,231,0.85))',
            'drop-shadow(0 0 100px rgba(78,90,146,0.5))',
            'brightness(1.18)',
          ].join(' ');

          /* rAF de tracking durante o giro (só left/top, sem transition neles) */
          const spinStart = performance.now();

          function trackSpin(now) {
            if (phaseRef.current !== 'flying') return;
            const r = about.getBoundingClientRect();
            fly.style.left = `${r.left + r.width  / 2}px`;
            fly.style.top  = `${r.top  + r.height / 2}px`;
            if (now - spinStart < SPIN_MS) {
              rafId.current = requestAnimationFrame(trackSpin);
            }
          }
          rafId.current = requestAnimationFrame(trackSpin);

          /* ══════════════════════════════════════════════
             FASE 3 — REVELA LOGO COM NOME
             ══════════════════════════════════════════════ */
          setTimeout(() => {
            if (phaseRef.current !== 'flying') return; // abortado por triggerReturn

            if (rafId.current) {
              cancelAnimationFrame(rafId.current);
              rafId.current = null;
            }

            fly.style.transition = 'opacity 0.5s ease, transform 0.5s ease, filter 0.4s ease';
            fly.style.opacity    = '0';
            fly.style.transform  = 'translate(-50%, -50%) rotate(360deg) scale(0.6)';
            fly.style.filter     = 'none';

            setAboutRevealed(true);
            phaseRef.current = 'revealed';

            setTimeout(() => { fly.remove(); flyEl.current = null; }, 520);
          }, SPIN_MS + 60);
        });
      }

      rafId.current = requestAnimationFrame(travel);
    });
  }, []);

  const triggerReturn = useCallback(() => {
    if (phaseRef.current === 'idle') return;
    phaseRef.current = 'idle';

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    const fly = flyEl.current;
    if (fly) {
      fly.style.transition = 'opacity 0.2s ease';
      fly.style.opacity    = '0';
      setTimeout(() => { fly.remove(); flyEl.current = null; }, 240);
    }

    setAboutRevealed(false);

    /* Restaura ícone da navbar */
    if (navIconEl.current) {
      navIconEl.current.style.transition = 'opacity 0.35s ease';
      navIconEl.current.style.opacity    = '1';
    }
  }, []);

  return (
    <Ctx.Provider value={{ navIconEl, aboutLogoEl, aboutRevealed, triggerFly, triggerReturn }}>
      {children}
    </Ctx.Provider>
  );
}
