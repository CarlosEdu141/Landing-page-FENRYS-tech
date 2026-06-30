import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ProcessoCircuito.module.css';

gsap.registerPlugin(ScrollTrigger);

const PATH_D =
  'M 40 300 C 200 300 250 300 380 300 C 660 300 800 230 1180 230 ' +
  'C 1520 230 1660 330 1980 330 C 2320 330 2470 260 2780 260 L 2980 260';

const Sx    = [380, 1180, 1980, 2780];
const PATHW = 3000;
const LEAD  = 300;
const TRAIL = 200;

const STEPS = [
  {
    num: '01', label: 'Descoberta',
    text: 'Entendemos profundamente o seu negócio, mapeamos oportunidades e definimos os objetivos estratégicos que guiarão todo o projeto.',
    tags: ['Workshops', 'Pesquisa', 'Metas'],
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="11" cy="11" r="7"/>
        <path d="M11 7v8M7 11h8" strokeLinecap="round"/>
        <path d="m20 20-3.5-3.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '02', label: 'Arquitetura',
    text: 'Desenhamos a solução ideal: stack tecnológica, escopo, prazos e o investimento necessário para tirar a ideia do papel com segurança.',
    tags: ['Stack', 'Escopo', 'Roadmap'],
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/>
        <rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>
      </svg>
    ),
  },
  {
    num: '03', label: 'Desenvolvimento',
    text: 'Sprint após sprint, entregamos com qualidade — revisões contínuas, testes automatizados e acompanhamento totalmente transparente.',
    tags: ['Sprints', 'QA', 'Code Review'],
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13 4l-2 16"/>
      </svg>
    ),
  },
  {
    num: '04', label: 'Lançamento',
    text: 'Deploy, testes finais, treinamento e suporte pós-lançamento. Acompanhamos a evolução do produto para garantir sucesso contínuo.',
    tags: ['Deploy', 'Testes', 'Suporte'],
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13c-1.5 1.2-2 4.5-2 6 1.5 0 4.8-.5 6-2"/>
        <path d="M13 5c3.5-2 7-2 7-2s0 3.5-2 7c-1.8 3.2-5.5 5.5-7.5 6.5L8 13.5C9 11.5 11.3 7.8 13 5Z"/>
        <circle cx="14.5" cy="9.5" r="1.4"/>
      </svg>
    ),
  },
];

// sphere absolute positions: left = centerX - 80, top = centerY - 80
const SPHERE_POS = [
  { left: 300, top: 220 },
  { left: 1100, top: 150 },
  { left: 1900, top: 250 },
  { left: 2700, top: 180 },
];

const SPIN_DURATIONS = ['18s', '20s', '22s', '19s'];
const SPIN_DIRS      = ['normal', 'reverse', 'normal', 'reverse'];

/* Partículas das esferas: --blue-light, --purple-light, --accent */
const PARTICLES = [
  [{ dx: -46, dy: -40, sz: 3, bg: '#7da4ff', dur: '2.4s', delay: '0s'   },
   { dx:  50, dy: -30, sz: 2, bg: '#a78bfa', dur: '2.9s', delay: '0.5s' },
   { dx:  38, dy:  46, sz: 3, bg: '#00d4ff', dur: '3.1s', delay: '1.0s' },
   { dx: -40, dy:  44, sz: 2, bg: '#7da4ff', dur: '2.6s', delay: '1.4s' }],
  [{ dx: -48, dy: -36, sz: 3, bg: '#7da4ff', dur: '2.7s', delay: '0.2s' },
   { dx:  46, dy: -40, sz: 2, bg: '#a78bfa', dur: '3.0s', delay: '0.7s' },
   { dx:  42, dy:  42, sz: 3, bg: '#00d4ff', dur: '2.5s', delay: '1.2s' },
   { dx: -44, dy:  40, sz: 2, bg: '#7da4ff', dur: '2.9s', delay: '1.6s' }],
  [{ dx: -46, dy: -42, sz: 3, bg: '#7da4ff', dur: '2.6s', delay: '0.3s' },
   { dx:  48, dy: -34, sz: 2, bg: '#a78bfa', dur: '3.1s', delay: '0.8s' },
   { dx:  40, dy:  44, sz: 3, bg: '#00d4ff', dur: '2.8s', delay: '1.3s' },
   { dx: -42, dy:  46, sz: 2, bg: '#7da4ff', dur: '2.4s', delay: '1.7s' }],
  [{ dx: -48, dy: -38, sz: 3, bg: '#7da4ff', dur: '2.5s', delay: '0.4s' },
   { dx:  44, dy: -42, sz: 2, bg: '#a78bfa', dur: '3.0s', delay: '0.9s' },
   { dx:  42, dy:  40, sz: 3, bg: '#00d4ff', dur: '2.7s', delay: '1.4s' },
   { dx: -44, dy:  42, sz: 2, bg: '#7da4ff', dur: '2.9s', delay: '1.8s' }],
];

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function smoothstep(t)  { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }

export default function ProcessoCircuito() {
  const stageRef     = useRef(null);
  const gridRef      = useRef(null);
  const glowARef     = useRef(null);
  const glowBRef     = useRef(null);
  const particlesRef = useRef(null);
  const sceneRef     = useRef(null);
  const pathRef      = useRef(null);
  const cometRef     = useRef(null);
  const introRef     = useRef(null);
  const barRef       = useRef(null);
  const sphereRefs      = useRef([null, null, null, null]);
  const panelRefs       = useRef([null, null, null, null]);
  const dotRefs         = useRef([null, null, null, null]);
  const mobileStepRefs  = useRef([null, null, null, null]);
  const pathLenRef      = useRef(0);
  const stRef           = useRef(null);
  const [mobActive, setMobActive] = useState([false, false, false, false]);

  const applyProgress = (p) => {
    const vw = window.innerWidth;
    const anchorX = vw * 0.32;
    const startX  = Sx[0] - LEAD; // 80
    const endX    = Sx[3] + TRAIL; // 2980
    const csx     = startX + (endX - startX) * p;

    if (sceneRef.current)
      sceneRef.current.style.transform = `translate(${anchorX - csx}px, -50%)`;

    const drawFrac = clamp(csx / PATHW, 0, 1);
    const pathEl   = pathRef.current;
    if (pathEl && pathLenRef.current) {
      pathEl.style.strokeDashoffset = String(pathLenRef.current * (1 - drawFrac));
      if (cometRef.current) {
        const pt = pathEl.getPointAtLength(pathLenRef.current * drawFrac);
        cometRef.current.style.transform = `translate(${pt.x}px,${pt.y}px) translate(-50%,-50%)`;
        cometRef.current.style.opacity   = (p > 0.004 && p < 0.996) ? '1' : '0';
      }
    }

    let best = 0, bestd = 1e9;
    for (let i = 0; i < 4; i++) {
      const d  = Math.abs(csx - Sx[i]);
      const ea = smoothstep(1 - d / 520);
      const el = sphereRefs.current[i];
      if (el) {
        el.style.setProperty('--act', ea.toFixed(3));
        el.style.transform = `scale(${(1 + 0.16 * ea).toFixed(4)})`;
        el.style.zIndex    = ea > 0.5 ? '5' : '2';
      }
      const ep  = smoothstep(1 - d / 360);
      const pel = panelRefs.current[i];
      if (pel) {
        pel.style.opacity       = String(ep);
        pel.style.transform     = `translateY(${((1 - ep) * 36).toFixed(2)}px)`;
        pel.style.filter        = `blur(${((1 - ep) * 8).toFixed(2)}px)`;
        pel.style.pointerEvents = ep > 0.6 ? 'auto' : 'none';
      }
      if (d < bestd) { bestd = d; best = i; }
    }
    for (let i = 0; i < 4; i++) {
      const del = dotRefs.current[i];
      if (del) del.style.setProperty('--on', i === best ? '1' : '0');
    }

    const introA = clamp(1 - p / 0.085, 0, 1);
    if (introRef.current) {
      introRef.current.style.opacity       = String(introA);
      introRef.current.style.transform     = `translateY(${((1 - introA) * -30).toFixed(2)}px)`;
      introRef.current.style.pointerEvents = introA > 0.5 ? 'auto' : 'none';
    }

    if (gridRef.current)
      gridRef.current.style.transform = `translate(${(-p * 160).toFixed(2)}px, ${(-p * 18).toFixed(2)}px)`;
    if (glowARef.current)
      glowARef.current.style.transform = `translate(${(-p * 120).toFixed(2)}px, 0)`;
    if (glowBRef.current)
      glowBRef.current.style.transform = `translate(${((1 - p) * 70 - 35).toFixed(2)}px, 0)`;
    if (particlesRef.current)
      particlesRef.current.style.transform = `translate(${(-p * 230).toFixed(2)}px, 0)`;
    if (barRef.current)
      barRef.current.style.width = `${(p * 100).toFixed(3)}%`;
  };

  const goTo = (i) => {
    const st = stRef.current;
    if (!st) return;
    const startX = Sx[0] - LEAD, endX = Sx[3] + TRAIL;
    const pi     = (Sx[i] - startX) / (endX - startX);
    const target = st.start + (st.end - st.start) * pi;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    /* ── mobile: IntersectionObserver por etapa ───────────────── */
    if (isMobile) {
      if (prefersReduced) {
        setMobActive([true, true, true, true]);
        return;
      }
      // primeira etapa ativa logo na entrada
      const t = setTimeout(
        () => setMobActive((prev) => { const n = [...prev]; n[0] = true; return n; }),
        250,
      );
      const obs = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const idx = mobileStepRefs.current.indexOf(e.target);
              if (idx !== -1)
                setMobActive((prev) => { const n = [...prev]; n[idx] = true; return n; });
            }
          }),
        { threshold: 0.28 },
      );
      mobileStepRefs.current.slice(1).forEach((el) => { if (el) obs.observe(el); });
      return () => { clearTimeout(t); obs.disconnect(); };
    }

    /* ── desktop: GSAP ScrollTrigger ─────────────────────────── */
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      pathLenRef.current = len;
      pathRef.current.style.strokeDasharray  = `${len} ${len}`;
      pathRef.current.style.strokeDashoffset = String(len);
    }

    applyProgress(0);

    if (prefersReduced) {
      panelRefs.current.forEach((p) => {
        if (!p) return;
        p.style.opacity = '1'; p.style.transform = 'none';
        p.style.filter = 'none'; p.style.pointerEvents = 'auto';
      });
      return;
    }

    stRef.current = ScrollTrigger.create({
      id: 'processo-circuito',
      trigger: stageRef.current,
      pin: true,
      pinSpacing: true,
      start: 'top top',
      end: '+=620vh',
      scrub: 1.8,
      onUpdate: (self) => applyProgress(self.progress),
    });

    return () => { stRef.current?.kill(); stRef.current = null; };
  }, []);

  return (
    <section id="processo">
      {/* ── desktop: sticky experience ─────────────────────────── */}
      <div ref={stageRef} className={styles.stage} style={{ '--glow': 1 }}>
        {/* ambient bg */}
        <div ref={gridRef}      className={styles.grid} />
        <div ref={glowARef}     className={styles.glowA} />
        <div ref={glowBRef}     className={styles.glowB} />

        {/* particles */}
        <div ref={particlesRef} className={styles.particles}>
          {[
            { l:'8%',  t:'24%', w:2, bg:'#7da4ff', dur:'4.2s', d:'0s'   },
            { l:'17%', t:'62%', w:3, bg:'#a78bfa', dur:'5.6s', d:'.6s'  },
            { l:'26%', t:'14%', w:2, bg:'#00d4ff', dur:'6.1s', d:'1.2s' },
            { l:'34%', t:'78%', w:2, bg:'#7da4ff', dur:'4.8s', d:'.3s'  },
            { l:'46%', t:'32%', w:2, bg:'#a78bfa', dur:'5.2s', d:'1.8s' },
            { l:'55%', t:'70%', w:3, bg:'#00d4ff', dur:'6.8s', d:'.9s'  },
            { l:'63%', t:'20%', w:2, bg:'#7da4ff', dur:'4.5s', d:'1.4s' },
            { l:'72%', t:'54%', w:2, bg:'#a78bfa', dur:'5.9s', d:'.2s'  },
            { l:'81%', t:'30%', w:3, bg:'#00d4ff', dur:'6.3s', d:'1.1s' },
            { l:'88%', t:'66%', w:2, bg:'#7da4ff', dur:'4.9s', d:'.7s'  },
            { l:'12%', t:'44%', w:2, bg:'#00d4ff', dur:'5.4s', d:'1.6s' },
            { l:'40%', t:'56%', w:2, bg:'#a78bfa', dur:'6.6s', d:'.4s'  },
            { l:'67%', t:'84%', w:2, bg:'#7da4ff', dur:'5.1s', d:'1.0s' },
            { l:'93%', t:'18%', w:2, bg:'#00d4ff', dur:'4.6s', d:'.5s'  },
          ].map((p, i) => (
            <span
              key={i}
              className={styles.particle}
              style={{
                left: p.l, top: p.t,
                width: p.w, height: p.w,
                background: p.bg,
                animation: `fenTwinkle ${p.dur} ease-in-out infinite ${p.d}`,
              }}
            />
          ))}
        </div>

        {/* scene */}
        <div className={styles.sceneWrap}>
          <div ref={sceneRef} className={styles.scene}>
            <svg
              className={styles.pathSvg}
              width="3000" height="560"
              viewBox="0 0 3000 560"
              fill="none"
            >
              <defs>
                <linearGradient id="fenLineProj" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="3000" y2="0">
                  <stop offset="0"   stopColor="#4f7cff" />
                  <stop offset="0.5" stopColor="#7c3fff" />
                  <stop offset="1"   stopColor="#00d4ff" />
                </linearGradient>
              </defs>
              <path d={PATH_D} className={styles.trackWeak} />
              <path d={PATH_D} className={styles.trackDash} />
              <path d={PATH_D} ref={pathRef} className={styles.trackLive} />
            </svg>

            {/* comet */}
            <div ref={cometRef} className={styles.comet} />

            {/* spheres */}
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => { sphereRefs.current[i] = el; }}
                className={styles.sphere}
                style={{ left: SPHERE_POS[i].left, top: SPHERE_POS[i].top }}
              >
                <div className={styles.spherePulse1} />
                <div className={styles.spherePulse2} />
                <div
                  className={`${styles.sphereOrbit} ${SPIN_DIRS[i] === 'reverse' ? styles.sphereOrbitRev : ''}`}
                  style={{ animationDuration: SPIN_DURATIONS[i] }}
                />
                <div className={styles.sphereParticles}>
                  {PARTICLES[i].map((p, j) => (
                    <span
                      key={j}
                      style={{
                        '--dx': `${p.dx}px`,
                        '--dy': `${p.dy}px`,
                        width: p.sz, height: p.sz,
                        background: p.bg,
                        animation: `fenParticle ${p.dur} ease-out infinite ${p.delay}`,
                      }}
                    />
                  ))}
                </div>
                <div className={styles.sphereGlass}>
                  <span className={styles.sphereNum}>{step.num}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* intro overlay */}
        <div ref={introRef} className={styles.intro}>
          <div className={styles.introEyebrow}>
            <span className={styles.introLine} style={{ background: 'linear-gradient(90deg, transparent, #4f7cff)' }} />
            <span className={styles.introLabel}>COMO TRABALHAMOS</span>
            <span className={styles.introLine} style={{ background: 'linear-gradient(90deg, #7c3fff, transparent)' }} />
          </div>
          <h2 className={styles.introTitle}>Do Briefing ao Deploy</h2>
          <p className={styles.introSub}>
            Percorra o circuito que transforma a sua ideia em um produto vivo — uma etapa de engenharia de cada vez.
          </p>
        </div>

        {/* content panels */}
        <div className={styles.panels}>
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              ref={(el) => { panelRefs.current[i] = el; }}
              className={styles.panel}
            >
              <div className={styles.panelEyebrow}>
                <span className={styles.panelIcon}>{step.icon}</span>
                <span className={styles.panelStep}>ETAPA {step.num}</span>
              </div>
              <h3 className={styles.panelTitle}>{step.label}</h3>
              <p className={styles.panelText}>{step.text}</p>
              <div className={styles.panelTags}>
                {step.tags.map((t) => (
                  <span key={t} className={styles.panelTag}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* step indicator */}
        <div className={styles.indicator}>
          {STEPS.map((step, i) => (
            <button
              key={step.num}
              ref={(el) => { dotRefs.current[i] = el; }}
              className={styles.dot}
              onClick={() => goTo(i)}
              aria-label={`Ir para etapa ${step.num}: ${step.label}`}
            >
              <span className={styles.dotNum}>{step.num}</span>
              <span className={styles.dotBar} />
              <span className={styles.dotLabel}>{step.label}</span>
            </button>
          ))}
        </div>

        {/* top progress bar */}
        <div className={styles.progressTrack}>
          <div ref={barRef} className={styles.progressFill} />
        </div>
      </div>

      {/* ── mobile: experience animada ──────────────────────────── */}
      <div className={styles.mobileFallback}>
        {/* fundo ambiente */}
        <div className={styles.mobGrid} />
        <div className={styles.mobGlowA} />
        <div className={styles.mobGlowB} />
        <div className={styles.mobParticles}>
          {[
            { l:'6%',  t:'12%', w:2, bg:'#7da4ff', dur:'4.2s', d:'0s'   },
            { l:'18%', t:'55%', w:2, bg:'#a78bfa', dur:'5.6s', d:'.6s'  },
            { l:'30%', t:'28%', w:2, bg:'#00d4ff', dur:'6.1s', d:'1.2s' },
            { l:'72%', t:'18%', w:2, bg:'#7da4ff', dur:'4.8s', d:'.3s'  },
            { l:'85%', t:'65%', w:2, bg:'#a78bfa', dur:'5.2s', d:'1.8s' },
            { l:'92%', t:'40%', w:2, bg:'#00d4ff', dur:'6.8s', d:'.9s'  },
            { l:'50%', t:'80%', w:2, bg:'#7da4ff', dur:'5.4s', d:'1.5s' },
            { l:'60%', t:'10%', w:2, bg:'#00d4ff', dur:'4.6s', d:'.4s'  },
          ].map((p, i) => (
            <span key={i} className={styles.particle} style={{
              left: p.l, top: p.t, width: p.w, height: p.w,
              background: p.bg,
              animation: `fenTwinkle ${p.dur} ease-in-out infinite ${p.d}`,
            }} />
          ))}
        </div>

        {/* conteúdo */}
        <div className={styles.mobInner}>
          {/* header */}
          <div className={styles.mobHeader}>
            <div className={styles.introEyebrow}>
              <span className={styles.introLine} style={{ background: 'linear-gradient(90deg,transparent,#4f7cff)' }} />
              <span className={styles.introLabel}>COMO TRABALHAMOS</span>
              <span className={styles.introLine} style={{ background: 'linear-gradient(90deg,#7c3fff,transparent)' }} />
            </div>
            <h2 className={styles.introTitle} style={{ fontSize: 'clamp(26px,7vw,40px)' }}>
              Do Briefing ao Deploy
            </h2>
            <p className={styles.introSub} style={{ fontSize: '0.95rem', marginTop: 14 }}>
              Percorra o circuito que transforma a sua ideia em um produto vivo.
            </p>
          </div>

          {/* etapas */}
          <div className={styles.mobStepsList}>
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => { mobileStepRefs.current[i] = el; }}
                className={`${styles.mobStep} ${mobActive[i] ? styles.mobStepActive : ''}`}
                style={{ '--glow': 0.9 }}
              >
                {/* esfera glassmorphism */}
                <div className={styles.mobSphere}>
                  <div className={styles.mobPulseWrap}>
                    <div className={styles.spherePulse1} />
                    <div className={styles.spherePulse2} />
                  </div>
                  <div className={`${styles.sphereOrbit} ${i % 2 === 1 ? styles.sphereOrbitRev : ''}`}
                    style={{ animationDuration: SPIN_DURATIONS[i] }} />
                  <div className={styles.mobSphereParticles}>
                    {PARTICLES[i].slice(0, 3).map((p, j) => (
                      <span key={j} style={{
                        '--dx': `${p.dx * 0.65}px`, '--dy': `${p.dy * 0.65}px`,
                        width: p.sz, height: p.sz, background: p.bg,
                        animation: `fenParticle ${p.dur} ease-out infinite ${p.delay}`,
                        position: 'absolute', left: '50%', top: '50%', borderRadius: '50%',
                      }} />
                    ))}
                  </div>
                  <div className={styles.mobSphereGlass}>
                    <span className={styles.mobSphereNum}>{step.num}</span>
                  </div>
                </div>

                {/* linha conectora (não aparece no último) */}
                {i < STEPS.length - 1 && (
                  <div className={styles.mobConnector}>
                    <div className={styles.mobConnectorFill} />
                  </div>
                )}

                {/* painel de conteúdo */}
                <div className={styles.mobPanel}>
                  <div className={styles.panelEyebrow}>
                    <span className={styles.panelIcon}>{step.icon}</span>
                    <span className={styles.panelStep}>ETAPA {step.num}</span>
                  </div>
                  <h3 className={styles.panelTitle} style={{ fontSize: 'clamp(20px,5vw,28px)' }}>
                    {step.label}
                  </h3>
                  <p className={styles.panelText} style={{ fontSize: '0.92rem' }}>{step.text}</p>
                  <div className={styles.panelTags}>
                    {step.tags.map((t) => (
                      <span key={t} className={styles.panelTag}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
