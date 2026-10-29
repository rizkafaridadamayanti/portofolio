import React, { useState } from 'react';
import { STATIONS, JOURNEY_VH, clamp } from './journey';
import { useJourney, useLayout, StationXProvider, useStationX, StationIndexProvider, useStationIndex } from './JourneyContext';

/* ============================================================
   WorldScene — panggung tetap; objek memposisikan diri sendiri
   (parallax 2D manual, tanpa CSS preserve-3d yang rewel).
   Di layar sempit panggung yang sama hanya diskalakan (stageScale)
   supaya komposisinya sebanding dengan versi desktop.
   ============================================================ */
const WorldBackdrop: React.FC = () => {
  const { camX, camY } = useJourney();
  const shift = -camX * 0.12 + camY * 0.1;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* lantai / horizon */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: 0,
          height: '38%',
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.55) 30%, rgba(219,227,240,0.35))',
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{ top: '62%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(72,107,146,0.22),transparent)' }}
      />
      {/* bentuk besar jauh (parallax paling lambat) */}
      <div className="absolute inset-0" style={{ transform: `translateX(${shift}px)` }}>
        {[
          { l: '12%', t: '16%', s: 300, c: 'rgba(174,197,236,0.30)' },
          { l: '68%', t: '58%', s: 380, c: 'rgba(198,218,156,0.24)' },
          { l: '84%', t: '12%', s: 240, c: 'rgba(200,196,232,0.28)' },
          { l: '40%', t: '72%', s: 260, c: 'rgba(174,197,236,0.24)' },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute dio-bob-3"
            style={{
              left: b.l, top: b.t, width: b.s, height: b.s, background: b.c,
              borderRadius: '46% 54% 60% 40% / 50% 46% 54% 50%', filter: 'blur(8px)',
              animationDelay: `${i * -1.4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const WorldScene: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { diorama, stageScale } = useLayout();
  const { zoomed, stationF, transition } = useJourney();

  // reduced-motion → daftar vertikal biasa (aksesibilitas)
  if (!diorama) {
    return <div className="dio-fallback relative w-full overflow-hidden">{children}</div>;
  }

  const base = zoomed ? 0.44 : 1 - transition * 0.05;

  return (
    <>
      <div style={{ height: `${JOURNEY_VH}vh` }} aria-hidden />
      <div className="dio-viewport">
        {STATIONS.map((s, i) => (
          <div
            key={s.id}
            className="dio-ambient"
            style={{ background: s.ambient, opacity: i === 0 ? 1 : 1 - clamp(Math.abs(stationF - i), 0, 1) }}
          />
        ))}
        <div className="absolute inset-0 bg-dots-warm opacity-25 pointer-events-none [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,#000_45%,transparent_100%)]" />
        <WorldBackdrop />
        {/* skala dasar dipisah dari .dio-stage supaya transisi zoom intro
            tidak ikut menganimasikan penyesuaian ukuran di layar sempit */}
        <div className="dio-scale" style={{ transform: `scale(${stageScale})` }}>
          <div className="dio-stage" style={{ transform: zoomed ? `scale(${base}) translateY(2%)` : `scale(${base.toFixed(3)})` }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

/* ============================================================
   Station — memberi tahu objek di dalamnya posisi dunia-nya
   ============================================================ */
export const Station: React.FC<{ index: number; className?: string; children: React.ReactNode }> = ({
  index,
  className = '',
  children,
}) => {
  const s = STATIONS[index];
  return (
    <StationIndexProvider value={index}>
      <StationXProvider value={s.x}>
        <section id={s.id} data-station={s.id} className={`dio-station ${className}`}>
          <div className="dio-anchor">{children}</div>
        </section>
      </StationXProvider>
    </StationIndexProvider>
  );
};

/* ============================================================
   DioObject — objek melayang: parallax + skala + hover tilt
   ============================================================ */
interface DioObjectProps {
  x?: number;
  y?: number;
  depth?: number; // 0.2 (jauh, lambat, kecil) .. 1.1 (dekat, cepat, besar)
  bob?: 0 | 1 | 2 | 3;
  shadow?: number;
  hoverTilt?: number;
  className?: string;
  children: React.ReactNode;
}

export const DioObject: React.FC<DioObjectProps> = ({
  x = 0,
  y = 0,
  depth = 0.7,
  bob = 0,
  shadow = 0,
  hoverTilt = 8,
  className = '',
  children,
}) => {
  const { camX, camY, parX, parY } = useJourney();
  const stationX = useStationX();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const worldX = stationX + x;
  const rel = worldX - camX;
  const parallax = 0.4 + depth * 0.72;
  const screenDX = rel * parallax + parX * depth * 0.8;
  const screenDY = y - camY * 0.55 + parY * depth * 0.8;
  const scale = 0.72 + depth * 0.4;
  const vis = clamp(1.7 - Math.abs(rel) / 1250, 0, 1);
  const faceY = clamp(rel * 0.008, -10, 10);
  const zi = 10 + Math.round(depth * 90);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: -((e.clientY - r.top) / r.height - 0.5) * hoverTilt,
      y: ((e.clientX - r.left) / r.width - 0.5) * hoverTilt,
    });
  };

  const bobClass = bob === 1 ? 'dio-bob' : bob === 2 ? 'dio-bob-2' : bob === 3 ? 'dio-bob-3' : '';

  /* Gerak otomatis: amplitudo & tempo dari depth, arah dari sisi x, fase
     dari posisi x — jadi tiap objek mengambang dan bergeser sendiri-sendiri
     (staggered), tidak pernah serempak, dan loop-nya seamless. */
  const dir = x < 0 ? -1 : 1;
  const floatVars = {
    '--dx': `${(dir * (9 + depth * 20)).toFixed(1)}px`,
    '--dy': `${(6 + depth * 15).toFixed(1)}px`,
    '--dr': `${(0.35 + depth * 1.1).toFixed(2)}deg`,
    '--dur': `${(17 + depth * 13).toFixed(1)}s`,
    '--delay': `${(-((Math.abs(x) % 420) / 420) * 9).toFixed(2)}s`,
  } as React.CSSProperties;

  return (
    <div
      className="dio-obj"
      style={{
        transform: `translate3d(calc(-50% + ${screenDX.toFixed(1)}px), calc(-50% + ${screenDY.toFixed(1)}px), 0) scale(${scale.toFixed(3)})`,
        opacity: vis < 1 ? vis * vis : undefined,
        zIndex: zi,
        pointerEvents: vis > 0.75 ? 'auto' : 'none',
      }}
    >
      <div className="dio-float" style={floatVars}>
        <div className={bobClass}>
          <div
            className={className}
            style={{ transform: `perspective(780px) rotateY(${(faceY + tilt.y).toFixed(2)}deg) rotateX(${tilt.x.toFixed(2)}deg)` }}
            onMouseMove={hoverTilt ? onMove : undefined}
            onMouseLeave={hoverTilt ? () => setTilt({ x: 0, y: 0 }) : undefined}
          >
            {shadow > 0 && (
              <div
                className="dio-shadow"
                style={{ width: shadow, height: shadow * 0.26, bottom: -26, opacity: 0.35 + vis * 0.4 }}
              />
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

/* Judul ruangan */
export const StationTitle: React.FC<{ kicker: string; title: React.ReactNode; sub?: string; accent?: string }> = ({
  kicker,
  title,
  sub,
  accent = 'var(--accent-strong)',
}) => (
  <div className="text-left">
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 border border-[var(--line)] text-xs font-bold uppercase tracking-widest mb-3 shadow-warm-sm"
      style={{ color: accent }}
    >
      {kicker}
    </div>
    <h2 className="font-heading font-extrabold tracking-tight text-[var(--ink)] leading-[1.05] text-3xl sm:text-4xl xl:text-5xl">
      {title}
    </h2>
    {sub && <p className="mt-3 text-[var(--ink-soft)] text-sm sm:text-base max-w-md">{sub}</p>}
  </div>
);

/** 1 saat ruangan aktif, 0 saat jauh — untuk mematikan hal berat (mis. loop game). */
export const useRoomFocus = () => {
  const idx = useStationIndex();
  const { diorama } = useLayout();
  const { stationF } = useJourney();
  return diorama ? 1 - clamp(Math.abs(stationF - idx), 0, 1.4) : 1;
};
