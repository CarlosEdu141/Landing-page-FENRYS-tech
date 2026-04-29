import { useInView } from '../hooks/useInView';
import { testimonials } from '../data/siteData';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const [ref, inView] = useInView();

  return (
    <section id="depoimentos" className={`section-padding ${styles.section}`}>
      <div className="container">
        <div className={`${styles.header} ${inView ? styles.visible : ''}`} ref={ref}>
          <div className="section-tag">Depoimentos</div>
          <h2 className="section-title">O que nossos clientes dizem</h2>
          <p className="section-subtitle">Resultados reais de quem já confiou na Fenrys Tech para crescer.</p>
        </div>

        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`${styles.card} ${inView ? styles.cardVisible : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={styles.quote}>"</div>
              <div className={styles.stars}>★★★★★</div>
              <p className={styles.text}>{t.text}</p>
              <div className={styles.client}>
                <div className={styles.avatar}>{t.initials}</div>
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.role}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}