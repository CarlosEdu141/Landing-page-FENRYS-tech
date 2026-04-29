import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import styles from './Contact.module.css';

const projectTypes = [
  'Sistema Web', 'App Mobile', 'E-commerce',
  'Integração / API', 'Inteligência Artificial', 'Automação', 'Outro',
];

const channels = [
  { icon: '📧', label: 'E-mail', value: 'contato@fenrystech.com.br', href: 'mailto:contato@fenrystech.com.br' },
  { icon: '💬', label: 'WhatsApp', value: '(62) 9 9999-9999', href: 'https://wa.me/5562999999999' },
  { icon: '📍', label: 'Localização', value: 'Goiânia, GO — Brasil', href: '#' },
];

export default function Contact() {
  const [ref, inView] = useInView();
  const [form, setForm] = useState({ name: '', email: '', company: '', type: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contato" className={`section-padding ${styles.section}`}>
      <div className={styles.orb}></div>
      <div className="container">
        <div className={styles.grid} ref={ref}>
          <div className={`${styles.left} ${inView ? styles.visible : ''}`}>
            <div className="section-tag">Contato</div>
            <h2 className="section-title">
              Vamos construir<br />
              <span className="gradient-text">algo juntos?</span>
            </h2>
            <p className={styles.desc}>
              Seja um projeto do zero, uma melhoria no que você já tem ou uma ideia que está
              só na sua cabeça — vamos conversar. A primeira reunião é gratuita e sem compromisso.
            </p>

            <div className={styles.channels}>
              {channels.map(c => (
                <a key={c.label} href={c.href} className={styles.channel}>
                  <div className={styles.channelIcon}>{c.icon}</div>
                  <div>
                    <div className={styles.channelLabel}>{c.label}</div>
                    <div className={styles.channelValue}>{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className={`${styles.formWrap} ${inView ? styles.visibleDelay : ''}`}>
            <div className="section-tag" style={{ marginBottom: '1.5rem' }}>Envie uma mensagem</div>

            {sent ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>✓</div>
                <h3>Mensagem enviada!</h3>
                <p>Em breve nossa equipe entrará em contato.</p>
                <button className="btn-primary" onClick={() => setSent(false)} style={{ marginTop: '1.5rem' }}>
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Seu nome</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="João Silva" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>E-mail</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="joao@empresa.com" required />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Empresa</label>
                    <input name="company" value={form.company} onChange={handleChange} placeholder="Nome da empresa" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Tipo de projeto</label>
                    <select name="type" value={form.type} onChange={handleChange}>
                      <option value="">Selecione...</option>
                      {projectTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Conte sobre seu projeto</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Descreva brevemente o que precisa e qual problema quer resolver..."
                    required
                  />
                </div>
                <button type="submit" className={styles.submit}>
                  Enviar Mensagem →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}