import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePageTransition } from '../context/PageTransition';
import { historia } from '../data/siteData';
import styles from './Historia.module.css';

gsap.registerPlugin(ScrollTrigger);

const { origem, marcos, pilares } = historia;

export default function Historia() {
  const { goHome, notifyPageReady } = usePageTransition();
  const rootRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    notifyPageReady();
    const prevTitle = document.title;
    document.title = 'Nossa História | FENRYS Tech';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => { document.title = prevTitle; };
    }

    const ctx = gsap.context(() => {
      /* ── Intro: a logo "nasce" do centro, como continuação do mergulho ── */
      const intro = gsap.timeline({ delay: 0.15 });
      intro
        .from(`.${styles.heroLogo}`, {
          scale: 2.4, opacity: 0, rotate: -120, filter: 'blur(12px)',
          duration: 1.2, ease: 'expo.out',
        })
        .from(`.${styles.heroRing}`, {
          scale: 0.3, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12,
        }, 0.2)
        .from(`.${styles.heroTag}`, { y: 20, opacity: 0, duration: 0.6 }, 0.55)
        .from(`.${styles.word}`, {
          yPercent: 110, opacity: 0, duration: 0.8, ease: 'power4.out', stagger: 0.06,
        }, 0.6)
        .from(`.${styles.heroSub}, .${styles.scrollHint}, .${styles.topbar}`, {
          y: 16, opacity: 0, duration: 0.7, stagger: 0.1,
        }, 0.95);

      /* ── Parallax do hero ao rolar ── */
      gsap.to(`.${styles.heroVisual}`, {
        yPercent: 35, scale: 0.8, opacity: 0.15, ease: 'none',
        scrollTrigger: { trigger: `.${styles.hero}`, start: 'top top', end: 'bottom top', scrub: true },
      });

      /* ── Reveals genéricos ── */
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });

      /* ── Linha do tempo: a linha se desenha conforme o scroll ── */
      gsap.fromTo(`.${styles.lineFill}`, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: {
          trigger: `.${styles.timeline}`, start: 'top 60%', end: 'bottom 60%', scrub: 0.6,
        },
      });

      gsap.utils.toArray(`.${styles.milestone}`).forEach((el, i) => {
        const fromLeft = i % 2 === 0;
        gsap.from(el.querySelector(`.${styles.card}`), {
          x: fromLeft ? -60 : 60, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        });
        ScrollTrigger.create({
          trigger: el, start: 'top 60%',
          toggleClass: { targets: el, className: styles.active },
        });
      });

      /* ── Pilares ── */
      gsap.from(`.${styles.pillar}`, {
        y: 60, opacity: 0, rotateX: -25, duration: 0.9, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: `.${styles.pillars}`, start: 'top 80%' },
      });
    }, rootRef);

    return () => {
      ctx.revert();
      document.title = prevTitle;
    };
  }, [notifyPageReady]);

  const titleWords = 'Nossa História'.split(' ');

  return (
    <main ref={rootRef} className={styles.page}>
      {/* ── Barra superior ── */}
      <header className={`${styles.topbar} ${scrolled ? styles.topbarScrolled : ''}`}>
        <button className={styles.back} onClick={() => goHome('#sobre')}>
          <span className={styles.backArrow}>←</span> Voltar
        </button>
        <button className={styles.brand} onClick={() => goHome(null)} aria-label="Ir para o início">
          <img src={`${import.meta.env.BASE_URL}FenrysIcon.webp`} alt="" />
          <span>FENRYS<em>TECH</em></span>
        </button>
      </header>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroVisual}>
          <div className={`${styles.heroRing} ${styles.ring1}`} />
          <div className={`${styles.heroRing} ${styles.ring2}`} />
          <div className={`${styles.heroRing} ${styles.ring3}`} />
          <div className={styles.heroGlow} />
          <img
            src={`${import.meta.env.BASE_URL}Fenrys_transparente.png`}
            alt="Fenrys Tech"
            className={styles.heroLogo}
          />
        </div>

        <div className={styles.heroText}>
          <div className={`section-tag ${styles.heroTag}`}>Desde o primeiro commit</div>
          <h1 className={styles.heroTitle}>
            {titleWords.map((w, i) => (
              <span key={i} className={styles.wordMask}>
                <span className={`${styles.word} ${i === 1 ? 'gradient-text' : ''}`}>{w}</span>
              </span>
            ))}
          </h1>
          <p className={styles.heroSub}>
            Como uma dupla de desenvolvedores virou uma alcateia
            dedicada a transformar ideias em tecnologia.
          </p>
        </div>

        <div className={styles.scrollHint}>
          <span>Role para conhecer</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* ── Capítulo 1: Origem ── */}
      <section className={`section-padding ${styles.origin}`}>
        <div className="container">
          <div className={styles.chapter} data-reveal>Capítulo 01</div>
          <div className={styles.originGrid}>
            <h2 className="section-title" data-reveal>{origem.titulo}</h2>
            <div>
              {origem.blocos.map((b) => (
                <div key={b.titulo} className={styles.block} data-reveal>
                  <h3 className={styles.blockTitle}>{b.titulo}</h3>
                  <p className={styles.paragraph}>{b.texto}</p>
                </div>
              ))}
            </div>
          </div>
          <blockquote className={styles.quote} data-reveal>
            <p>“{origem.citacao}”</p>
            <cite>— {origem.autor}</cite>
          </blockquote>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── Capítulo 2: Linha do tempo ── */}
      <section className="section-padding">
        <div className="container">
          <div className={styles.chapter} data-reveal>Capítulo 02</div>
          <h2 className={`section-title ${styles.center}`} data-reveal>
            A jornada <span className="gradient-text">até aqui</span>
          </h2>

          <div className={styles.timeline}>
            <div className={styles.line}><div className={styles.lineFill} /></div>
            {marcos.map((m, i) => (
              <div key={i} className={`${styles.milestone} ${i % 2 ? styles.right : styles.left}`}>
                <div className={styles.dot} />
                <div className={styles.card}>
                  <span className={styles.year}>{m.ano}</span>
                  <h3>{m.titulo}</h3>
                  <p>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── Capítulo 3: Pilares ── */}
      <section className="section-padding">
        <div className="container">
          <div className={styles.chapter} data-reveal>Capítulo 03</div>
          <h2 className={`section-title ${styles.center}`} data-reveal>
            O que nos <span className="gradient-text">move</span>
          </h2>
          <div className={styles.pillars}>
            {pilares.map((p) => (
              <div key={p.titulo} className={styles.pillar}>
                <div className={styles.pillarIcon}>{p.icone}</div>
                <h3>{p.titulo}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fechamento ── */}
      <section className={`section-padding ${styles.closing}`}>
        <div className="container">
          <h2 className="section-title" data-reveal>
            O próximo capítulo pode ser<br />
            <span className="gradient-text">o seu projeto</span>
          </h2>
          <div className={styles.actions} data-reveal>
            <button className="btn-primary" onClick={() => goHome('#contato')}>Falar Conosco</button>
            <button className="btn-secondary" onClick={() => goHome('#sobre')}>Voltar ao site</button>
          </div>
        </div>
      </section>
    </main>
  );
}
