import { useState, useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { projects } from '../data/siteData';
import styles from './Projects.module.css';

const allCategories = ['Todos', ...new Set(projects.map(p => p.tag))];

export default function Projects() {
  const [ref, inView] = useInView();
  const [filter, setFilter] = useState('Todos');

  const filtered = filter === 'Todos' ? projects : projects.filter(p => p.tag === filter);

  return (
    <section id="projetos" className={`section-padding ${styles.section}`}>
      <div className="container">
        <div className={`${styles.header} ${inView ? styles.visible : ''}`} ref={ref}>
          <div className="section-tag">Portfólio</div>
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
            <ProjectCard key={p.title} project={p} delay={i * 70} visible={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, delay, visible }) {
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
      style={{ transitionDelay: `${delay}ms` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.thumb} style={{ background: project.gradient }}>
        <div className={styles.dotGrid}></div>
        <div className={styles.mockUI}>
          <div className={styles.mockTopBar}></div>
          <div className={styles.mockContent}>
            <div className={styles.mockSidebar}></div>
            <div className={styles.mockMain}>
              <div className={styles.mockLine}></div>
              <div className={styles.mockLine} style={{ width: '70%' }}></div>
              <div className={styles.mockLine} style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
        <span className={styles.emoji}>{project.emoji}</span>
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
      </div>
    </div>
  );
}