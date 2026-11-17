import { useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/*
 * Parágrafo lido na velocidade do scroll: as palavras acendem de apagadas
 * para cheias conforme o texto passa pelo meio da tela, e os termos que
 * importam (`hot`) acendem na cor da seção.
 */
export default function ScrubText({ text, hot = [], className = '' }) {
  const ref = useRef(null);

  const words = useMemo(() => {
    const list = text.split(' ');
    const marked = new Set();
    const clean = (w) => w.replace(/[.,:;—]/g, '');
    for (const phrase of hot) {
      const pw = phrase.split(' ');
      for (let i = 0; i + pw.length <= list.length; i++) {
        if (pw.every((w, j) => clean(list[i + j]) === w)) {
          for (let j = 0; j < pw.length; j++) marked.add(i + j);
        }
      }
    }
    return list.map((w, i) => ({ w, hot: marked.has(i) }));
  }, [text, hot]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = el.querySelectorAll('.scrub-word');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spans.forEach((s) => s.classList.add('lit'));
      return;
    }
    let lit = -1;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      end: 'bottom 50%',
      onUpdate: (self) => {
        const n = Math.round(self.progress * spans.length);
        if (n === lit) return;
        lit = n;
        spans.forEach((s, i) => s.classList.toggle('lit', i < n));
      },
    });
    return () => st.kill();
  }, [words]);

  return (
    <p ref={ref} className={className}>
      {words.map(({ w, hot: h }, i) => (
        <span key={i} className={`scrub-word${h ? ' hot' : ''}`}>{w} </span>
      ))}
    </p>
  );
}
