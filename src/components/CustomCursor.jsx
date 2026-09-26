import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let rafId;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('mousemove', onMove);

    const onOver = (e) => {
      if (e.target.closest('a, button, [data-hover]')) {
        ring.classList.add(styles.hovering);
      }
    };
    const onOut = (e) => {
      if (e.target.closest('a, button, [data-hover]')) {
        ring.classList.remove(styles.hovering);
      }
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
    </>
  );
}
