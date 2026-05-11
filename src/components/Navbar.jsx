import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { useLogoAnim } from '../context/LogoAnim';
import { useTheme } from '../hooks/useTheme';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.5"/>
      <line x1="12" y1="2" x2="12" y2="4.5"/>
      <line x1="12" y1="19.5" x2="12" y2="22"/>
      <line x1="4.22" y1="4.22" x2="5.98" y2="5.98"/>
      <line x1="18.02" y1="18.02" x2="19.78" y2="19.78"/>
      <line x1="2" y1="12" x2="4.5" y2="12"/>
      <line x1="19.5" y1="12" x2="22" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.98" y2="18.02"/>
      <line x1="18.02" y1="5.98" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

const links = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Clientes', href: '#depoimentos' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { navIconEl } = useLogoAnim();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 220) setActive(s.id);
      });
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <a href="#" className={styles.logo}>
        <img
          ref={navIconEl}
          src={`${import.meta.env.BASE_URL}FenrysIcon.png`}
          alt="Fenrys Tech"
          className={styles.logoImg}
        />
        <div className={styles.wordmark}>
          FENRYS
          <span>TECH</span>
        </div>
      </a>

      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        <li className={styles.menuHeader}>
          <button
            className={styles.closeBtn}
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </li>
        {links.map(l => (
          <li key={l.href}>
            <a
              href={l.href}
              className={active === l.href.slice(1) ? styles.activeLink : ''}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <a href="#contato" className={styles.cta} onClick={() => setMenuOpen(false)}>
            Falar Conosco
          </a>
        </li>
      </ul>

      <div className={styles.navActions}>
        <button className={styles.themeToggle} onClick={toggle} aria-label="Toggle theme">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span className={menuOpen ? styles.hOpen : ''}></span>
          <span className={menuOpen ? styles.hOpen : ''}></span>
          <span className={menuOpen ? styles.hOpen : ''}></span>
        </button>
      </div>
    </nav>
  );
}