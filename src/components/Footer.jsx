import { useRef } from 'react';
import styles from './Footer.module.css';

const links = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contato', href: '#contato' },
];

export default function Footer() {
  const giantRef = useRef(null);
  const onMove = (e) => {
    const el = giantRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.giantWrap} onPointerMove={onMove}>
        <div ref={giantRef} className={styles.giant} aria-hidden="true">FENRYS</div>
      </div>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img src={`${import.meta.env.BASE_URL}FenrysIcon.webp`} alt="Fenrys Tech" className={styles.logo} />
          <div className={styles.wordmark}>FENRYS TECH</div>
        </div>
        <div className={styles.copy}>© {new Date().getFullYear()} Fenrys Tech. Todos os direitos reservados.</div>
        <ul className={styles.links}>
          {links.map(l => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
        </ul>
      </div>
    </footer>
  );
}