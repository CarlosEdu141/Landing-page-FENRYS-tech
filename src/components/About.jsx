import { useEffect } from 'react';
import { useInView } from '../hooks/useInView';
import { useLogoAnim } from '../context/LogoAnim';
import styles from './About.module.css';

const features = [
  'Desenvolvimento Ágil', 'Código de Qualidade', 'Suporte Contínuo',
  'Entrega Rápida', 'IA Integrada', 'Foco no Resultado',
];

export default function About() {
  // useInView original: controla o fade-in do CSS (rings, texto, chips)
  const [gridRef, inView] = useInView();

  // contexto da animação voadora
  const { aboutLogoEl, aboutRevealed, triggerFly, triggerReturn } = useLogoAnim();

  // observer SEPARADO no logoBg — só dispara quando a logo está centrada na tela
  useEffect(() => {
    const el = aboutLogoEl.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) triggerFly();
        else                      triggerReturn();
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerFly, triggerReturn]);

  return (
    <section id="sobre" className={`section-padding ${styles.about}`}>
      <div className="container">
        <div className={styles.grid} ref={gridRef}>

          <div className={`${styles.visual} ${inView ? styles.visible : ''}`}>
            <div className={styles.logoBg} ref={aboutLogoEl}>
              <div className={`${styles.ring} ${styles.ring1}`}></div>
              <div className={`${styles.ring} ${styles.ring2}`}></div>
              <div className={styles.glow}></div>
              <img
                src="/Fenrys_transparente.png"
                alt="Fenrys Tech"
                className={`${styles.logoImg} ${aboutRevealed ? styles.logoVisible : ''}`}
              />
            </div>
          </div>

          <div className={`${styles.text} ${inView ? styles.visible : ''}`}>
            <div className="section-tag">Quem Somos</div>
            <h2 className="section-title">
              Uma equipe obcecada<br />por resolver problemas
              <span className="gradient-text"> com tecnologia</span>
            </h2>
            <p className={styles.p1}>
              A Fenrys Tech é uma software house especializada em criar soluções digitais que realmente funcionam.
              Do desenvolvimento de aplicações web e mobile à automação de processos — entregamos tecnologia que gera resultado.
            </p>
            <p className={styles.p2}>
              Atendemos desde startups que precisam sair do papel até empresas estabelecidas que buscam modernizar
              seus sistemas. Nossa abordagem é direta: entendemos o problema, desenhamos a solução e executamos com qualidade.
            </p>
            <div className={styles.chips}>
              {features.map(f => (
                <div key={f} className={styles.chip}>
                  <span className={styles.chipDot}></span>
                  {f}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
