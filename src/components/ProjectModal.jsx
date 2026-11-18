import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { usePageTransition } from '../context/PageTransition';
import styles from './ProjectModal.module.css';

const BASE = import.meta.env.BASE_URL;
const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Quadros provisórios enquanto o projeto não tem prints na galeria
const PLACEHOLDERS = ['Tela inicial', 'Painel', 'Detalhes'];

const Chevron = ({ dir }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

/**
 * Popup de detalhes do projeto.
 * Abre "crescendo" a partir do card clicado (originEl) e fecha voltando para ele.
 */
export default function ProjectModal({ project, originEl, onClose }) {
  const { setScrollLocked } = usePageTransition() ?? {};
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const closing = useRef(false);
  const [slide, setSlide] = useState(0);

  const photos = project.gallery?.length ? project.gallery : null;
  const total = photos ? photos.length : PLACEHOLDERS.length;
  const titleId = `pm-title-${project.slug}`;

  const go = useCallback((d) => setSlide((s) => (s + d + total) % total), [total]);

  /* Transform que encaixa o painel em cima do card de origem (efeito FLIP) */
  const fromCard = () => {
    const panel = panelRef.current;
    if (!originEl || !panel) return { y: 24, scale: 0.96 };
    const a = originEl.getBoundingClientRect();
    const b = panel.getBoundingClientRect();
    if (a.bottom < 0 || a.top > window.innerHeight) return { y: 24, scale: 0.96 };
    return {
      x: a.left + a.width / 2 - (b.left + b.width / 2),
      y: a.top + a.height / 2 - (b.top + b.height / 2),
      scaleX: a.width / b.width,
      scaleY: a.height / b.height,
    };
  };

  /* Abertura */
  useLayoutEffect(() => {
    setScrollLocked?.(true);
    const prevFocus = document.activeElement;
    closeRef.current?.focus({ preventScroll: true });

    const ctx = gsap.context(() => {
      if (prefersReduced()) return;
      gsap.from(`.${styles.backdrop}`, { opacity: 0, duration: 0.3, ease: 'power1.out' });
      gsap.from(panelRef.current, {
        ...fromCard(), opacity: 0.4, duration: 0.55, ease: 'expo.out',
        transformOrigin: '50% 50%', clearProps: 'transform,opacity',
      });
      gsap.from(`[data-pm="in"]`, {
        y: 14, opacity: 0, duration: 0.45, ease: 'power2.out',
        stagger: 0.05, delay: 0.18, clearProps: 'transform,opacity',
      });
    }, rootRef);

    return () => {
      ctx.revert();
      setScrollLocked?.(false);
      if (prevFocus && document.contains(prevFocus)) prevFocus.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- roda só ao abrir
  }, []);

  /* Fechamento: anima de volta para o card e só então desmonta */
  const close = useCallback((after) => {
    if (closing.current) return;
    closing.current = true;
    // `after` roda depois que o popup sumiu e o scroll foi destravado
    const done = () => {
      onClose();
      if (typeof after === 'function') setTimeout(after, 0);
    };
    if (prefersReduced()) { done(); return; }
    gsap.timeline({ onComplete: done })
      .to(`.${styles.backdrop}`, { opacity: 0, duration: 0.3, ease: 'power1.in' }, 0)
      .to(panelRef.current, { ...fromCard(), opacity: 0, duration: 0.35, ease: 'power3.in' }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fromCard lê refs na hora
  }, [onClose]);

  /* Teclado: Esc fecha, ← → trocam a foto, Tab fica preso dentro do popup */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'Tab') {
        const f = panelRef.current?.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
        if (!f?.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close, go]);

  return createPortal(
    <div ref={rootRef} className={styles.root} style={{ '--pc': project.color }}>
      <div className={styles.backdrop} onClick={close} />

      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-lenis-prevent
      >
        {/* Cabeçalho na cor do projeto */}
        <header className={styles.head} style={{ background: project.gradient }}>
          <img src={`${BASE}${project.logo}`} alt="" className={styles.logo} data-pm="in" />
          <div className={styles.headText} data-pm="in">
            <span className={styles.tag}>{project.tag}</span>
            <h3 id={titleId} className={styles.title}>{project.title}</h3>
            {project.status && <span className={styles.status}><i />{project.status}</span>}
          </div>
          <button ref={closeRef} type="button" className={styles.close} onClick={close} aria-label="Fechar detalhes do projeto">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>

        {/* Galeria */}
        <div className={styles.gallery} data-pm="in">
          <div className={styles.stage} aria-roledescription="carrossel" aria-label={`Imagens de ${project.title}`}>
            <div className={styles.track} style={{ transform: `translateX(-${slide * 100}%)` }}>
              {photos
                ? photos.map((p, i) => (
                    <figure key={p.src} className={`${styles.slide} ${p.mobile ? styles.mobile : ''}`} aria-hidden={i !== slide}>
                      {/* fundo: a própria imagem desfocada, para o print aparecer inteiro sem faixas vazias */}
                      <img src={`${BASE}${p.src}`} alt="" className={styles.slideBg} loading={i === 0 ? 'eager' : 'lazy'} />
                      <img src={`${BASE}${p.src}`} alt={p.alt ?? ''} className={styles.slideImg} loading={i === 0 ? 'eager' : 'lazy'} />
                    </figure>
                  ))
                : PLACEHOLDERS.map((label, i) => (
                    <figure key={label} className={`${styles.slide} ${styles.ph}`} aria-hidden={i !== slide}>
                      <div className={styles.phBar}><i /><i /><i /></div>
                      <img src={`${BASE}${project.logo}`} alt="" className={styles.phLogo} />
                      <figcaption>{label} · prints em breve</figcaption>
                    </figure>
                  ))}
            </div>

            {total > 1 && (
              <>
                <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => go(-1)} aria-label="Imagem anterior"><Chevron dir="left" /></button>
                <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label="Próxima imagem"><Chevron dir="right" /></button>
                <span className={styles.counter} aria-live="polite">{slide + 1} / {total}</span>
              </>
            )}
          </div>

          {total > 1 && (
            <div className={styles.thumbs}>
              {Array.from({ length: total }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.thumb} ${i === slide ? styles.thumbOn : ''}`}
                  onClick={() => setSlide(i)}
                  aria-label={`Ver imagem ${i + 1}`}
                  aria-current={i === slide}
                >
                  {photos
                    ? <img src={`${BASE}${photos[i].src}`} alt="" loading="lazy" />
                    : <span>{PLACEHOLDERS[i]}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className={styles.body}>
          <div className={styles.main}>
            <section data-pm="in">
              <h4 className={styles.label}>Sobre o projeto</h4>
              {(project.details ?? [project.desc]).map((p, i) => <p key={i} className={styles.text}>{p}</p>)}
            </section>

            {project.features?.length > 0 && (
              <section data-pm="in">
                <h4 className={styles.label}>O que entregamos</h4>
                <ul className={styles.features}>
                  {project.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </section>
            )}
          </div>

          <aside className={styles.side} data-pm="in">
            <div className={styles.meta}>
              <h4 className={styles.label}>Segmento</h4>
              <p className={styles.metaVal}>{project.tag}</p>
            </div>
            <div className={styles.meta}>
              <h4 className={styles.label}>Tecnologias</h4>
              <div className={styles.techs}>
                {project.techs.map((t) => <span key={t} className={styles.tech}>{t}</span>)}
              </div>
            </div>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.cta}>
                Acessar projeto <span aria-hidden="true">↗</span>
              </a>
            )}
            <a
              href="#contato"
              className={styles.ctaGhost}
              onClick={(e) => {
                e.preventDefault();
                close(() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' }));
              }}
            >
              Quero um projeto assim
            </a>
          </aside>
        </div>
      </div>
    </div>,
    document.body,
  );
}
