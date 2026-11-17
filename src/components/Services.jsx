import { useInView } from '../hooks/useInView';
import { services } from '../data/siteData';
import Icon from './Icon';
import styles from './Services.module.css';

// trilhas só com ângulos de 45°/90°, terminando num pad (como no logo)
const TRACES = [
  [0, 110, 340, 110, 400, 170, 640, 170],
  [0, 660, 240, 660, 300, 600, 560, 600],
  [1200, 260, 920, 260, 860, 320, 760, 320],
  [1200, 720, 1000, 720, 950, 670, 820, 670],
  [1200, 470, 1080, 470, 1040, 430, 960, 430],
];

export default function Services() {
  const [ref, inView] = useInView();

  return (
    <section id="servicos" className={`section-padding tone-lift ${styles.section}`}>
      <svg className={styles.circuits} aria-hidden="true" viewBox="0 0 1200 800" preserveAspectRatio="none">
        {TRACES.map((d, i) => (
          <g key={i}>
            <polyline points={d.join(' ')} className={styles.trace} style={{ animationDuration: `${5 + i}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }} />
            <circle cx={d[d.length - 2]} cy={d[d.length - 1]} r="4.5" className={styles.tracePad} />
          </g>
        ))}
      </svg>
      <div className={`container ${styles.content}`}>
        <div className={`${styles.header} ${inView ? styles.visible : ''}`} ref={ref}>
          <div className="section-tag" data-n="02">O Que Fazemos</div>
          <h2 className="section-title">Nossos Serviços</h2>
          <p className="section-subtitle">
            Cobrimos todo o ciclo de desenvolvimento — do conceito ao produto em produção.
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((s, i) => (
            <ServiceCard key={s.title} service={s} delay={i * 80} visible={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, delay, visible }) {
  return (
    <div
      className={`${styles.card} ${visible ? styles.cardVisible : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
      data-icon-hover
    >
      <div className={styles.cardInner}>
        <div className={styles.icon}><Icon name={service.icon} size={28} /></div>
        <h3>{service.title}</h3>
        <p>{service.desc}</p>
        <div className={styles.corner}></div>
      </div>
    </div>
  );
}