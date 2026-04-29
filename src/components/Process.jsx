import { useInView } from '../hooks/useInView';
import { processSteps } from '../data/siteData';
import styles from './Process.module.css';

export default function Process() {
  const [ref, inView] = useInView();

  return (
    <section id="processo" className={`section-padding ${styles.section}`}>
      <div className="container">
        <div className={`${styles.header} ${inView ? styles.visible : ''}`} ref={ref}>
          <div className="section-tag" style={{ justifyContent: 'center' }}>Como Trabalhamos</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Do Briefing ao Deploy</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto' }}>
            Um processo claro e transparente para que você saiba o que esperar em cada etapa.
          </p>
        </div>

        <div className={styles.steps}>
          <div className={styles.line}></div>
          {processSteps.map((s, i) => (
            <div
              key={s.num}
              className={`${styles.step} ${inView ? styles.stepVisible : ''}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className={styles.numWrap}>
                <div className={styles.num}>{s.num}</div>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}