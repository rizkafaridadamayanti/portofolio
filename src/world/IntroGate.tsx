import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/profile';
import { useJourney } from './JourneyContext';

const NAME = PERSONAL_INFO.name;

export const IntroGate: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const { setZoomed } = useJourney();
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    setZoomed(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enter = () => {
    if (done.current) return;
    done.current = true;
    setLeaving(true);
    setZoomed(false);
    window.setTimeout(onEnter, 700);
  };

  useEffect(() => {
    const t = window.setTimeout(enter, 5200);
    const onKey = (e: KeyboardEvent) => {
      if (['Enter', 'Space', 'Escape'].includes(e.code)) enter();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let ci = 0;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 text-center transition-all duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] ${
        leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(1200px 720px at 50% 28%, #fbfcff, var(--tint-blue) 52%, #c6d6f0)',
      }}
    >
      {/* dekorasi milik layar intro sendiri (menutupi diorama di belakang) */}
      <div aria-hidden className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-white/50 blur-3xl animate-blob" />
        <div className="absolute -bottom-32 -right-20 w-[36rem] h-[36rem] rounded-full bg-[var(--accent-soft)]/35 blur-3xl animate-blob" style={{ animationDelay: '-7s' }} />
        <div className="absolute inset-0 bg-dots-warm opacity-20 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_45%,#000_50%,transparent_100%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
      <h1 className="font-heading font-extrabold tracking-tight text-[var(--ink)] leading-[1.05] text-4xl sm:text-6xl xl:text-7xl">
        {NAME.split(' ').map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
            {word.split('').map((ch, k) => {
              const d = 0.1 + ci * 0.035;
              ci += 1;
              return (
                <span
                  key={k}
                  className="inline-block"
                  style={{
                    animation: `rise-letters 0.6s cubic-bezier(0.22,0.61,0.36,1) ${d}s both`,
                    color: wi === 1 ? 'var(--accent-strong)' : undefined,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        ))}
      </h1>

      <p className="enter-up mt-4 text-sm sm:text-lg text-[var(--ink-soft)] font-medium" style={{ animationDelay: '0.55s' }}>
        <span className="hidden lg:inline">Masuk ke ruang kerjaku — gulir untuk menjelajah tiap sudutnya.</span>
        <span className="lg:hidden">Masuk ke ruang kerjaku — geser ke kanan untuk menjelajah tiap ruangan.</span>
      </p>

      <button
        onClick={enter}
        className="enter-up mt-9 inline-flex items-center gap-3 pl-7 pr-6 py-4 rounded-2xl bg-[var(--accent-strong)] text-[#f7fafd] font-bold text-sm sm:text-base shadow-warm hover:-translate-y-0.5 transition-transform font-heading"
        style={{ animationDelay: '0.8s' }}
      >
        Masuk Portofolio <ArrowRight className="w-5 h-5" />
      </button>
      <button
        onClick={enter}
        className="enter-up mt-4 text-xs font-semibold text-[var(--ink-mute)] hover:text-[var(--accent-strong)] uppercase tracking-wide transition-colors"
        style={{ animationDelay: '0.95s' }}
      >
        Lewati
      </button>
      </div>
    </div>
  );
};
