import { useInView } from '../hooks/useInView';
import { services } from '../data/siteData';
import styles from './Services.module.css';

export default function Services() {
  const [ref, inView] = useInView();

  return (
    <section id="servicos" className={`section-padding ${styles.section}`}>
      <div className="container">
        <div className={`${styles.header} ${inView ? styles.visible : ''}`} ref={ref}>
          <div className="section-tag">O Que Fazemos</div>
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
    >
      <div className={styles.icon}>{service.icon}</div>
      <h3>{service.title}</h3>
      <p>{service.desc}</p>
      <div className={styles.corner}></div>
    </div>
  );
}