import { useEffect, useRef } from 'react';
import { techs } from '../data/siteData';
import styles from './Ticker.module.css';

/*
 * Duas fitas cruzadas, como fita de isolamento num lançamento.
 * Andam sozinhas e aceleram (ou invertem) com a velocidade do scroll.
 */
function Tape({ dir, variant, speedRef }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let x = 0, last = performance.now(), raf, visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(track);

    const loop = (now) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (visible) {
        const { v, sign } = speedRef.current; // v: 0..1 intensidade; sign: última direção do scroll
        x += dir * sign * (1 + v * 5) * dt * 0.004;
        x = ((x % 50) + 50) % 50; // conteúdo duplicado: dá a volta na metade
        track.style.transform = `translate3d(-${x}%, 0, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [dir, speedRef]);

  const row = techs.map((t) => (
    <span key={t} className={styles.item}>
      {t}<span className={styles.star} aria-hidden="true">✦</span>
    </span>
  ));

  return (
    <div className={`${styles.tape} ${styles[variant]}`}>
      <div ref={trackRef} className={styles.track}>{row}{row}</div>
    </div>
  );
}

export default function Ticker() {
  const speedRef = useRef({ v: 0, sign: 1 });

  // velocidade do scroll suavizada, compartilhada pelas duas fitas
  useEffect(() => {
    let lastY = window.scrollY, lastT = performance.now(), raf;
    const loop = (now) => {
      const y = window.scrollY;
      const dt = Math.max(1, now - lastT);
      const v = Math.max(-1, Math.min(1, (y - lastY) / dt / 3)); // px/ms normalizado
      const s = speedRef.current;
      if (v !== 0) s.sign = v < 0 ? -1 : 1;      // inverte junto com o scroll
      s.v += (Math.abs(v) - s.v) * 0.1;          // acelera e desacelera suave
      lastY = y; lastT = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={styles.ticker} aria-hidden="true">
      <Tape dir={-1} variant="outline" speedRef={speedRef} />
      <Tape dir={1} variant="solid" speedRef={speedRef} />
    </div>
  );
}
