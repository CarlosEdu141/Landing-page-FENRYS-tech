import { useEffect, useRef } from 'react';
import styles from './ScrollProgress.module.css';

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    // Escreve direto no DOM (sem re-render do React) e usa scaleX,
    // que roda no compositor — width forçava layout a cada scroll.
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      const p = total > 0 ? el.scrollTop / total : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div ref={barRef} className={styles.bar} />;
}
