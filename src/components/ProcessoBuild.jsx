import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ProcessoBuild.module.css';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════
   DADOS
   ══════════════════════════════════════════════ */
const STEPS = [
  {
    num: '01', label: 'Descoberta',
    text: 'Entendemos profundamente o seu negócio, mapeamos oportunidades e definimos os objetivos estratégicos que guiarão todo o projeto.',
    tags: ['Workshops', 'Pesquisa', 'Metas'],
  },
  {
    num: '02', label: 'Arquitetura',
    text: 'Desenhamos a solução ideal: stack tecnológica, escopo, prazos e o investimento necessário para tirar a ideia do papel com segurança.',
    tags: ['Stack', 'Escopo', 'Roadmap'],
  },
  {
    num: '03', label: 'Desenvolvimento',
    text: 'Sprint após sprint, entregamos com qualidade — revisões contínuas, testes automatizados e acompanhamento totalmente transparente.',
    tags: ['Sprints', 'QA', 'Code Review'],
  },
  {
    num: '04', label: 'Lançamento',
    text: 'Deploy, testes finais, treinamento e suporte pós-lançamento. Acompanhamos a evolução do produto para garantir sucesso contínuo.',
    tags: ['Deploy', 'Testes', 'Suporte'],
  },
];

const STATUS = ['Rascunho', 'Blueprint', 'Em build', 'No ar'];
const URL_TEXT = 'seuprojeto.com.br';

/* Rabiscos da descoberta — viewBox 600×375, traço "à mão" */
const SKETCH = [
  'M20 24 C 150 18, 420 28, 580 20 C 582 34, 580 46, 582 58 C 400 64, 200 55, 18 60 C 20 46, 18 36, 20 24',
  'M44 110 C 70 100, 92 120, 122 108 S 172 100, 202 112 S 252 104, 282 110',
  'M44 140 C 84 132, 124 148, 164 138 S 212 134, 240 142',
  'M44 176 C 60 170, 90 172, 120 170 C 122 186, 118 194, 120 200 C 96 204, 66 200, 44 202 C 42 190, 46 184, 44 176',
  'M338 84 C 420 78, 540 90, 560 86 C 566 150, 558 190, 562 220 C 470 226, 400 218, 336 224 C 340 170, 332 120, 338 84',
  'M350 210 L 410 150 L 450 188 L 490 140 L 550 210',
  'M300 150 C 312 130, 322 118, 332 112 M 318 110 L 333 111 L 330 126',
  'M40 250 C 90 246, 130 252, 172 248 C 174 280, 170 310, 172 334 C 130 336, 80 330, 38 334 C 42 300, 38 270, 40 250',
  'M218 252 C 268 248, 318 254, 362 250 C 362 282, 366 310, 362 334 C 318 330, 268 336, 216 332 C 220 300, 214 276, 218 252',
  'M408 250 C 458 246, 508 252, 560 248 C 558 282, 562 310, 560 334 C 508 336, 458 330, 406 334 C 410 300, 404 276, 408 250',
  'M470 285 C 470 268, 494 268, 494 283 C 494 294, 482 294, 482 306 M482 318 L482 320',
];

const POSTITS = [
  { text: 'Quem é o usuário?',   cls: 'p1' },
  { text: 'Meta: vender mais online', cls: 'p2' },
  { text: 'MVP em 8 semanas?',   cls: 'p3' },
];

/* Blocos do layout: viram wireframe (02) e depois interface real (03) */
const BLOCKS = [
  { k: 'nav',    l: 4,    t: 5,  w: 92, h: 11, anno: 'header · 72px' },
  { k: 'title',  l: 6,    t: 25, w: 42, h: 9,  anno: 'h1' },
  { k: 'sub',    l: 6,    t: 38, w: 32, h: 5,  anno: 'subtítulo' },
  { k: 'btn',    l: 6,    t: 49, w: 17, h: 8,  anno: 'CTA' },
  { k: 'img',    l: 56,   t: 23, w: 38, h: 36, anno: 'hero · 16:9' },
  { k: 'card',   l: 4,    t: 67, w: 29, h: 27, anno: 'cards × 3' },
  { k: 'card',   l: 35.5, t: 67, w: 29, h: 27 },
  { k: 'card',   l: 67,   t: 67, w: 29, h: 27 },
];

const STACK = ['React', 'Node.js', 'PostgreSQL', 'Cloud'];

const CODE = [
  [['kw', 'const '], ['fn', 'Projeto'], ['p', ' = () => {']],
  [['p', '  '], ['kw', 'const '], ['p', 'ideia = '], ['str', "'sua ideia'"], ['p', ';']],
  [['p', '  '], ['kw', 'await '], ['fn', 'validar'], ['p', '(ideia);']],
  [['p', '  '], ['kw', 'return '], ['tag', '<Produto '], ['p', 'pronto '], ['tag', '/>'], ['p', ';']],
  [['p', '};']],
];

const TERMINAL = [
  { cls: 'cmd', text: '$ npm test' },
  { cls: 'ok',  text: '✓ 128 testes passando' },
  { cls: 'cmd', text: '$ npm run build' },
  { cls: 'ok',  text: '✓ build concluído em 4.2s' },
];

/* Explosão do lançamento — determinística (sem Math.random no render) */
const BURST = Array.from({ length: 22 }, (_, i) => {
  const ang = (i / 22) * Math.PI * 2 + (i % 3) * 0.2;
  const dist = 140 + ((i * 37) % 90);
  return {
    x: Math.cos(ang) * dist,
    y: Math.sin(ang) * dist * 0.7,
    c: ['#7da4ff', '#a78bfa', '#00d4ff', '#22e39a'][i % 4],
    s: 4 + (i % 3) * 2,
  };
});

/* ══════════════════════════════════════════════
   COMPONENTE
   ══════════════════════════════════════════════ */
export default function ProcessoBuild() {
  const stageRef = useRef(null);
  const tlRef    = useRef(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      stage.classList.add(styles.reduced);
      return;
    }

    const ctx = gsap.context(() => {
      const $  = (c) => stage.querySelectorAll(`.${styles[c]}`);
      const texts  = $('stepText');
      const status = $('status');
      const nodes  = $('node');

      /* estado inicial */
      gsap.set([...texts].slice(1),  { autoAlpha: 0 });
      gsap.set([...status].slice(1), { autoAlpha: 0, y: 8 });
      // traços "desenhados": usa o comprimento real (pathLength tem bugs no Safari)
      const drawable = (els) => els.forEach((el) => {
        const len = el.getTotalLength() + 1;
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      });
      drawable($('sketchPath'));
      gsap.set($('postit'), { autoAlpha: 0, scale: 0.4, y: 30 });
      gsap.set($('blueprint'), { autoAlpha: 0 });
      gsap.set($('wf'), { autoAlpha: 0, scale: 0.94 });
      gsap.set($('anno'), { autoAlpha: 0, y: 4 });
      gsap.set($('chip'), { autoAlpha: 0, x: 30 });
      gsap.set($('ui'), { clipPath: 'inset(0 100% 0 0)' });
      gsap.set($('editor'), { autoAlpha: 0, x: -60, y: 30 });
      gsap.set($('codeLine'), { clipPath: 'inset(0 100% 0 0)' });
      gsap.set($('termLine'), { autoAlpha: 0, x: -8 });
      gsap.set($('buildBar'), { scaleX: 0 });
      gsap.set($('urlTyped'), { width: 0 });
      gsap.set($('lock'), { autoAlpha: 0, scale: 0 });
      gsap.set($('spark'), { autoAlpha: 0, x: 0, y: 0, scale: 0 });
      gsap.set($('metric'), { autoAlpha: 0, y: 30, scale: 0.9 });
      drawable($('chartLine'));
      gsap.set($('railFill'), { scaleX: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      const swap = (list, from, to, at) => {
        tl.to(list[from], { autoAlpha: 0, y: -20, duration: 0.45 }, at)
          .fromTo(list[to],
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.55 }, at + 0.3);
      };

      /* ── 01 DESCOBERTA ── */
      tl.addLabel('s0', 0);
      tl.to($('sketchPath'), { strokeDashoffset: 0, duration: 0.7, ease: 'none', stagger: 0.12 }, 0.1);
      tl.to($('postit'), {
        autoAlpha: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.35,
      }, 0.6);
      tl.addLabel('s0end', 2.2);

      /* ── 02 ARQUITETURA ── */
      const T2 = 2.8;
      swap(texts, 0, 1, T2);
      swap(status, 0, 1, T2);
      tl.to($('railFill'), { scaleX: 1 / 3, duration: 0.8, ease: 'power1.inOut' }, T2);
      tl.to($('sketch'), { autoAlpha: 0, scale: 1.04, duration: 0.6 }, T2);
      tl.to($('postit'), {
        autoAlpha: 0, y: -60, rotate: '+=25', scale: 0.7, duration: 0.6, stagger: 0.08, ease: 'power2.in',
      }, T2);
      tl.to($('blueprint'), { autoAlpha: 1, duration: 0.6 }, T2 + 0.2);
      tl.to($('wf'), { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.09, ease: 'back.out(1.6)' }, T2 + 0.4);
      tl.to($('anno'), { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 }, T2 + 1.0);
      tl.to($('chip'), { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.12, ease: 'back.out(1.8)' }, T2 + 1.0);
      tl.addLabel('s1', T2 + 0.9);

      /* ── 03 DESENVOLVIMENTO ── */
      const T3 = 5.4;
      swap(texts, 1, 2, T3);
      swap(status, 1, 2, T3);
      tl.to($('railFill'), { scaleX: 2 / 3, duration: 0.8, ease: 'power1.inOut' }, T3);
      tl.to($('anno'), { autoAlpha: 0, duration: 0.3 }, T3);
      tl.to($('blueprint'), { autoAlpha: 0, duration: 0.8 }, T3 + 0.2);
      tl.to($('ui'), { clipPath: 'inset(0 0% 0 0)', duration: 0.6, stagger: 0.12, ease: 'power2.inOut' }, T3 + 0.3);
      tl.to($('wf'), { borderColor: 'transparent', duration: 0.6, stagger: 0.12 }, T3 + 0.3);
      tl.to($('editor'), { autoAlpha: 1, x: 0, y: 0, duration: 0.6, ease: 'power3.out' }, T3 + 0.2);
      tl.to($('codeLine'), { clipPath: 'inset(0 0% 0 0)', duration: 0.35, stagger: 0.18, ease: 'none' }, T3 + 0.6);
      tl.to($('termLine'), { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.2 }, T3 + 1.5);
      tl.to($('buildBar'), { scaleX: 1, duration: 1.8, ease: 'none' }, T3 + 0.4);
      tl.addLabel('s2', T3 + 1.2);

      /* ── 04 LANÇAMENTO ── */
      const T4 = 8.4;
      swap(texts, 2, 3, T4);
      swap(status, 2, 3, T4);
      tl.to($('railFill'), { scaleX: 1, duration: 0.8, ease: 'power1.inOut' }, T4);
      tl.to($('editor'), { autoAlpha: 0, x: -40, y: 40, duration: 0.5, ease: 'power2.in' }, T4);
      tl.to($('chip'), { autoAlpha: 0, x: 30, duration: 0.4, stagger: 0.05 }, T4);
      tl.to($('buildBar'), { autoAlpha: 0, duration: 0.3 }, T4 + 0.2);
      tl.to($('urlBlank'), { autoAlpha: 0, duration: 0.2 }, T4 + 0.2);
      tl.to($('lock'), { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, T4 + 0.3);
      tl.to($('urlTyped'), {
        width: `${URL_TEXT.length}ch`, duration: 0.8, ease: `steps(${URL_TEXT.length})`,
      }, T4 + 0.4);
      tl.to($('window'), {
        boxShadow: '0 0 0 1px rgba(34,227,154,0.35), 0 30px 90px rgba(124,63,255,0.35), 0 0 60px rgba(0,212,255,0.18)',
        duration: 0.6,
      }, T4 + 1.1);
      tl.fromTo($('spark'),
        { autoAlpha: 1, x: 0, y: 0, scale: 0 },
        {
          x: (i) => BURST[i].x, y: (i) => BURST[i].y, scale: 1, autoAlpha: 0,
          duration: 1, ease: 'power3.out', stagger: 0.01,
        }, T4 + 1.2);
      tl.to($('metric'), { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.2, ease: 'back.out(1.8)' }, T4 + 1.4);
      tl.to($('chartLine'), { strokeDashoffset: 0, duration: 0.8, ease: 'power1.inOut' }, T4 + 1.7);
      tl.addLabel('s3', T4 + 1.6);
      tl.to({}, { duration: 0.8 }); // respiro no fim antes de soltar o pin

      /* nós da trilha: ativo / concluído */
      const starts = [0, T2 + 0.3, T3 + 0.3, T4 + 0.3];
      let current = -1;
      const syncNodes = () => {
        const t = tl.time();
        let s = 0;
        for (let i = 0; i < starts.length; i++) if (t >= starts[i]) s = i;
        if (s === current) return;
        current = s;
        nodes.forEach((n, i) => {
          n.classList.toggle(styles.nodeActive, i === s);
          n.classList.toggle(styles.nodeDone, i < s);
        });
        stage.classList.toggle(styles.live, s === 3);
      };

      ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: () => `+=${window.innerHeight * 5.5}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate: syncNodes,
      });

      syncNodes();
      tlRef.current = tl;
    }, stage);

    return () => { ctx.revert(); tlRef.current = null; };
  }, []);

  /* clique num nó da trilha → rola até aquela etapa */
  const goTo = (i) => {
    const tl = tlRef.current;
    const st = tl?.scrollTrigger;
    if (!st) return;
    const time = tl.labels[`s${i}`] ?? 0;
    const top  = st.start + (st.end - st.start) * (time / tl.duration());
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <section id="processo" className={styles.section}>
      <div className={`container ${styles.head}`}>
        <div className="section-tag">Como Trabalhamos</div>
        <h2 className="section-title">Do Briefing ao <span className="gradient-text">Deploy</span></h2>
        <p className="section-subtitle">
          Role e veja uma ideia virar produto — cada etapa, uma camada a mais de engenharia.
        </p>
      </div>

      <div ref={stageRef} className={styles.stage}>
        <div className={styles.ambient}>
          <div className={styles.glowA} />
          <div className={styles.glowB} />
        </div>

        <div className={`container ${styles.layout}`}>
          {/* ── Coluna de texto ── */}
          <div className={styles.story}>
            <nav className={styles.rail} aria-label="Etapas do processo">
              <div className={styles.railTrack}><div className={styles.railFill} /></div>
              {STEPS.map((s, i) => (
                <button
                  key={s.num}
                  className={`${styles.node} ${i === 0 ? styles.nodeActive : ''}`}
                  onClick={() => goTo(i)}
                >
                  <span className={styles.nodeDot}>{s.num}</span>
                  <span className={styles.nodeLabel}>{s.label}</span>
                </button>
              ))}
            </nav>

            <div className={styles.texts}>
              {STEPS.map((s) => (
                <article key={s.num} className={styles.stepText}>
                  <span className={styles.bigNum}>{s.num}</span>
                  <h3>{s.label}</h3>
                  <p>{s.text}</p>
                  <div className={styles.tags}>
                    {s.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* ── Palco do produto ── */}
          <div className={styles.device} aria-hidden="true">
            <div className={styles.window}>
              <div className={styles.chrome}>
                <span className={styles.lights}><i /><i /><i /></span>
                <div className={styles.url}>
                  <span className={styles.lock}>
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                  </span>
                  <span className={styles.urlBlank}>about:blank</span>
                  <span className={styles.urlTyped}>{URL_TEXT}</span>
                  <span className={styles.caret} />
                </div>
                <div className={styles.statusBox}>
                  {STATUS.map((s, i) => (
                    <span key={s} className={`${styles.status} ${i === 3 ? styles.statusLive : ''}`}>
                      <b />{s}
                    </span>
                  ))}
                </div>
                <div className={styles.buildBar} />
              </div>

              <div className={styles.canvas}>
                <div className={styles.blueprint} />

                <svg className={styles.sketch} viewBox="0 0 600 375" preserveAspectRatio="none">
                  {SKETCH.map((d, i) => (
                    <path key={i} d={d} className={styles.sketchPath} />
                  ))}
                </svg>

                {BLOCKS.map((b, i) => (
                  <div
                    key={i}
                    className={`${styles.wf} ${styles[`wf_${b.k}`]}`}
                    style={{ left: `${b.l}%`, top: `${b.t}%`, width: `${b.w}%`, height: `${b.h}%` }}
                  >
                    <div className={styles.ui}><BlockUI kind={b.k} /></div>
                    {b.anno && <span className={styles.anno}>{b.anno}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* flutuantes em volta da janela */}
            {POSTITS.map((p) => (
              <div key={p.text} className={`${styles.postit} ${styles[p.cls]}`}>{p.text}</div>
            ))}

            <div className={styles.chips}>
              {STACK.map((s) => <span key={s} className={styles.chip}>{s}</span>)}
            </div>

            <div className={styles.editor}>
              <div className={styles.editorBar}><i /><i /><i /><span>Projeto.jsx</span></div>
              <pre className={styles.code}>
                {CODE.map((line, i) => (
                  <span key={i} className={styles.codeLine}>
                    <em>{i + 1}</em>
                    {line.map(([c, t], j) => <span key={j} className={styles[c]}>{t}</span>)}
                  </span>
                ))}
              </pre>
              <div className={styles.terminal}>
                {TERMINAL.map((l) => (
                  <span key={l.text} className={`${styles.termLine} ${styles[l.cls]}`}>{l.text}</span>
                ))}
              </div>
            </div>

            <div className={styles.burst}>
              {BURST.map((b, i) => (
                <i key={i} className={styles.spark} style={{ background: b.c, color: b.c, width: b.s, height: b.s }} />
              ))}
            </div>

            <div className={`${styles.metric} ${styles.m1}`}>
              <div className={styles.ring}>
                <svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" /></svg>
                <b>98</b>
              </div>
              <span>Performance</span>
            </div>
            <div className={`${styles.metric} ${styles.m2}`}>
              <span>Usuários ativos</span>
              <svg viewBox="0 0 120 40" className={styles.chart}>
                <path className={styles.chartLine}
                  d="M2 36 C 20 34, 28 30, 40 28 S 60 26, 70 18 S 92 14, 100 8 S 112 4, 118 3" />
              </svg>
              <b className={styles.up}>↑ 240%</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Conteúdo "real" de cada bloco quando a interface ganha vida */
function BlockUI({ kind }) {
  switch (kind) {
    case 'nav':
      return (
        <>
          <i className={styles.uiLogo} />
          <span className={styles.uiLinks}><b /><b /><b /></span>
          <em className={styles.uiNavBtn} />
        </>
      );
    case 'btn':
      return <span className={styles.uiBtnText}>Começar →</span>;
    case 'img':
      return <><i className={styles.uiSun} /><i className={styles.uiHill} /></>;
    case 'card':
      return <><i className={styles.uiStripe} /><b /><b /></>;
    default:
      return null;
  }
}
