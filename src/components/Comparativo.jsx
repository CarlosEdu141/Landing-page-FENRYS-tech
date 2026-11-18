import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data/comparativo.json';
import './Comparativo.css';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════
   COMPARATIVO — Fenrys Tech × Freelancer × IA
   Conteúdo vem de data/comparativo.json (fonte de verdade).
   Animações: GSAP + ScrollTrigger (mesmo padrão de Historia/ProcessoBuild).
   ══════════════════════════════════════════════ */

const { colunas, criterios, placar, cta } = data;
const TOTAL = criterios.length;
const SCORE_ROW = TOTAL + 1;                         // linha 0 = cabeçalho, 1..n = critérios
const SCORES = colunas.map(c => criterios.filter(k => k[c.id]?.status === 'ok').length);

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer  = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function Svg({ children, sw = 2 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const STATUS = {
  ok:  { label: 'Atende',          sw: 3,   d: 'M5 12.5l4.5 4.5L19 7.5' },
  no:  { label: 'Não atende',      sw: 2.6, d: 'M7 7l10 10M17 7L7 17' },
  mid: { label: 'Atende em parte', sw: 2.8, d: 'M6.5 12h11' },
};

const CRIT = {
  zap:    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
  layers: <><path d="m12 2 10 5-10 5L2 7l10-5z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></>,
  db:     <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  plug:   <><path d="M9 2v6M15 2v6M12 17v5" /><path d="M6 8h12v4a6 6 0 0 1-12 0V8z" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>,
  gauge:  <><path d="m12 14 4-4" /><path d="M3.3 19a10 10 0 1 1 17.4 0" /></>,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8z" />,
  key:    <><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3" /></>,
  wallet: <><path d="M20 12V8H6a2 2 0 0 1 0-4h12v4" /><path d="M4 6v12a2 2 0 0 0 2 2h14v-4" /><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" /></>,
  trophy: <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></>,
};

function StatusIcon({ s }) {
  const st = STATUS[s];
  return (
    <span className={`fx-ic fx-ic--${s}`} role="img" aria-label={st.label}>
      <Svg sw={st.sw}><path d={st.d} /></Svg>
    </span>
  );
}

function CritIcon({ name }) {
  return <span className="fx-c__crit"><Svg>{CRIT[name]}</Svg></span>;
}

function Label({ text, detail }) {
  return <div>{text}{detail && <small>{detail}</small>}</div>;
}

/* posição fixa de cada célula na grade (a coluna destacada fica por baixo) */
const cellStyle = (r, i) => ({ gridRow: r + 1, gridColumn: i + 1 });

export default function Comparativo() {
  const [reduce] = useState(reduceMotion);
  const [fine] = useState(finePointer);
  const [hoverRow, setHoverRow] = useState(-1);

  const rootRef  = useRef(null);
  const tableRef = useRef(null);
  const spotRef  = useRef(null);
  const numRefs  = useRef([]);

  useLayoutEffect(() => {
    if (reduce) return; // movimento reduzido: o CSS já mostra o estado final

    const cleanups = [];
    const nums = numRefs.current;
    const ctx = gsap.context(() => {
      const EASE = 'power3.out';
      // once: dispara mesmo se a rolagem (ou um salto por âncora) passar direto pelo ponto
      const st = (trigger, start) => ({ trigger, start, once: true });

      /* ── Cabeçalho: chip, título e texto em sequência ── */
      gsap.from('[data-anim="head"]', {
        y: 14, opacity: 0, duration: 0.6, ease: EASE, stagger: 0.08,
        clearProps: 'transform,opacity',
        scrollTrigger: st('.fx-c__head', 'top 85%'),
      });

      /* ── Coluna Fenrys sobe junto com o cabeçalho da tabela ── */
      gsap.from('.fx-c__col', {
        y: 20, scale: 0.98, opacity: 0, duration: 0.7, ease: EASE,
        clearProps: 'transform,opacity',
        scrollTrigger: st('.fx-c__table', 'top 82%'),
      });

      /* ── Linhas: células em cascata, ícones com "pop" e ✓ desenhado.
            As linhas usam display:contents, então o gatilho é a 1ª célula. ── */
      gsap.utils.toArray('.fx-c__row').forEach((row) => {
        const cells  = row.querySelectorAll('.fx-c__cell');
        const icons  = row.querySelectorAll('.fx-ic');
        const checks = row.querySelectorAll('.fx-ic--ok path');
        const isScore = row.classList.contains('fx-c__row--score');

        const tl = gsap.timeline({ scrollTrigger: st(cells[0], 'top 88%') });

        tl.from(cells, {
          y: 10, opacity: 0, duration: 0.5, ease: EASE, stagger: 0.055,
          clearProps: 'transform,opacity',
        });

        if (icons.length) {
          // a transição CSS de hover em .fx-ic brigaria com o tween: desliga durante a entrada
          gsap.set(icons, { transition: 'none' });
          tl.from(icons, {
            scale: 0.7, opacity: 0, duration: 0.45, ease: 'back.out(1.8)', stagger: 0.055,
            clearProps: 'transform,opacity,transition',
          }, 0.12);
        }

        if (checks.length) {
          tl.fromTo(checks, { strokeDashoffset: 24 }, {
            strokeDashoffset: 0, duration: 0.42, ease: EASE, stagger: 0.055,
          }, 0.22);
        }

        if (isScore) {
          /* barras crescem até a proporção real (scaleX final vem do JSX) */
          tl.from(row.querySelectorAll('.fx-c__bar span'), {
            scaleX: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09,
          }, 0.15);

          /* contador de 0 até o total calculado dos dados */
          nums.forEach((b, i) => {
            if (!b) return;
            const n = SCORES[i];
            const counter = { v: 0 };
            b.textContent = '0';
            tl.to(counter, {
              v: n, duration: 0.9 + n * 0.06, ease: EASE,
              onUpdate: () => { b.textContent = Math.round(counter.v); },
              onComplete: () => { b.textContent = n; },
            }, 0.15 + i * 0.09);
          });
        }
      });

      /* ── CTA ── */
      gsap.from('[data-anim="cta"]', {
        y: 14, opacity: 0, duration: 0.6, ease: EASE,
        clearProps: 'transform,opacity',
        scrollTrigger: st('[data-anim="cta"]', 'top 92%'),
      });

      /* ── Luz que segue o mouse (só com mouse), com inércia via quickTo ── */
      const table = tableRef.current;
      const spot = spotRef.current;
      if (fine && table && spot) {
        const xTo = gsap.quickTo(spot, 'x', { duration: 0.45, ease: EASE });
        const yTo = gsap.quickTo(spot, 'y', { duration: 0.45, ease: EASE });
        const onMove = (e) => {
          const r = table.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          if (!table.classList.contains('is-lit')) {
            gsap.set(spot, { x, y });       // entra já no lugar, sem "voar" do canto
            table.classList.add('is-lit');
          }
          xTo(x); yTo(y);
        };
        const onLeave = () => table.classList.remove('is-lit');
        table.addEventListener('pointermove', onMove);
        table.addEventListener('pointerleave', onLeave);
        cleanups.push(() => {
          table.removeEventListener('pointermove', onMove);
          table.removeEventListener('pointerleave', onLeave);
          table.classList.remove('is-lit');
        });
      }
    }, rootRef);

    return () => {
      cleanups.forEach(fn => fn());
      ctx.revert();
      nums.forEach((b, i) => { if (b) b.textContent = SCORES[i]; });
    };
  }, [reduce, fine]);

  /* hover de linha só com mouse */
  const hoverProps = (r) => fine ? {
    onMouseEnter: () => setHoverRow(r),
    onMouseLeave: () => setHoverRow(h => (h === r ? -1 : h)),
  } : {};

  const rowClass = (r, extra = '') => `fx-c__row${extra}${hoverRow === r ? ' is-hover' : ''}`;

  return (
    <section className="fx-c" id="comparativo" aria-labelledby="fx-c-title" ref={rootRef}>
      <div className="fx-c__wrap">

        <header className="fx-c__head">
          <div>
            <span className="fx-c__chip" data-anim="head"><i></i>{data.chip}</span>
            <h2 className="fx-c__title" id="fx-c-title" data-anim="head">
              {data.titulo} <span>{data.titulo_destaque}</span>
            </h2>
          </div>
          <p className="fx-c__lead" data-anim="head">
            {data.texto} <b>{data.texto_destaque}</b>
          </p>
        </header>

        <div
          className="fx-c__table"
          role="table"
          aria-label="Comparativo entre Fenrys Tech, freelancer e plataforma de IA generativa"
          ref={tableRef}
          style={{ gridTemplateRows: `repeat(${TOTAL + 2}, auto)` }}
        >
          <div className="fx-c__clip" aria-hidden="true"><div className="fx-c__spot" ref={spotRef}></div></div>
          <div className="fx-c__col" aria-hidden="true"></div>

          {/* Cabeçalho */}
          <div className={rowClass(0, ' fx-c__row--head')} role="row">
            <div className="fx-c__cell fx-c__th-first" role="columnheader" style={cellStyle(0, 0)}>
              <span className="fx-c__coltag">// critério</span>
              <span className="fx-c__colname">O que muda em cada caminho</span>
            </div>
            {colunas.map((c, i) => c.destaque ? (
              <div key={c.id} className="fx-c__cell is-us" role="columnheader" style={cellStyle(0, i + 1)}>
                <span className="fx-c__pill">{c.etiqueta}</span>
                <span className="fx-c__brand">FENRYS <em>TECH</em></span>
              </div>
            ) : (
              <div key={c.id} className="fx-c__cell" role="columnheader" style={cellStyle(0, i + 1)}>
                <span className="fx-c__coltag">{c.etiqueta}</span>
                <span className="fx-c__colname">{c.nome}</span>
              </div>
            ))}
          </div>

          {/* Critérios */}
          {criterios.map((k, idx) => {
            const r = idx + 1;
            return (
              <div key={k.criterio} className={rowClass(r)} role="row">
                <div className="fx-c__cell fx-c__cell--label" role="rowheader" style={cellStyle(r, 0)} {...hoverProps(r)}>
                  <CritIcon name={k.icone} />
                  <Label text={k.criterio} detail={k.detalhe} />
                </div>
                {colunas.map((c, i) => (
                  <div key={c.id} className={`fx-c__cell${c.destaque ? ' is-us' : ''}`} role="cell"
                    style={cellStyle(r, i + 1)} {...hoverProps(r)}>
                    <StatusIcon s={k[c.id].status} />
                    <div><span className="fx-c__who">{c.nome}</span>{k[c.id].texto}</div>
                  </div>
                ))}
              </div>
            );
          })}

          {/* Placar — calculado a partir dos status "ok" */}
          <div className={rowClass(SCORE_ROW, ' fx-c__row--score')} role="row">
            <div className="fx-c__cell fx-c__cell--label" role="rowheader" style={cellStyle(SCORE_ROW, 0)} {...hoverProps(SCORE_ROW)}>
              <CritIcon name="trophy" />
              <Label text={placar.titulo} detail={placar.detalhe} />
            </div>
            {colunas.map((c, i) => (
              <div key={c.id} className={`fx-c__cell${c.destaque ? ' is-us' : ''}`} role="cell"
                aria-label={`${SCORES[i]} de ${TOTAL} critérios`}
                style={cellStyle(SCORE_ROW, i + 1)} {...hoverProps(SCORE_ROW)}>
                <span className="fx-c__who">{c.nome}</span>
                <span className="fx-c__num">
                  <b ref={el => { numRefs.current[i] = el; }}>{SCORES[i]}</b>
                  <small>/{TOTAL}</small>
                </span>
                <span className="fx-c__bar">
                  <span style={{ transform: `scaleX(${SCORES[i] / TOTAL})` }}></span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="fx-c__cta" data-anim="cta">
          {/* WhatsApp da Fenrys + mensagem pré-pronta: editar em data/comparativo.json (cta.link) */}
          <a className="fx-c__btn" href={cta.link} target="_blank" rel="noopener noreferrer">
            {cta.texto}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
          <span className="fx-c__cta-note">{cta.nota}</span>
        </div>
      </div>
    </section>
  );
}
