import { useEffect, useRef, useState } from 'react';
import { stats } from '../data/siteData';
import HeroCanvas from './HeroCanvas';
import styles from './Hero.module.css';

function StatCounter({ num, active }) {
  const match = useRef(num.match(/^(\d+)(.*)/));
  const [val, setVal] = useState(() => {
    const m = match.current;
    return m ? '0' + m[2] : num;
  });
  const ran = useRef(false);

  useEffect(() => {
    const m = match.current;
    if (!active || ran.current || !m) return;
    ran.current = true;
    const target = +m[1], suffix = m[2];
    const t0 = performance.now(), dur = 1600;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(p === 1 ? num : Math.round(target * ease) + suffix);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, num]);

  return <>{val}</>;
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="hero" className={styles.hero}>
      <HeroCanvas />

      <div className={styles.orb1}></div>
      <div className={styles.orb2}></div>

      <div className={styles.heroRight}>
        <img src={`${import.meta.env.BASE_URL}Corpo.png`} alt="" className={styles.heroBg} />
        <div className={styles.heroRightOverlay}></div>
      </div>

      <div className={`container ${styles.content} ${loaded ? styles.loaded : ''}`}>
        <div className={styles.badge}>
          <span className={styles.dot}></span>
          Software House — Goiânia, GO
        </div>

        <h1 className={styles.h1}>
          Transformamos Ideias
          <span className={`gradient-text ${styles.accentLine}`}>em Tecnologia Real</span>
        </h1>

        <p className={styles.desc}>
          Desenvolvemos soluções digitais sob medida para empresas, startups e comércios
          que querem crescer com inteligência e velocidade.
        </p>

        <div className={styles.buttons}>
          <a href="#projetos" className="btn-primary">Ver Nossos Projetos →</a>
          <a href="#contato" className="btn-secondary">Fale Conosco</a>
        </div>

        <div className={styles.statsRow}>
          {stats.map(s => (
            <div key={s.label} className={styles.statItem}>
              <div className={styles.statNum}>
                <StatCounter num={s.num} active={loaded} />
              </div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
