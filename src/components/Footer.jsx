import styles from './Footer.module.css';

const links = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contato', href: '#contato' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img src="/FenrysIcon.png" alt="Fenrys Tech" className={styles.logo} />
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