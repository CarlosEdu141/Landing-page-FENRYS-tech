import emailjs from '@emailjs/browser';
import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import styles from './Contact.module.css';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const projectTypes = [
  'Sistema Web', 'App Mobile', 'E-commerce',
  'Integração / API', 'Inteligência Artificial', 'Automação', 'Outro',
];

const channels = [
  { icon: '📧', label: 'E-mail', value: 'fenrystech@gmail.com', href: 'mailto:fenrystech@gmail.com' },
  { icon: '📸', label: 'Instagram', value: '@fenrys_tech', href: 'https://www.instagram.com/fenrys_tech/' },
  { icon: '📍', label: 'Localização', value: 'Goiânia, GO — Brasil', href: '#' },
];

export default function Contact() {
  const [ref, inView] = useInView();
  const [form, setForm] = useState({ name: '', email: '', company: '', type: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const emailInvalid = emailTouched && form.email.trim() !== '' && !isValidEmail(form.email);

  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    isValidEmail(form.email) &&
    form.company.trim() &&
    form.type &&
    form.message.trim();

  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true);
    setSendError(false);
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          contact_name:    form.name,
          contact_email:   form.email,
          contact_company: form.company || 'Não informado',
          contact_type:    form.type    || 'Não informado',
          contact_message: form.message,
        },
        PUBLIC_KEY,
      );
      setSent(true);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
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
                    <label>Seu nome *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="João Silva" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>E-mail *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="joao@empresa.com"
                      className={emailInvalid ? styles.inputError : ''}
                      required
                    />
                    {emailInvalid && (
                      <span className={styles.fieldError}>Digite um e-mail válido</span>
                    )}
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Empresa *</label>
                    <input name="company" value={form.company} onChange={handleChange} placeholder="Nome da empresa" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Tipo de projeto *</label>
                    <select name="type" value={form.type} onChange={handleChange} required>
                      <option value="">Selecione...</option>
                      {projectTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Conte sobre seu projeto *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Descreva brevemente o que precisa e qual problema quer resolver..."
                    required
                  />
                </div>
                {sendError && (
                  <p className={styles.errorMsg}>
                    Erro ao enviar. Tente novamente ou fale diretamente pelo e-mail ou Instagram.
                  </p>
                )}
                <button type="submit" className={styles.submit} disabled={!canSubmit || sending}>
                  {sending ? 'Enviando...' : 'Enviar Mensagem →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}