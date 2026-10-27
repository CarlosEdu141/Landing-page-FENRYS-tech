import { useId, useLayoutEffect, useRef } from 'react';

/* ══════════════════════════════════════════════
   ÍCONES FENRYS — traço fino com gradiente da marca
   Grade 24×24, só <path> (medível em todos os navegadores).
   Para usar em outro lugar: <Icon name="web" />
   ══════════════════════════════════════════════ */
const ICONS = {
  web: [
    'M4.5 4h15A1.5 1.5 0 0 1 21 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 14.5v-9A1.5 1.5 0 0 1 4.5 4z',
    'M12 16v4', 'M8.5 20h7',
    'M9.5 8 7.5 10l2 2', 'M14.5 8l2 2-2 2',
  ],
  mobile: [
    'M8 2.5h8A1.5 1.5 0 0 1 17.5 4v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5z',
    'M10.5 5.5h3', 'M11.3 18.5h1.4',
  ],
  ai: [
    'M8.5 6h7A2.5 2.5 0 0 1 18 8.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6 15.5v-7A2.5 2.5 0 0 1 8.5 6z',
    'M9.5 3v3M14.5 3v3M9.5 18v3M14.5 18v3M3 9.5h3M3 14.5h3M18 9.5h3M18 14.5h3',
    'M12 9l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z',
  ],
  shop: [
    'M5 8h14l-1.2 11.2A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.8z',
    'M9 8V6.5a3 3 0 0 1 6 0V8',
    'M9.5 12a2.5 2.5 0 0 0 5 0',
  ],
  api: [
    'M3.5 6a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
    'M15.5 6a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
    'M9.5 18a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
    'M8.5 6h7', 'M7.2 8.2l3.6 7.4', 'M16.8 8.2l-3.6 7.4',
  ],
  cloud: [
    'M7 18.5a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 17.8 8.6a4.9 4.9 0 0 1-.3 9.9z',
    'M12 16v-5.5', 'M9.8 12.7 12 10.5l2.2 2.2',
  ],
  mail: [
    'M4.5 5.5h15A1.5 1.5 0 0 1 21 7v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17V7a1.5 1.5 0 0 1 1.5-1.5z',
    'M3.5 7l8.5 6 8.5-6',
  ],
  instagram: [
    'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3z',
    'M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0',
    'M17.2 6.8h.01',
  ],
  pin: [
    'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z',
    'M9.5 10a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
  ],
  target: [
    'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0',
    'M7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0',
    'M12 12l7.5-7.5', 'M16.5 4.5h3v3',
  ],
  vision: [
    'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z',
    'M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
  ],
  wolf: [
    'M4 3l4.5 5h7L20 3v8.5L17 16l-5 5-5-5-3-4.5z',
    'M8.8 12l1.7 1', 'M15.2 12l-1.7 1',
    'M11 17h2',
  ],
};

export default function Icon({ name, size = 24, className = '' }) {
  const id = useId().replace(/:/g, '');
  const svgRef = useRef(null);

  // mede cada traço para o efeito de "redesenhar" no hover
  useLayoutEffect(() => {
    svgRef.current?.querySelectorAll('path').forEach((p) => {
      p.style.setProperty('--len', `${Math.ceil(p.getTotalLength()) + 1}`);
    });
  }, [name]);

  const paths = ICONS[name];
  if (!paths) return null;

  return (
    <svg
      ref={svgRef}
      className={`ficon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={`url(#g${id})`}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`g${id}`} x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0.1" style={{ stopColor: 'var(--blue-light)' }} />
          <stop offset="0.9" style={{ stopColor: 'var(--purple-light)' }} />
        </linearGradient>
      </defs>
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}
