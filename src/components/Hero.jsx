import { useEffect, useState } from 'react';
import { stats } from '../data/siteData';
import styles from './Hero.module.css';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section id="hero" className={styles.hero}>
      {/* Background orbs */}
      <div className={styles.orb1}></div>
      <div className={styles.orb2}></div>

      {/* Right image */}
      <div className={styles.heroRight}>
        <img src="/Corpo.png" alt="" className={styles.heroBg} />
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
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}