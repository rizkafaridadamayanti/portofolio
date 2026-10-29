import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { STATIONS, STATION_COUNT } from './journey';
import { useJourney, useLayout } from './JourneyContext';

export const JourneyNav: React.FC = () => {
  const { active, goTo, zoomed } = useJourney();
  const { wide } = useLayout();

  // panah kiri/kanan untuk pindah ruangan
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.code === 'ArrowRight') goTo(active + 1);
      if (e.code === 'ArrowLeft') goTo(active - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, goTo]);

  if (zoomed) return null;

  return (
    <>
      {/* Bar atas: logo + hire */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 pointer-events-none">
        <button
          onClick={() => goTo(0)}
          className="pointer-events-auto flex items-center gap-2.5 group"
        >
          <span className="w-9 h-9 rounded-xl bg-[var(--accent-strong)] text-[#f7fafd] font-heading font-bold text-sm flex items-center justify-center shadow-warm-sm group-hover:-rotate-6 transition-transform">
            RFD
          </span>
          <span className="hidden sm:flex flex-col text-left leading-tight">
            <span className="font-heading font-bold text-[var(--ink)] text-sm">Rizka Farida D.</span>
            <span className="text-[10px] text-[var(--ink-mute)]">Dunia Meja Kerja</span>
          </span>
        </button>
        <button
          onClick={() => goTo(STATION_COUNT - 1)}
          className="pointer-events-auto px-4 py-2 rounded-full bg-[var(--accent-strong)] text-[#f7fafd] text-xs font-bold shadow-warm-sm hover:-translate-y-0.5 transition-transform flex items-center gap-1.5"
        >
          Ajak kerja sama <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Dock ruangan */}
      <nav className="fixed z-40 left-1/2 -translate-x-1/2 bottom-4 pointer-events-auto">
        <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/88 backdrop-blur-md border border-[var(--line)] shadow-warm">
          <button
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--ink-soft)] hover:bg-[var(--cream)] disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {wide ? (
            STATIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                title={s.name}
                className={`rounded-full transition-all flex items-center justify-center ${
                  i === active ? 'px-3 h-8 bg-[var(--accent-strong)] text-[#f7fafd]' : 'w-8 h-8 text-[var(--ink-mute)] hover:bg-[var(--cream)]'
                }`}
              >
                {i === active ? (
                  <span className="text-[11px] font-bold whitespace-nowrap font-heading">{s.name}</span>
                ) : (
                  <span className="text-[11px] font-bold">{i + 1}</span>
                )}
              </button>
            ))
          ) : (
            <div className="px-3 h-8 flex items-center gap-2">
              <span className="text-[11px] font-bold font-heading text-[var(--accent-strong)] whitespace-nowrap">
                {STATIONS[active]?.name}
              </span>
              <span className="text-[10px] font-bold text-[var(--ink-mute)]">
                {active + 1}/{STATION_COUNT}
              </span>
            </div>
          )}

          <button
            onClick={() => goTo(active + 1)}
            disabled={active === STATION_COUNT - 1}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--ink-soft)] hover:bg-[var(--cream)] disabled:opacity-30"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>
    </>
  );
};
