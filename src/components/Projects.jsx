import { useState, useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { projects } from '../data/siteData';
import ProjectModal from './ProjectModal';
import styles from './Projects.module.css';

const allCategories = ['Todos', ...new Set(projects.map(p => p.tag))];

export default function Projects() {
  const [ref, inView] = useInView();
  const [filter, setFilter] = useState('Todos');
  const [open, setOpen] = useState(null); // { project, el } do card clicado

  const filtered = filter === 'Todos' ? projects : projects.filter(p => p.tag === filter);

  return (
    <section id="projetos" className={`section-padding ${styles.section}`}>
      <div className="container">
        <div className={`${styles.header} ${inView ? styles.visible : ''}`} ref={ref}>
          <div className="section-tag" data-n="04">Portfólio</div>
          <h2 className="section-title">Projetos que já entregamos</h2>
          <p className="section-subtitle">Soluções reais, para problemas reais — de vários segmentos.</p>
        </div>

        <div className={`${styles.filters} ${inView ? styles.visible : ''}`}>
          {allCategories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.title}
              project={p}
              delay={i * 70}
              visible={inView}
              onOpen={(el) => setOpen({ project: p, el })}
            />
          ))}
        </div>
      </div>

      {open && (
        <ProjectModal
          project={open.project}
          originEl={open.el}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}

function ProjectCard({ project, delay, visible, onOpen }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.removeProperty('--mx');
    card.style.removeProperty('--my');
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${visible ? styles.cardVisible : ''}`}
      style={{ '--accent': project.color, transitionDelay: `${delay}ms` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`Ver detalhes do projeto ${project.title}`}
      onClick={() => onOpen(cardRef.current)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(cardRef.current); }
      }}
    >
      <div className={styles.thumb} style={{ background: project.gradient }}>
        <img src={`${import.meta.env.BASE_URL}${project.logo}`} alt={project.title} className={styles.logo} loading="lazy" />
        <span className={styles.tagTop}>{project.tag}</span>
      </div>
      <div className={styles.body}>
        <h3>{project.title}</h3>
        <p>{project.desc}</p>
        <div className={styles.techs}>
          {project.techs.map(t => (
            <span key={t} className={styles.tech}>{t}</span>
          ))}
        </div>
        <span className={styles.more} aria-hidden="true">
          Ver detalhes <span className={styles.moreArrow}>→</span>
        </span>
      </div>
    </div>
  );
}