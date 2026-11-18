import { useEffect, useState } from 'react';
import { stats } from '../data/siteData';
import styles from './Hero.module.css';

const NUM_RE = /^(\d+)(.*)/;

function StatCounter({ num, active }) {
  // Começa já no valor final. O "0" só aparece quando a contagem de fato
  // está rodando, então se a animação não acontecer o número certo fica na tela.
  const [val, setVal] = useState(num);

  // Sem trava "já rodou": se o efeito for refeito (hot reload, StrictMode),
  // a contagem recomeça em vez de ficar parada no 0.
  useEffect(() => {
    const m = num.match(NUM_RE);
    if (!active || !m || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = +m[1], suffix = m[2];
    const t0 = performance.now(), dur = 1600;
    let raf;
    const tick = (t) => {
      const p = Math.min(Math.max((t - t0) / dur, 0), 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(p === 1 ? num : Math.round(target * ease) + suffix);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Garantia: se o navegador não rodar os frames (aba em segundo plano,
    // economia de energia, pré-visualização), mostra o número final mesmo assim.
    const done = setTimeout(() => { cancelAnimationFrame(raf); setVal(num); }, dur + 150);
    return () => { cancelAnimationFrame(raf); clearTimeout(done); };
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
      <div className={styles.orb1}></div>
      <div className={styles.orb2}></div>

      <div className={styles.heroRight}>
        <img src={`${import.meta.env.BASE_URL}Corpo.webp`} alt="" className={styles.heroBg} fetchPriority="high" />
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

        <div className={styles.lower}>
        <div className={styles.lead}>
        <p className={styles.desc}>
          Desenvolvemos soluções digitais sob medida para empresas, startups e comércios
          que querem crescer com inteligência e velocidade.
        </p>

        <div className={styles.buttons}>
          <a href="#projetos" className="btn-primary">Ver Nossos Projetos →</a>
          <a href="#contato" className="btn-secondary">Fale Conosco</a>
        </div>
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
      </div>
    </section>
  );
}
