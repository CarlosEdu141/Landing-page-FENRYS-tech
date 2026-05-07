import { useInView } from '../hooks/useInView';
import styles from './Testimonials.module.css';

export default function Testimonials() {
  const [ref, inView] = useInView();

  return (
    <section id="depoimentos" className={`section-padding ${styles.section}`}>
      <div className="container">
        <div className={`${styles.header} ${inView ? styles.visible : ''}`} ref={ref}>
          <div className="section-tag">Depoimentos</div>
          <h2 className="section-title">O que nossos clientes dizem</h2>
        </div>

        <div className={`${styles.invite} ${inView ? styles.visible : ''}`} ref={ref}>
          <img
            src={`${import.meta.env.BASE_URL}FenrysIcon.png`}
            alt=""
            aria-hidden="true"
            className={styles.bgLogo}
          />
          <div className={styles.inviteQuote}>"</div>
          <p className={styles.inviteText}>
            Seja você o autor da nossa história.
          </p>
          <p className={styles.inviteSubtext}>
            Trabalhou com a Fenrys Tech? Adoraríamos ouvir sua experiência.
            Entre em contato pelo nosso atendimento e compartilhe seu depoimento.
          </p>
          <a href="#contato" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
            Compartilhar Experiência →
          </a>
        </div>
      </div>
    </section>
  );
}