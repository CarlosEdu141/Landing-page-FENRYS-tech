import emailjs from '@emailjs/browser';
import { useEffect, useRef, useState } from 'react';
import styles from './TestimonialModal.module.css';

const SPARK_ANGLES = [0, 40, 80, 130, 175, 222, 268, 315];
const RATING_LABELS = ['', 'Ruim', 'Regular', 'Bom', 'Ótimo', 'Excelente!'];

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function TestimonialModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', email: '', message: '' });
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [animating5, setAnimating5] = useState(false);
  const [star5Key, setStar5Key] = useState(0);
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    firstInputRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      clearTimeout(timerRef.current);
    };
  }, [onClose]);

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleStarClick(star) {
    setRating(star);
    clearTimeout(timerRef.current);
    if (star === 5) {
      setAnimating5(true);
      setStar5Key((k) => k + 1);
      timerRef.current = setTimeout(() => setAnimating5(false), 950);
    } else {
      setAnimating5(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setSendError(false);

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          user_name:  form.name,
          user_email: form.email || 'Não informado',
          user_role:  form.role  || 'Não informado',
          rating:     rating > 0 ? `${rating}/5 — ${RATING_LABELS[rating]}` : 'Não avaliado',
          message:    form.message,
        },
        PUBLIC_KEY,
      );
      setSubmitted(true);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  }

  const displayRating = hoverRating || rating;

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">✕</button>

        {submitted ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.successTitle}>Obrigado pelo depoimento!</h3>
            <p className={styles.successText}>Recebemos sua mensagem e logo entraremos em contato.</p>
            <button className="btn-primary" onClick={onClose} style={{ marginTop: '1.5rem' }}>Fechar</button>
          </div>
        ) : (
          <>
            <div className={styles.modalHeader}>
              <div className={styles.quoteIcon}>"</div>
              <h2 id="modal-title" className={styles.title}>Compartilhe sua experiência</h2>
              <p className={styles.subtitle}>Sua opinião é muito importante para nós.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.field}>
                <label htmlFor="tm-name" className={styles.label}>
                  Nome completo <span aria-hidden="true">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  id="tm-name"
                  name="name"
                  type="text"
                  className={styles.input}
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="tm-role" className={styles.label}>Cargo / Empresa</label>
                  <input
                    id="tm-role"
                    name="role"
                    type="text"
                    className={styles.input}
                    placeholder="CEO — Minha Empresa"
                    value={form.role}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="tm-email" className={styles.label}>E-mail</label>
                  <input
                    id="tm-email"
                    name="email"
                    type="email"
                    className={styles.input}
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Avaliação do serviço</label>
                <div className={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = displayRating >= star;
                    const is5th = star === 5;
                    const show5Anim = animating5 && is5th;

                    return (
                      <button
                        key={star}
                        type="button"
                        className={[
                          styles.starBtn,
                          active ? styles.starActive : '',
                          show5Anim ? styles.star5Anim : '',
                        ].filter(Boolean).join(' ')}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
                      >
                        ★
                        {is5th && animating5 && (
                          <span className={styles.sparksWrap} key={star5Key} aria-hidden="true">
                            {SPARK_ANGLES.map((angle, i) => (
                              <span
                                key={i}
                                className={styles.spark}
                                style={{
                                  '--a': `${angle}deg`,
                                  '--d': `${28 + (i % 3) * 10}px`,
                                  '--delay': `${i * 0.025}s`,
                                }}
                              />
                            ))}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {displayRating > 0 && (
                    <span className={`${styles.ratingLabel} ${displayRating === 5 ? styles.ratingLabelTop : ''}`}>
                      {RATING_LABELS[displayRating]}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="tm-message" className={styles.label}>
                  Depoimento <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="tm-message"
                  name="message"
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Conte como foi trabalhar com a Fenrys Tech..."
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>

              {sendError && (
                <p className={styles.errorMsg}>
                  Erro ao enviar. Tente novamente ou entre em contato diretamente.
                </p>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={!form.name.trim() || !form.message.trim() || sending}
              >
                {sending ? 'Enviando...' : 'Enviar depoimento →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
