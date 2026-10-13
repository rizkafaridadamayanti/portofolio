import React, { useEffect, useRef, useState } from 'react';

/** Angka menghitung naik saat pertama terlihat. Cocok di dalam maupun luar diorama. */
export const CountUp: React.FC<{ value: string; className?: string }> = ({ value, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [disp, setDisp] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const m = value.match(/^([\d.]+)(.*)$/);
    if (!m) { setDisp(value); return; }
    const target = parseFloat(m[1]);
    const suffix = m[2];
    const decimals = (m[1].split('.')[1] || '').length;

    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - t0) / 1100, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setDisp((target * e).toFixed(decimals) + suffix);
        if (p < 1) requestAnimationFrame(step);
        else setDisp(m[1] + suffix);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && run()), { threshold: 0.4 });
    io.observe(el);
    // di diorama, IntersectionObserver mungkin tak terpicu (transform 3D) → fallback timer
    const t = window.setTimeout(run, 900);
    return () => { io.disconnect(); window.clearTimeout(t); };
  }, [value]);

  return <span ref={ref} className={className}>{disp}</span>;
};
